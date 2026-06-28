# Verification — proving each "done-when" line (post-deploy)

Run after PR #4 is merged + deployed + secrets set. Each goal line maps to a
concrete test and an observable check (Supabase SQL or the `/admin/rental-ops`
dashboard). `FN` = `https://nwgndnochdbpjijhnbgq.supabase.co/functions/v1`.

## Prerequisites (one-time)
- Secrets set: `GEA_CRON_SECRET`, `GEA_ADMIN_SECRET`, `KLAVIYO_PRIVATE_KEY`, `SHOPIFY_WEBHOOK_SECRET`; Shopify token present.
- Webhooks registered: `subscription_contracts/create|update` → `shopify-subscription-sync`; `returns/create` → `gea-create-return`; `orders/paid` → `shopify-order-paid`.
- Add yourself to staff so the dashboard loads:
  `insert into public.staff (user_id, email) values ('<your auth.users id>', '<you@…>');`
- Seed catalog: `POST {FN}/gea-seed-inventory` header `x-gea-admin-secret: <GEA_ADMIN_SECRET>` body `{"variant_ids":["<rentable variant>"...],"default_units":1}` → check `select count(*) from inventory_units;` > 0.

## 1. Subscription → membership at right tier
- **Do:** create/activate a Shopify subscription (Seed / Blossom / Garden), or re-fire `subscription_contracts/create`.
- **Check:** `select tier, free_items_per_cycle, keep_allowance_per_cycle from memberships where shopify_customer_id='<id>';`
  → Seed=`three_piece`/3/1, Blossom=`six_piece`/6/2, Garden=`ten_piece`/10/3. (Or Members tab.)

## 2. Every 30 days → tag + discount + Klaviyo email
- **Do:** make a member's cycle due (`update memberships set started_at = now() - interval '31 days' where id='…';`), then `POST {FN}/gea-open-cycle` header `x-gea-cron-secret: <GEA_CRON_SECRET>`.
- **Check:** customer carries Shopify tag `gea_cycle_open`; `select cycle_tag_applied, tag_applied_at from rental_cycles where membership_id='…';` → true; Klaviyo shows a **"GEA Cycle Opened"** event for that profile; at checkout as that customer the Rental items show 100% off.

## 3. Checkout: free up to tier, $6 extras, gift, most-rented assigned
- **Do:** as a tagged member, place a rental order (selection flow) with a few rental items + 1 extra + the gift.
- **Check:** rental items ring $0, the Extra Rental Item rings $6, gift items $0. After `orders/paid`: `select serial_number, rental_count, is_free_item from rental_reservations where shopify_order_id='…';` and confirm the assigned units are the **highest `rental_count`** available for each variant.

## 4. Return → stock vs kept; over-keep → 40% fee
- **Do:** `POST {FN}/gea-create-return` (or `returns/create`) with `{"shopify_order_id":"…","returned_serials":["…"],"force":true}`.
- **Check:** returned units `availability_status='in_stock'`, `condition_status='cleaned_and_ready'`; not-returned reservations `internal_status='kept'`, unit `availability_status='kept'`. If `keep_count > keep_allowance` on the cycle, `POST {FN}/gea-charge-keep-fee` (staff JWT) `{"cycle_id":"…"}` → `select amount, status, basis from charges;` shows `0.40 × item_price`.

## 5. >3 rentals → retire flag
- **Do:** ship a unit past 3 rentals (seed one at `rental_count=3`, then one `orders/paid` for it; or call `mark_unit_shipped`).
- **Check:** `select serial_number, rental_count, retire_flagged from inventory_units where rental_count > 3;` → `retire_flagged=true`. Dashboard **Retire Review** tab lists it.

## 6. Team dashboard on live data
- **Do:** sign in at `/admin/login` (staff account) → `/admin/rental-ops`.
- **Check:** Inventory / Retire Review / Reservations / Returns / Kept / Charges / Members tabs all render the rows created by tests 1–5; the Reconcile and "Charge 40%" buttons work.

---
**Note:** Tests 1, 3, 4 ideally use a real (or test) Shopify customer + checkout/return so the webhooks fire end-to-end; tests 2, 5, 6 and seeding can be exercised directly via the endpoints + SQL above.
