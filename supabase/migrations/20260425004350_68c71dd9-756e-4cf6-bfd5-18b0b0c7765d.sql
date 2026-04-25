-- Step 1: Add lifecycle columns to theolia_test_serials
ALTER TABLE public.theolia_test_serials
  ADD COLUMN IF NOT EXISTS availability_status TEXT NOT NULL DEFAULT 'in_stock',
  ADD COLUMN IF NOT EXISTS condition_status TEXT NOT NULL DEFAULT 'cleaned_and_ready',
  ADD COLUMN IF NOT EXISTS rental_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_shipped_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_returned_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS ready_since TIMESTAMPTZ DEFAULT now(),
  ADD COLUMN IF NOT EXISTS location TEXT NOT NULL DEFAULT 'Stockholm Atelier',
  ADD COLUMN IF NOT EXISTS notes TEXT;

-- Validation trigger (instead of CHECK constraint) for status enums
CREATE OR REPLACE FUNCTION public.validate_unit_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.availability_status NOT IN ('in_stock','reserved','out_of_stock','shipped') THEN
    RAISE EXCEPTION 'Invalid availability_status: %', NEW.availability_status;
  END IF;
  IF NEW.condition_status NOT IN ('cleaned_and_ready','under_inspection','marked_damaged_for_inspection','retired') THEN
    RAISE EXCEPTION 'Invalid condition_status: %', NEW.condition_status;
  END IF;
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_validate_unit_status ON public.theolia_test_serials;
CREATE TRIGGER trg_validate_unit_status
  BEFORE INSERT OR UPDATE ON public.theolia_test_serials
  FOR EACH ROW EXECUTE FUNCTION public.validate_unit_status();

-- Seed/refresh the two existing Theolia units with defaults
UPDATE public.theolia_test_serials
SET availability_status = COALESCE(availability_status, 'in_stock'),
    condition_status = COALESCE(condition_status, 'cleaned_and_ready'),
    ready_since = COALESCE(ready_since, now()),
    location = COALESCE(location, 'Stockholm Atelier');

-- Lifecycle event log
CREATE TABLE IF NOT EXISTS public.unit_lifecycle_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  serial TEXT NOT NULL REFERENCES public.theolia_test_serials(serial) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'webhook',
  shopify_order_id TEXT,
  shopify_order_name TEXT,
  availability_snapshot TEXT,
  condition_snapshot TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_unit_events_serial ON public.unit_lifecycle_events(serial, created_at DESC);

ALTER TABLE public.unit_lifecycle_events ENABLE ROW LEVEL SECURITY;
-- No policies: service-role-only access via edge functions

-- ============ Lifecycle helper functions ============

CREATE OR REPLACE FUNCTION public.mark_unit_reserved(_serial TEXT, _order_id TEXT, _order_name TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.theolia_test_serials
  SET availability_status = 'reserved',
      condition_status = condition_status,
      updated_at = now()
  WHERE serial = _serial;

  INSERT INTO public.unit_lifecycle_events
    (serial, event_type, source, shopify_order_id, shopify_order_name, availability_snapshot, condition_snapshot)
  VALUES
    (_serial, 'reservation_assigned', 'webhook', _order_id, _order_name, 'reserved',
     (SELECT condition_status FROM public.theolia_test_serials WHERE serial = _serial));
  RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION public.mark_unit_shipped(_serial TEXT, _order_id TEXT, _order_name TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.theolia_test_serials
  SET availability_status = 'shipped',
      rental_count = rental_count + 1,
      last_shipped_at = now(),
      ready_since = NULL,
      updated_at = now()
  WHERE serial = _serial;

  INSERT INTO public.unit_lifecycle_events
    (serial, event_type, source, shopify_order_id, shopify_order_name, availability_snapshot, condition_snapshot)
  VALUES
    (_serial, 'shipment_dispatched', 'webhook', _order_id, _order_name, 'shipped',
     (SELECT condition_status FROM public.theolia_test_serials WHERE serial = _serial));
  RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION public.mark_unit_returned(_serial TEXT, _order_id TEXT, _order_name TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.theolia_test_serials
  SET availability_status = 'out_of_stock',
      condition_status = 'under_inspection',
      last_returned_at = now(),
      updated_at = now()
  WHERE serial = _serial;

  INSERT INTO public.unit_lifecycle_events
    (serial, event_type, source, shopify_order_id, shopify_order_name, availability_snapshot, condition_snapshot)
  VALUES
    (_serial, 'return_received', 'webhook', _order_id, _order_name, 'out_of_stock', 'under_inspection');
  RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION public.mark_unit_ready(_serial TEXT, _source TEXT DEFAULT 'manual')
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.theolia_test_serials
  SET availability_status = 'in_stock',
      condition_status = 'cleaned_and_ready',
      ready_since = now(),
      assigned_order_id = NULL,
      assigned_order_name = NULL,
      assigned_line_item_id = NULL,
      assigned_at = NULL,
      updated_at = now()
  WHERE serial = _serial;

  INSERT INTO public.unit_lifecycle_events
    (serial, event_type, source, availability_snapshot, condition_snapshot)
  VALUES
    (_serial, 'inspection_completed', _source, 'in_stock', 'cleaned_and_ready');
  RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION public.mark_unit_damaged(_serial TEXT, _notes TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.theolia_test_serials
  SET availability_status = 'out_of_stock',
      condition_status = 'marked_damaged_for_inspection',
      notes = _notes,
      updated_at = now()
  WHERE serial = _serial;

  INSERT INTO public.unit_lifecycle_events
    (serial, event_type, source, availability_snapshot, condition_snapshot, notes)
  VALUES
    (_serial, 'damage_flagged', 'manual', 'out_of_stock', 'marked_damaged_for_inspection', _notes);
  RETURN TRUE;
END;
$$;