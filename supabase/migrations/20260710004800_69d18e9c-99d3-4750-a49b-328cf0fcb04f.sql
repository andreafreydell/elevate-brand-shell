ALTER TABLE public.rental_reservations
  ADD COLUMN IF NOT EXISTS shipping_address jsonb,
  ADD COLUMN IF NOT EXISTS order_number text,
  ADD COLUMN IF NOT EXISTS product_title text;

ALTER TABLE public.rental_cycles
  ADD COLUMN IF NOT EXISTS return_reminder_sent_at timestamptz;