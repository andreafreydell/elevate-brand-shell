-- Step 1: Idempotency hardening for rental reservation creation.
-- Shopify delivers webhooks at-least-once. The original
-- create_rental_reservation_for_order_line assigned a fresh serialized unit on
-- EVERY delivery, so a retried orders/paid webhook double-assigned inventory.
--
-- Fix:
--   1. A partial unique index on (shopify_order_id, shopify_line_item_id) so a
--      given order line can only ever hold one reservation.
--   2. The function now (a) returns the existing reservation on a repeat call
--      without touching inventory, and (b) on a concurrent race, lets the unique
--      violation roll back its own unit assignment (the EXCEPTION block is a
--      savepoint) and returns the winner's reservation.

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
  -- Fast path: a reservation already exists for this order line (webhook retry).
  -- Return it without assigning a new unit.
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

  -- Assign + insert inside a savepoint so a lost concurrent race rolls back the
  -- unit assignment instead of leaking an out_of_stock unit.
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
      -- Another delivery won the race; our unit assignment is rolled back to the
      -- savepoint. Return the reservation that won.
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
