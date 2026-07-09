-- Round-2 dry-run fixes: logistics enrichment + day-31 return reminders.
--
-- 1) rental_reservations gains the logistics fields the dashboard needs so the
--    team never has to open Shopify: where it ships, which order, which piece.
--    Captured by shopify-order-paid from the webhook payload.
-- 2) rental_cycles gains return_reminder_sent_at — the idempotency stamp for
--    the Klaviyo "GEA Return Due" (day-31) reminder emitted by the daily job.

ALTER TABLE public.rental_reservations
  ADD COLUMN IF NOT EXISTS shipping_address jsonb,
  ADD COLUMN IF NOT EXISTS order_number text,
  ADD COLUMN IF NOT EXISTS product_title text;

ALTER TABLE public.rental_cycles
  ADD COLUMN IF NOT EXISTS return_reminder_sent_at timestamptz;
