-- GEA rental backend MVP.
-- Shopify remains the commerce system. Supabase owns serialized rental inventory,
-- unit assignment, and the audit trail for WMS/return events.

CREATE TABLE public.inventory_units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id text NOT NULL UNIQUE,
  serial_number text NOT NULL UNIQUE,
  shopify_product_id text,
  shopify_variant_id text NOT NULL,
  sku text NOT NULL,
  availability_status text NOT NULL DEFAULT 'in_stock'
    CHECK (availability_status IN ('in_stock', 'out_of_stock')),
  condition_status text NOT NULL DEFAULT 'cleaned_and_ready'
    CHECK (condition_status IN (
      'cleaned_and_ready',
      'under_inspection',
      'marked_damaged_for_inspection'
    )),
  rental_count integer NOT NULL DEFAULT 0 CHECK (rental_count >= 0),
  total_days_out integer NOT NULL DEFAULT 0 CHECK (total_days_out >= 0),
  location text,
  ready_since timestamptz DEFAULT now(),
  last_shipped_at timestamptz,
  last_returned_at timestamptz,
  last_inspected_at timestamptz,
  notes text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.rental_reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shopify_order_id text NOT NULL,
  shopify_order_name text,
  shopify_line_item_id text,
  shopify_customer_id text,
  shopify_product_id text,
  shopify_variant_id text NOT NULL,
  sku text NOT NULL,
  inventory_unit_id uuid NOT NULL REFERENCES public.inventory_units(id),
  unit_id text NOT NULL,
  serial_number text NOT NULL,
  internal_status text NOT NULL DEFAULT 'assigned'
    CHECK (internal_status IN (
      'assigned',
      'released_to_wms',
      'shipped',
      'return_open',
      'closed',
      'damage_review',
      'cancelled'
    )),
  assigned_at timestamptz NOT NULL DEFAULT now(),
  released_to_wms_at timestamptz,
  shipped_at timestamptz,
  return_opened_at timestamptz,
  returned_at timestamptz,
  closed_at timestamptz,
  rental_start date,
  rental_end date,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.wms_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL DEFAULT 'unknown',
  event_type text NOT NULL CHECK (event_type IN (
    'order_accepted',
    'serial_picked',
    'shipment_created',
    'return_opened',
    'return_received',
    'return_processed_restocked',
    'return_processed_not_restocked',
    'condition_result',
    'missing_lost'
  )),
  shopify_order_id text,
  shopify_line_item_id text,
  inventory_unit_id uuid REFERENCES public.inventory_units(id),
  unit_id text,
  serial_number text,
  sku text,
  tracking_number text,
  condition_status text CHECK (
    condition_status IS NULL OR condition_status IN (
      'cleaned_and_ready',
      'under_inspection',
      'marked_damaged_for_inspection'
    )
  ),
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  processed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.shopify_wms_field_config (
  id smallint PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  field_strategy text NOT NULL DEFAULT 'order_metafield'
    CHECK (field_strategy IN (
      'line_item_property',
      'order_metafield',
      'order_note_attribute',
      'fulfillment_note',
      'order_tag',
      'wms_rest_api'
    )),
  field_namespace text NOT NULL DEFAULT 'gea',
  field_key text NOT NULL DEFAULT 'assigned_serials',
  is_active boolean NOT NULL DEFAULT true,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.shopify_wms_field_config (id, notes)
VALUES (
  1,
  'MVP starts configurable. Use the first Shopify/WMS-readable field the supplier confirms; order metafield is safest for post-payment serial assignment.'
)
ON CONFLICT (id) DO NOTHING;

CREATE INDEX inventory_units_variant_ready_idx
  ON public.inventory_units (shopify_variant_id, availability_status, condition_status, rental_count, ready_since);

CREATE INDEX inventory_units_sku_idx
  ON public.inventory_units (sku);

CREATE INDEX rental_reservations_order_idx
  ON public.rental_reservations (shopify_order_id);

CREATE INDEX rental_reservations_unit_idx
  ON public.rental_reservations (inventory_unit_id);

CREATE INDEX rental_reservations_internal_status_idx
  ON public.rental_reservations (internal_status);

CREATE INDEX wms_events_order_idx
  ON public.wms_events (shopify_order_id);

CREATE INDEX wms_events_serial_idx
  ON public.wms_events (serial_number);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER inventory_units_set_updated_at
  BEFORE UPDATE ON public.inventory_units
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER rental_reservations_set_updated_at
  BEFORE UPDATE ON public.rental_reservations
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER shopify_wms_field_config_set_updated_at
  BEFORE UPDATE ON public.shopify_wms_field_config
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.assign_least_used_inventory_unit(
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
  ORDER BY rental_count ASC, ready_since ASC NULLS LAST, created_at ASC
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
  selected_unit := public.assign_least_used_inventory_unit(p_shopify_variant_id, p_sku);

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
END;
$$;

CREATE OR REPLACE FUNCTION public.mark_unit_shipped(
  p_serial_number text,
  p_shopify_order_id text DEFAULT NULL,
  p_shopify_line_item_id text DEFAULT NULL,
  p_tracking_number text DEFAULT NULL
)
RETURNS public.inventory_units
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated_unit public.inventory_units;
BEGIN
  UPDATE public.inventory_units
  SET availability_status = 'out_of_stock',
      last_shipped_at = now(),
      rental_count = rental_count + 1
  WHERE serial_number = p_serial_number
  RETURNING * INTO updated_unit;

  IF updated_unit.id IS NULL THEN
    RAISE EXCEPTION 'No inventory unit found for serial %', p_serial_number;
  END IF;

  UPDATE public.rental_reservations
  SET internal_status = 'shipped',
      shipped_at = now()
  WHERE serial_number = p_serial_number
    AND (p_shopify_order_id IS NULL OR shopify_order_id = p_shopify_order_id)
    AND (p_shopify_line_item_id IS NULL OR shopify_line_item_id = p_shopify_line_item_id)
    AND internal_status IN ('assigned', 'released_to_wms');

  INSERT INTO public.wms_events (
    source,
    event_type,
    shopify_order_id,
    shopify_line_item_id,
    inventory_unit_id,
    unit_id,
    serial_number,
    sku,
    tracking_number,
    processed_at
  )
  VALUES (
    'backend',
    'shipment_created',
    p_shopify_order_id,
    p_shopify_line_item_id,
    updated_unit.id,
    updated_unit.unit_id,
    updated_unit.serial_number,
    updated_unit.sku,
    p_tracking_number,
    now()
  );

  RETURN updated_unit;
END;
$$;

CREATE OR REPLACE FUNCTION public.mark_unit_return_open(
  p_serial_number text,
  p_shopify_order_id text DEFAULT NULL,
  p_shopify_line_item_id text DEFAULT NULL
)
RETURNS public.inventory_units
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated_unit public.inventory_units;
BEGIN
  UPDATE public.inventory_units
  SET availability_status = 'out_of_stock',
      condition_status = 'under_inspection',
      last_returned_at = now()
  WHERE serial_number = p_serial_number
  RETURNING * INTO updated_unit;

  IF updated_unit.id IS NULL THEN
    RAISE EXCEPTION 'No inventory unit found for serial %', p_serial_number;
  END IF;

  UPDATE public.rental_reservations
  SET internal_status = 'return_open',
      return_opened_at = now()
  WHERE serial_number = p_serial_number
    AND (p_shopify_order_id IS NULL OR shopify_order_id = p_shopify_order_id)
    AND (p_shopify_line_item_id IS NULL OR shopify_line_item_id = p_shopify_line_item_id)
    AND internal_status IN ('assigned', 'released_to_wms', 'shipped');

  INSERT INTO public.wms_events (
    source,
    event_type,
    shopify_order_id,
    shopify_line_item_id,
    inventory_unit_id,
    unit_id,
    serial_number,
    sku,
    condition_status,
    processed_at
  )
  VALUES (
    'backend',
    'return_opened',
    p_shopify_order_id,
    p_shopify_line_item_id,
    updated_unit.id,
    updated_unit.unit_id,
    updated_unit.serial_number,
    updated_unit.sku,
    updated_unit.condition_status,
    now()
  );

  RETURN updated_unit;
END;
$$;

CREATE OR REPLACE FUNCTION public.mark_unit_return_processed(
  p_serial_number text,
  p_restocked boolean,
  p_shopify_order_id text DEFAULT NULL,
  p_shopify_line_item_id text DEFAULT NULL
)
RETURNS public.inventory_units
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated_unit public.inventory_units;
BEGIN
  UPDATE public.inventory_units
  SET availability_status = CASE WHEN p_restocked THEN 'in_stock' ELSE 'out_of_stock' END,
      condition_status = CASE
        WHEN p_restocked THEN 'cleaned_and_ready'
        ELSE 'marked_damaged_for_inspection'
      END,
      ready_since = CASE WHEN p_restocked THEN now() ELSE NULL END,
      last_inspected_at = now()
  WHERE serial_number = p_serial_number
  RETURNING * INTO updated_unit;

  IF updated_unit.id IS NULL THEN
    RAISE EXCEPTION 'No inventory unit found for serial %', p_serial_number;
  END IF;

  UPDATE public.rental_reservations
  SET internal_status = CASE WHEN p_restocked THEN 'closed' ELSE 'damage_review' END,
      returned_at = COALESCE(returned_at, now()),
      closed_at = CASE WHEN p_restocked THEN now() ELSE closed_at END
  WHERE serial_number = p_serial_number
    AND (p_shopify_order_id IS NULL OR shopify_order_id = p_shopify_order_id)
    AND (p_shopify_line_item_id IS NULL OR shopify_line_item_id = p_shopify_line_item_id)
    AND internal_status IN ('assigned', 'released_to_wms', 'shipped', 'return_open');

  INSERT INTO public.wms_events (
    source,
    event_type,
    shopify_order_id,
    shopify_line_item_id,
    inventory_unit_id,
    unit_id,
    serial_number,
    sku,
    condition_status,
    processed_at
  )
  VALUES (
    'backend',
    CASE WHEN p_restocked THEN 'return_processed_restocked' ELSE 'return_processed_not_restocked' END,
    p_shopify_order_id,
    p_shopify_line_item_id,
    updated_unit.id,
    updated_unit.unit_id,
    updated_unit.serial_number,
    updated_unit.sku,
    updated_unit.condition_status,
    now()
  );

  RETURN updated_unit;
END;
$$;

ALTER TABLE public.inventory_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wms_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopify_wms_field_config ENABLE ROW LEVEL SECURITY;

-- Step 1: Idempotency hardening for rental reservation creation.
CREATE UNIQUE INDEX IF NOT EXISTS rental_reservations_order_line_unique_idx
  ON public.rental_reservations (shopify_order_id, shopify_line_item_id)
  WHERE shopify_line_item_id IS NOT NULL;

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
    selected_unit := public.assign_least_used_inventory_unit(p_shopify_variant_id, p_sku);

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

-- Step 2: Most-rented assignment + retire flagging.
ALTER TABLE public.inventory_units
  ADD COLUMN IF NOT EXISTS acquired_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS retire_flagged boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS retire_flagged_at timestamptz,
  ADD COLUMN IF NOT EXISTS retired boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS retired_at timestamptz,
  ADD COLUMN IF NOT EXISTS retail_price_cache numeric(10,2);

UPDATE public.inventory_units
SET acquired_at = created_at;

ALTER TABLE public.inventory_units
  DROP CONSTRAINT IF EXISTS inventory_units_availability_status_check;
ALTER TABLE public.inventory_units
  ADD CONSTRAINT inventory_units_availability_status_check
  CHECK (availability_status IN ('in_stock', 'out_of_stock', 'kept', 'retired'));

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

-- Step 3: Membership tiers, cycles, charges, returns.
CREATE TABLE public.memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shopify_customer_id text NOT NULL,
  shopify_subscription_contract_id text,
  auth_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  tier text NOT NULL CHECK (tier IN ('three_piece', 'six_piece', 'ten_piece')),
  free_items_per_cycle integer NOT NULL CHECK (free_items_per_cycle > 0),
  keep_allowance_per_cycle integer NOT NULL DEFAULT 1 CHECK (keep_allowance_per_cycle >= 0),
  status text NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'paused', 'cancelled', 'expired')),
  started_at timestamptz NOT NULL DEFAULT now(),
  cancelled_at timestamptz,
  tier_source jsonb NOT NULL DEFAULT '{}'::jsonb,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX memberships_active_customer_unique_idx
  ON public.memberships (shopify_customer_id)
  WHERE status = 'active';
CREATE UNIQUE INDEX memberships_subscription_contract_unique_idx
  ON public.memberships (shopify_subscription_contract_id)
  WHERE shopify_subscription_contract_id IS NOT NULL;
CREATE INDEX memberships_auth_user_idx ON public.memberships (auth_user_id);
CREATE INDEX memberships_customer_idx ON public.memberships (shopify_customer_id);

CREATE TABLE public.rental_cycles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  membership_id uuid NOT NULL REFERENCES public.memberships(id) ON DELETE CASCADE,
  cycle_number integer NOT NULL CHECK (cycle_number >= 1),
  cycle_start timestamptz NOT NULL,
  cycle_end timestamptz NOT NULL,
  free_items_allowance integer NOT NULL,
  keep_allowance integer NOT NULL,
  checkout_count integer NOT NULL DEFAULT 0,
  free_used integer NOT NULL DEFAULT 0,
  extra_items integer NOT NULL DEFAULT 0,
  keep_count integer NOT NULL DEFAULT 0,
  extra_keeps integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  cycle_tag_applied boolean NOT NULL DEFAULT false,
  tag_applied_at timestamptz,
  tag_removed_at timestamptz,
  reconciled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (membership_id, cycle_number)
);
CREATE INDEX rental_cycles_membership_idx ON public.rental_cycles (membership_id);

CREATE TABLE public.charges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  membership_id uuid REFERENCES public.memberships(id) ON DELETE SET NULL,
  rental_cycle_id uuid REFERENCES public.rental_cycles(id) ON DELETE SET NULL,
  rental_reservation_id uuid REFERENCES public.rental_reservations(id) ON DELETE SET NULL,
  charge_type text NOT NULL CHECK (charge_type IN ('extra_keep_fee')),
  amount numeric(10,2) NOT NULL CHECK (amount >= 0),
  currency text NOT NULL DEFAULT 'USD',
  quantity integer NOT NULL DEFAULT 1,
  basis jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'charged', 'failed', 'void')),
  shopify_charge_ref text,
  idempotency_key text NOT NULL UNIQUE,
  error text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX charges_membership_idx ON public.charges (membership_id);
CREATE INDEX charges_cycle_idx ON public.charges (rental_cycle_id);
CREATE INDEX charges_status_idx ON public.charges (status);

CREATE TABLE public.member_returns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  membership_id uuid REFERENCES public.memberships(id) ON DELETE SET NULL,
  rental_cycle_id uuid REFERENCES public.rental_cycles(id) ON DELETE SET NULL,
  shopify_order_id text,
  shopify_return_id text,
  source text NOT NULL DEFAULT 'manual'
    CHECK (source IN ('manual', 'shopify_return', 'wms')),
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'reconciled')),
  expected_serials text[] NOT NULL DEFAULT '{}',
  returned_serials text[] NOT NULL DEFAULT '{}',
  kept_serials text[] NOT NULL DEFAULT '{}',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  reconciled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX member_returns_membership_idx ON public.member_returns (membership_id);
CREATE INDEX member_returns_order_idx ON public.member_returns (shopify_order_id);
CREATE INDEX member_returns_status_idx ON public.member_returns (status);

ALTER TABLE public.rental_reservations
  ADD COLUMN IF NOT EXISTS membership_id uuid REFERENCES public.memberships(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS rental_cycle_id uuid REFERENCES public.rental_cycles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS is_free_item boolean,
  ADD COLUMN IF NOT EXISTS keep_requested boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS kept_at timestamptz,
  ADD COLUMN IF NOT EXISTS item_price_cache numeric(10,2);

ALTER TABLE public.rental_reservations
  DROP CONSTRAINT IF EXISTS rental_reservations_internal_status_check;
ALTER TABLE public.rental_reservations
  ADD CONSTRAINT rental_reservations_internal_status_check
  CHECK (internal_status IN (
    'assigned', 'released_to_wms', 'shipped', 'return_open',
    'closed', 'damage_review', 'cancelled', 'kept', 'lost'
  ));

CREATE INDEX rental_reservations_membership_idx ON public.rental_reservations (membership_id);
CREATE INDEX rental_reservations_cycle_idx ON public.rental_reservations (rental_cycle_id);

ALTER TABLE public.wms_events
  DROP CONSTRAINT IF EXISTS wms_events_event_type_check;
ALTER TABLE public.wms_events
  ADD CONSTRAINT wms_events_event_type_check
  CHECK (event_type IN (
    'order_accepted', 'serial_picked', 'shipment_created', 'return_opened',
    'return_received', 'return_processed_restocked', 'return_processed_not_restocked',
    'condition_result', 'missing_lost', 'item_kept', 'item_lost'
  ));

CREATE TRIGGER memberships_set_updated_at
  BEFORE UPDATE ON public.memberships
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER rental_cycles_set_updated_at
  BEFORE UPDATE ON public.rental_cycles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER charges_set_updated_at
  BEFORE UPDATE ON public.charges
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER member_returns_set_updated_at
  BEFORE UPDATE ON public.member_returns
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.current_cycle_number(
  p_started_at timestamptz,
  p_at timestamptz DEFAULT now()
)
RETURNS integer
LANGUAGE sql
STABLE
AS $$
  SELECT GREATEST(
    1,
    floor(extract(epoch FROM (p_at - p_started_at)) / (30 * 86400))::int + 1
  );
$$;

CREATE OR REPLACE FUNCTION public.tier_allowances(p_tier text)
RETURNS TABLE (free_items integer, keep_allowance integer)
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT
    CASE p_tier WHEN 'three_piece' THEN 3 WHEN 'six_piece' THEN 6 WHEN 'ten_piece' THEN 10 END,
    CASE p_tier WHEN 'three_piece' THEN 1 WHEN 'six_piece' THEN 2 WHEN 'ten_piece' THEN 3 END;
$$;

CREATE OR REPLACE FUNCTION public.get_or_create_current_cycle(p_membership_id uuid)
RETURNS public.rental_cycles
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_membership public.memberships;
  v_n integer;
  v_start timestamptz;
  v_end timestamptz;
  v_cycle public.rental_cycles;
BEGIN
  SELECT * INTO v_membership FROM public.memberships WHERE id = p_membership_id;
  IF v_membership.id IS NULL THEN
    RAISE EXCEPTION 'Membership % not found', p_membership_id;
  END IF;

  v_n := public.current_cycle_number(v_membership.started_at, now());
  v_start := v_membership.started_at + ((v_n - 1) * interval '30 days');
  v_end := v_membership.started_at + (v_n * interval '30 days');

  INSERT INTO public.rental_cycles (
    membership_id, cycle_number, cycle_start, cycle_end,
    free_items_allowance, keep_allowance
  )
  VALUES (
    p_membership_id, v_n, v_start, v_end,
    v_membership.free_items_per_cycle, v_membership.keep_allowance_per_cycle
  )
  ON CONFLICT (membership_id, cycle_number) DO NOTHING;

  UPDATE public.rental_cycles
  SET status = 'closed'
  WHERE membership_id = p_membership_id
    AND cycle_number < v_n
    AND status = 'open';

  SELECT * INTO v_cycle
  FROM public.rental_cycles
  WHERE membership_id = p_membership_id AND cycle_number = v_n;

  RETURN v_cycle;
END;
$$;

CREATE OR REPLACE FUNCTION public.count_checkout_for_reservation(p_reservation_id uuid)
RETURNS public.rental_reservations
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_res public.rental_reservations;
  v_membership public.memberships;
  v_cycle public.rental_cycles;
  v_count integer;
  v_allowance integer;
  v_unit_retail numeric(10,2);
BEGIN
  SELECT * INTO v_res FROM public.rental_reservations WHERE id = p_reservation_id;
  IF v_res.id IS NULL THEN
    RAISE EXCEPTION 'Reservation % not found', p_reservation_id;
  END IF;

  IF v_res.rental_cycle_id IS NOT NULL THEN
    RETURN v_res;
  END IF;

  IF v_res.shopify_customer_id IS NOT NULL THEN
    SELECT * INTO v_membership
    FROM public.memberships
    WHERE shopify_customer_id = v_res.shopify_customer_id AND status = 'active'
    LIMIT 1;
  END IF;

  IF v_membership.id IS NULL THEN
    SELECT retail_price_cache INTO v_unit_retail
    FROM public.inventory_units WHERE id = v_res.inventory_unit_id;
    UPDATE public.rental_reservations
    SET item_price_cache = COALESCE(item_price_cache, v_unit_retail)
    WHERE id = p_reservation_id
    RETURNING * INTO v_res;
    RETURN v_res;
  END IF;

  v_cycle := public.get_or_create_current_cycle(v_membership.id);

  UPDATE public.rental_cycles
  SET checkout_count = checkout_count + 1,
      free_used = LEAST(checkout_count + 1, free_items_allowance),
      extra_items = GREATEST(0, (checkout_count + 1) - free_items_allowance)
  WHERE id = v_cycle.id
  RETURNING checkout_count, free_items_allowance INTO v_count, v_allowance;

  SELECT retail_price_cache INTO v_unit_retail
  FROM public.inventory_units WHERE id = v_res.inventory_unit_id;

  UPDATE public.rental_reservations
  SET membership_id = v_membership.id,
      rental_cycle_id = v_cycle.id,
      is_free_item = (v_count <= v_allowance),
      item_price_cache = COALESCE(item_price_cache, v_unit_retail)
  WHERE id = p_reservation_id
  RETURNING * INTO v_res;

  RETURN v_res;
END;
$$;

CREATE OR REPLACE FUNCTION public.upsert_membership_from_contract(
  p_shopify_customer_id text,
  p_shopify_subscription_contract_id text,
  p_tier text,
  p_status text DEFAULT 'active',
  p_started_at timestamptz DEFAULT now(),
  p_tier_source jsonb DEFAULT '{}'::jsonb
)
RETURNS public.memberships
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_free integer;
  v_keep integer;
  v_membership public.memberships;
BEGIN
  SELECT free_items, keep_allowance INTO v_free, v_keep
  FROM public.tier_allowances(p_tier);

  IF v_free IS NULL THEN
    RAISE EXCEPTION 'Unknown tier %', p_tier;
  END IF;

  INSERT INTO public.memberships (
    shopify_customer_id, shopify_subscription_contract_id, tier,
    free_items_per_cycle, keep_allowance_per_cycle, status, started_at, tier_source
  )
  VALUES (
    p_shopify_customer_id, p_shopify_subscription_contract_id, p_tier,
    v_free, v_keep, p_status, p_started_at, COALESCE(p_tier_source, '{}'::jsonb)
  )
  ON CONFLICT (shopify_subscription_contract_id) DO UPDATE
  SET tier = EXCLUDED.tier,
      free_items_per_cycle = EXCLUDED.free_items_per_cycle,
      keep_allowance_per_cycle = EXCLUDED.keep_allowance_per_cycle,
      status = EXCLUDED.status,
      tier_source = EXCLUDED.tier_source,
      cancelled_at = CASE WHEN EXCLUDED.status IN ('cancelled', 'expired') THEN now() ELSE NULL END
  RETURNING * INTO v_membership;

  RETURN v_membership;
END;
$$;

CREATE OR REPLACE FUNCTION public.mark_unit_kept(
  p_serial_number text,
  p_shopify_order_id text DEFAULT NULL,
  p_shopify_line_item_id text DEFAULT NULL
)
RETURNS public.inventory_units
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_unit public.inventory_units;
  v_res public.rental_reservations;
BEGIN
  UPDATE public.inventory_units
  SET availability_status = 'kept',
      ready_since = NULL,
      last_returned_at = now()
  WHERE serial_number = p_serial_number
  RETURNING * INTO v_unit;

  IF v_unit.id IS NULL THEN
    RAISE EXCEPTION 'No inventory unit found for serial %', p_serial_number;
  END IF;

  UPDATE public.rental_reservations
  SET internal_status = 'kept',
      keep_requested = true,
      kept_at = now(),
      returned_at = COALESCE(returned_at, now())
  WHERE serial_number = p_serial_number
    AND (p_shopify_order_id IS NULL OR shopify_order_id = p_shopify_order_id)
    AND (p_shopify_line_item_id IS NULL OR shopify_line_item_id = p_shopify_line_item_id)
    AND internal_status NOT IN ('kept', 'closed', 'cancelled', 'lost')
  RETURNING * INTO v_res;

  IF v_res.rental_cycle_id IS NOT NULL THEN
    UPDATE public.rental_cycles
    SET keep_count = keep_count + 1,
        extra_keeps = GREATEST(0, (keep_count + 1) - keep_allowance)
    WHERE id = v_res.rental_cycle_id;
  END IF;

  INSERT INTO public.wms_events (
    source, event_type, shopify_order_id, shopify_line_item_id,
    inventory_unit_id, unit_id, serial_number, sku, processed_at
  )
  VALUES (
    'backend', 'item_kept', p_shopify_order_id, p_shopify_line_item_id,
    v_unit.id, v_unit.unit_id, v_unit.serial_number, v_unit.sku, now()
  );

  RETURN v_unit;
END;
$$;

CREATE OR REPLACE FUNCTION public.reconcile_member_return(
  p_return_id uuid,
  p_force boolean DEFAULT false
)
RETURNS public.member_returns
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_return public.member_returns;
  v_kept text[];
  v_serial text;
  v_grace_passed boolean;
BEGIN
  SELECT * INTO v_return FROM public.member_returns WHERE id = p_return_id;
  IF v_return.id IS NULL THEN
    RAISE EXCEPTION 'Member return % not found', p_return_id;
  END IF;

  FOREACH v_serial IN ARRAY v_return.returned_serials LOOP
    PERFORM public.mark_unit_return_processed(v_serial, true, v_return.shopify_order_id, NULL);
  END LOOP;

  v_kept := ARRAY(
    SELECT unnest(v_return.expected_serials)
    EXCEPT
    SELECT unnest(v_return.returned_serials)
  );

  v_grace_passed := (now() - v_return.created_at) > interval '3 days';

  IF p_force OR v_grace_passed THEN
    FOREACH v_serial IN ARRAY v_kept LOOP
      PERFORM public.mark_unit_kept(v_serial, v_return.shopify_order_id, NULL);
    END LOOP;

    UPDATE public.member_returns
    SET kept_serials = v_kept,
        status = 'reconciled',
        reconciled_at = now()
    WHERE id = p_return_id
    RETURNING * INTO v_return;
  ELSE
    UPDATE public.member_returns
    SET kept_serials = v_kept
    WHERE id = p_return_id
    RETURNING * INTO v_return;
  END IF;

  RETURN v_return;
END;
$$;

CREATE OR REPLACE FUNCTION public.compute_keep_fees(p_cycle_id uuid)
RETURNS TABLE (
  rental_reservation_id uuid,
  serial_number text,
  item_price numeric(10,2),
  fee_amount numeric(10,2)
)
LANGUAGE sql
STABLE
AS $$
  WITH cyc AS (
    SELECT keep_allowance FROM public.rental_cycles WHERE id = p_cycle_id
  ),
  kept AS (
    SELECT r.id, r.serial_number, COALESCE(r.item_price_cache, 0) AS price,
           row_number() OVER (ORDER BY r.kept_at ASC, r.id ASC) AS rn
    FROM public.rental_reservations r
    WHERE r.rental_cycle_id = p_cycle_id AND r.internal_status = 'kept'
  )
  SELECT kept.id, kept.serial_number, kept.price,
         round(kept.price * 0.40, 2) AS fee_amount
  FROM kept, cyc
  WHERE kept.rn > cyc.keep_allowance;
$$;

CREATE OR REPLACE FUNCTION public.create_charge(
  p_membership_id uuid,
  p_rental_cycle_id uuid,
  p_rental_reservation_id uuid,
  p_charge_type text,
  p_amount numeric,
  p_basis jsonb,
  p_idempotency_key text
)
RETURNS public.charges
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_charge public.charges;
BEGIN
  INSERT INTO public.charges (
    membership_id, rental_cycle_id, rental_reservation_id,
    charge_type, amount, basis, idempotency_key
  )
  VALUES (
    p_membership_id, p_rental_cycle_id, p_rental_reservation_id,
    p_charge_type, p_amount, COALESCE(p_basis, '{}'::jsonb), p_idempotency_key
  )
  ON CONFLICT (idempotency_key) DO NOTHING
  RETURNING * INTO v_charge;

  IF v_charge.id IS NULL THEN
    SELECT * INTO v_charge FROM public.charges WHERE idempotency_key = p_idempotency_key;
  END IF;

  RETURN v_charge;
END;
$$;

-- Staff allowlist (team members who use /admin/rental-ops).
CREATE TABLE public.staff (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.staff WHERE user_id = auth.uid());
$$;

ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.charges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_returns ENABLE ROW LEVEL SECURITY;

CREATE POLICY staff_read_inventory ON public.inventory_units FOR SELECT USING (public.is_staff());
CREATE POLICY staff_read_reservations ON public.rental_reservations FOR SELECT USING (public.is_staff());
CREATE POLICY staff_read_wms_events ON public.wms_events FOR SELECT USING (public.is_staff());
CREATE POLICY staff_read_memberships ON public.memberships FOR SELECT USING (public.is_staff());
CREATE POLICY staff_read_cycles ON public.rental_cycles FOR SELECT USING (public.is_staff());
CREATE POLICY staff_read_charges ON public.charges FOR SELECT USING (public.is_staff());
CREATE POLICY staff_read_returns ON public.member_returns FOR SELECT USING (public.is_staff());
CREATE POLICY staff_self ON public.staff FOR SELECT USING (user_id = auth.uid());

CREATE POLICY member_read_own_membership ON public.memberships
  FOR SELECT USING (auth_user_id = auth.uid());
CREATE POLICY member_read_own_cycles ON public.rental_cycles
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.memberships m
    WHERE m.id = rental_cycles.membership_id AND m.auth_user_id = auth.uid()
  ));
CREATE POLICY member_read_own_reservations ON public.rental_reservations
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.memberships m
    WHERE m.id = rental_reservations.membership_id AND m.auth_user_id = auth.uid()
  ));
CREATE POLICY member_read_own_charges ON public.charges
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.memberships m
    WHERE m.id = charges.membership_id AND m.auth_user_id = auth.uid()
  ));

CREATE POLICY staff_update_inventory ON public.inventory_units
  FOR UPDATE USING (public.is_staff()) WITH CHECK (public.is_staff());

-- ============================================================================
-- GRANTS: Data API access. RLS policies above still gate which rows each role sees.
-- Staff/members read these tables directly from the app as the authenticated role;
-- edge functions use service_role.
-- ============================================================================
GRANT SELECT, UPDATE ON public.inventory_units TO authenticated;
GRANT SELECT ON public.rental_reservations TO authenticated;
GRANT SELECT ON public.wms_events TO authenticated;
GRANT SELECT ON public.memberships TO authenticated;
GRANT SELECT ON public.rental_cycles TO authenticated;
GRANT SELECT ON public.charges TO authenticated;
GRANT SELECT ON public.member_returns TO authenticated;
GRANT SELECT ON public.staff TO authenticated;

GRANT ALL ON public.inventory_units TO service_role;
GRANT ALL ON public.rental_reservations TO service_role;
GRANT ALL ON public.wms_events TO service_role;
GRANT ALL ON public.shopify_wms_field_config TO service_role;
GRANT ALL ON public.memberships TO service_role;
GRANT ALL ON public.rental_cycles TO service_role;
GRANT ALL ON public.charges TO service_role;
GRANT ALL ON public.member_returns TO service_role;
GRANT ALL ON public.staff TO service_role;