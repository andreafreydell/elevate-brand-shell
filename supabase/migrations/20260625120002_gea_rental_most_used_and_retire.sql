-- Step 2: Flip unit assignment to MOST-rented, and flag worn units for retirement.
--
-- Business intent: deliberately wear ONE unit down (always send the most-rented
-- ready unit), and once a unit has been rented more than 3 times, flag it for the
-- team to review for retirement. The team makes the final retire call; flagged
-- units stay assignable until explicitly retired. Retired units never reassign.

-- 1. New lifecycle/accounting columns on inventory_units.
ALTER TABLE public.inventory_units
  ADD COLUMN IF NOT EXISTS acquired_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS retire_flagged boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS retire_flagged_at timestamptz,
  ADD COLUMN IF NOT EXISTS retired boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS retired_at timestamptz,
  ADD COLUMN IF NOT EXISTS retail_price_cache numeric(10,2);

-- Backfill acquisition date to the true creation date for any existing rows
-- (the DEFAULT now() above stamps existing rows at migration time, which would
-- lose their real acquisition order for the most-rented tie-break).
UPDATE public.inventory_units
SET acquired_at = created_at;

-- 2. Allow new availability states: 'kept' (member kept it) and 'retired'.
ALTER TABLE public.inventory_units
  DROP CONSTRAINT IF EXISTS inventory_units_availability_status_check;
ALTER TABLE public.inventory_units
  ADD CONSTRAINT inventory_units_availability_status_check
  CHECK (availability_status IN ('in_stock', 'out_of_stock', 'kept', 'retired'));

-- 3. Most-rented-first assignment. Same locking semantics as the least-used RPC,
-- but ordered by highest rental_count and excluding retired units.
CREATE OR REPLACE FUNCTION public.assign_most_used_inventory_unit(
  p_shopify_variant_id text,
  p_sku text DEFAULT NULL
)
RETURNS public.inventory_units
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  selected_unit public.inventory_units;
BEGIN
  SELECT *
  INTO selected_unit
  FROM public.inventory_units
  WHERE shopify_variant_id = p_shopify_variant_id
    AND (p_sku IS NULL OR sku = p_sku)
    AND availability_status = 'in_stock'
    AND condition_status = 'cleaned_and_ready'
    AND retired = false
  ORDER BY rental_count DESC, acquired_at ASC, created_at ASC
  FOR UPDATE SKIP LOCKED
  LIMIT 1;

  IF selected_unit.id IS NULL THEN
    RAISE EXCEPTION 'No cleaned and ready inventory unit available for variant %', p_shopify_variant_id;
  END IF;

  UPDATE public.inventory_units
  SET availability_status = 'out_of_stock',
      ready_since = NULL
  WHERE id = selected_unit.id
  RETURNING * INTO selected_unit;

  RETURN selected_unit;
END;
$$;

-- 4. Repoint reservation creation to the most-used picker (keeps the Step 1
-- idempotency: fast-path existing reservation + savepoint on race).
CREATE OR REPLACE FUNCTION public.create_rental_reservation_for_order_line(
  p_shopify_order_id text,
  p_shopify_variant_id text,
  p_sku text,
  p_shopify_order_name text DEFAULT NULL,
  p_shopify_line_item_id text DEFAULT NULL,
  p_shopify_customer_id text DEFAULT NULL,
  p_shopify_product_id text DEFAULT NULL,
  p_rental_start date DEFAULT NULL,
  p_rental_end date DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS public.rental_reservations
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  selected_unit public.inventory_units;
  created_reservation public.rental_reservations;
BEGIN
  IF p_shopify_line_item_id IS NOT NULL THEN
    SELECT *
    INTO created_reservation
    FROM public.rental_reservations
    WHERE shopify_order_id = p_shopify_order_id
      AND shopify_line_item_id = p_shopify_line_item_id
    LIMIT 1;

    IF FOUND THEN
      RETURN created_reservation;
    END IF;
  END IF;

  BEGIN
    selected_unit := public.assign_most_used_inventory_unit(p_shopify_variant_id, p_sku);

    INSERT INTO public.rental_reservations (
      shopify_order_id,
      shopify_order_name,
      shopify_line_item_id,
      shopify_customer_id,
      shopify_product_id,
      shopify_variant_id,
      sku,
      inventory_unit_id,
      unit_id,
      serial_number,
      rental_start,
      rental_end,
      metadata
    )
    VALUES (
      p_shopify_order_id,
      p_shopify_order_name,
      p_shopify_line_item_id,
      p_shopify_customer_id,
      p_shopify_product_id,
      p_shopify_variant_id,
      p_sku,
      selected_unit.id,
      selected_unit.unit_id,
      selected_unit.serial_number,
      p_rental_start,
      p_rental_end,
      COALESCE(p_metadata, '{}'::jsonb)
    )
    RETURNING * INTO created_reservation;

    RETURN created_reservation;
  EXCEPTION
    WHEN unique_violation THEN
      SELECT *
      INTO created_reservation
      FROM public.rental_reservations
      WHERE shopify_order_id = p_shopify_order_id
        AND shopify_line_item_id = p_shopify_line_item_id
      LIMIT 1;

      RETURN created_reservation;
  END;
END;
$$;

-- 5. Retire-review flag at rental_count > 3. BEFORE UPDATE so we mutate NEW in
-- place (no recursion). Fires whenever rental_count changes (e.g. mark_unit_shipped).
CREATE OR REPLACE FUNCTION public.flag_unit_for_retirement()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.rental_count > 3 AND NOT NEW.retire_flagged THEN
    NEW.retire_flagged := true;
    NEW.retire_flagged_at := now();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS inventory_units_flag_retirement ON public.inventory_units;
CREATE TRIGGER inventory_units_flag_retirement
  BEFORE UPDATE OF rental_count ON public.inventory_units
  FOR EACH ROW
  EXECUTE FUNCTION public.flag_unit_for_retirement();
