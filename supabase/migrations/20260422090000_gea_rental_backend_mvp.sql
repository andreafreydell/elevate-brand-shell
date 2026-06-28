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
