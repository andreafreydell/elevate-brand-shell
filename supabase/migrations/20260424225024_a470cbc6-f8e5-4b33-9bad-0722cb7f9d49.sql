-- Minimal table to track which Theolia serial is currently assigned to which Shopify order line.
-- This is the bare minimum the webhook needs to avoid double-assigning the same serial.
CREATE TABLE public.theolia_test_serials (
  serial TEXT PRIMARY KEY,
  variant_id TEXT NOT NULL,
  sku TEXT NOT NULL,
  assigned_order_id TEXT,
  assigned_order_name TEXT,
  assigned_line_item_id TEXT,
  assigned_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.theolia_test_serials ENABLE ROW LEVEL SECURITY;

-- No public access. Webhook function uses the service role key, which bypasses RLS.
-- Admin UI can read via authenticated admin role later; for now no policies = no client access.

-- Seed the two Theolia test serials.
INSERT INTO public.theolia_test_serials (serial, variant_id, sku) VALUES
  ('GEA-THEOLIA-001', '7601234502426', 'THEOLIA-SCC-NECK'),
  ('GEA-THEOLIA-002', '7601234502426', 'THEOLIA-SCC-NECK');

-- Function used by the webhook to atomically claim the least-used available serial for a variant.
CREATE OR REPLACE FUNCTION public.claim_theolia_serial(
  _variant_id TEXT,
  _order_id TEXT,
  _order_name TEXT,
  _line_item_id TEXT
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  picked_serial TEXT;
BEGIN
  -- Atomically pick the first unassigned serial for this variant, locking the row.
  SELECT serial INTO picked_serial
  FROM public.theolia_test_serials
  WHERE variant_id = _variant_id
    AND assigned_order_id IS NULL
  ORDER BY created_at ASC
  LIMIT 1
  FOR UPDATE SKIP LOCKED;

  IF picked_serial IS NULL THEN
    RETURN NULL;
  END IF;

  UPDATE public.theolia_test_serials
  SET assigned_order_id = _order_id,
      assigned_order_name = _order_name,
      assigned_line_item_id = _line_item_id,
      assigned_at = now(),
      updated_at = now()
  WHERE serial = picked_serial;

  RETURN picked_serial;
END;
$$;