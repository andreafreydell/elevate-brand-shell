# GEA Rental Platform — Shopify & Supabase Setup Runbook

This is the one-time configuration the rental backend depends on. Code is in
`supabase/migrations/` and `supabase/functions/`; this doc covers the live-store
and environment setup that lives outside the repo.

---

## 1. Supabase environment variables / secrets

Set these on the Supabase project (Edge Function secrets). Some already exist from
the MVP backend — marked (existing).

| Secret | Used by | Notes |
| --- | --- | --- |
| `SHOPIFY_WEBHOOK_SECRET` | order-paid, subscription-sync, create-return | Shopify webhook signing secret (HMAC verify). (existing) |
| `SHOPIFY_SHOP_DOMAIN` | all Admin API calls | e.g. `1iggem-wc.myshopify.com`. (existing) |
| `SHOPIFY_ADMIN_ACCESS_TOKEN` | all Admin API calls | Admin API token with the scopes in §5. (existing) |
| `SHOPIFY_ADMIN_API_VERSION` | all Admin API calls | defaults to `2026-01` if unset. |
| `GEA_WMS_EVENT_SECRET` | wms-rental-event, gea-create-return (manual) | shared secret for WMS callbacks. (existing) |
| `GEA_CRON_SECRET` | gea-open-cycle | shared secret for the daily cron caller. |
| `GEA_ADMIN_SECRET` | gea-seed-inventory | shared secret for server-side seeding. |
| `GEA_SELLING_PLAN_TIER_MAP` | shopify-subscription-sync | JSON mapping selling-plan id → tier (see §3). |
| `KLAVIYO_PRIVATE_KEY` | gea-open-cycle | Klaviyo private API key (fires `GEA Cycle Opened`). |
| `GEA_RENTAL_PROCESS_ALL_LINES` / `GEA_RENTAL_LINE_PROPERTY_KEY` | order-paid | how rental lines are detected (existing). |

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are injected automatically.

---

## 2. Shopify catalog objects

1. **"Rental" collection** — add every rentable product/variant. This is what the
   member discount applies 100%-off to. Keep it accurate; only items in here go free.
2. **"Extra Rental Item" product — price $6.00** — a single simple product, NOT in
   the Rental collection (so the 100%-off discount never zeroes it). The member
   selection page adds this × the number of pieces beyond the member's tier count.
   Record its variant id for the frontend (`VITE_EXTRA_RENTAL_ITEM_VARIANT_ID`).
3. **Three subscription products / selling plans** — `three_piece`, `six_piece`,
   `ten_piece`. These are how a customer becomes a member; the selling-plan ids feed
   the tier map in §3.

---

## 3. Tier mapping (VERIFIED — Seed/Blossom/Garden, NOT in size order)

The three memberships already exist. Verified from their live descriptions/prices:

| Membership | Price | Tier | Items / Keep | Variant id |
| --- | --- | --- | --- | --- |
| **Seed** | $35 | `three_piece` | 3 / keep 1 | `48545833943140` |
| **Blossom** | $65 | `six_piece` | 6 / keep 2 | `48630640345188` |
| **Garden** | $85 | `ten_piece` | 10 / keep 3 | `48545842724964` |

Tier detection works **automatically** off the plan NAME keyword (seed/blossom/garden),
so no env map is strictly required. The optional `GEA_SELLING_PLAN_TIER_MAP` override
may be keyed by selling-plan id OR variant id (numeric or gid). Using the variant ids:

```json
{
  "48545833943140": "three_piece",
  "48630640345188": "six_piece",
  "48545842724964": "ten_piece"
}
```

**Other captured ids (for env / frontend):**
- `VITE_EXTRA_RENTAL_ITEM_VARIANT_ID` = `48643543760996` (Extra Rental Item, $6)
- Gift item variants (to add to the Membership Gift collection): Ear Lobe Patches
  `48466377703524`, Resin Earring Lifter Backs `48466377736292`.

---

## 4. Customer segment + automatic discount

1. **Customer segment** — name it e.g. "Cycle open". Definition:
   `customer_tags CONTAINS 'gea_cycle_open'`.
   (The backend adds/removes this tag; do not edit memberships by hand here.)
2. **Automatic discount** — Discounts → Create → Automatic:
   - Type: **Amount off products**, **100% / Free**.
   - Applies to: the **Rental** collection.
   - **Customer eligibility: Specific customer segments → "Cycle open"**.
   - No end date; leave it always on (it only ever applies to tagged customers).

This is the whole "free included items" mechanism — no discount codes. A member is
made eligible when `gea-open-cycle` tags them, and loses eligibility when the
order-paid webhook removes the tag after they check out.

---

## 5. Shopify Admin API scopes

Ensure the Admin token has:

- `read_products`, `read_inventory` — variant price + on-hand for seeding.
- `read_customers`, `write_customers` — read email, add/remove `gea_cycle_open` tag.
- `read_own_subscription_contracts` (+ subscription scopes) — tier sync.
- `read_customer_payment_methods` — 40% keep-fee capture.
- `write_draft_orders`, `read_draft_orders` — keep-fee draft order + completion.
- `write_orders`, `write_metafields` — serial write-back (existing).
- `read_returns`, `write_returns` — returns/create webhook.

---

## 6. Webhooks to register (Shopify → Supabase functions)

| Topic | Endpoint |
| --- | --- |
| `orders/paid` | `/functions/v1/shopify-order-paid` (existing) |
| `subscription_contracts/create` | `/functions/v1/shopify-subscription-sync` |
| `subscription_contracts/update` | `/functions/v1/shopify-subscription-sync` |
| `returns/create` | `/functions/v1/gea-create-return` |

---

## 7. Scheduled job

`gea-open-cycle` must run **daily** (e.g. Supabase scheduled trigger / external cron),
POSTing with header `x-gea-cron-secret: <GEA_CRON_SECRET>`. It opens any due 30-day
cycles, tags eligible customers, and fires the Klaviyo `GEA Cycle Opened` event.

---

## 8. Seeding the catalog

Once the Rental collection + inventory quantities are set in Shopify, call
`gea-seed-inventory` (header `x-gea-admin-secret: <GEA_ADMIN_SECRET>`) with the
rentable variant ids:

```json
{ "variant_ids": ["123456", "234567"], "default_units": 1 }
```

It creates one serialized `inventory_units` row per on-hand unit
(`GEA-{variant}-0001`…), capturing retail price for keep fees. Idempotent — safe to
re-run as stock changes.

---

## 9. Klaviyo flow — "GEA Your Cycle Is Open"

Built in the Klaviyo UI (via Claude in Chrome). **Trigger = metric "GEA Cycle
Opened"** (emitted by `gea-open-cycle`). No discount code in the email — the
discount is already active via the `gea_cycle_open` segment; the email is just the
nudge to the rental-selection page.

**Build dependencies (must exist first):**
- The **"GEA Cycle Opened" metric** must exist in Klaviyo — it appears only after
  the event fires at least once (deploy the backend + run `gea-open-cycle`, or send
  one test event). A metric-triggered flow can't select it before then.
- The **member rental-selection page URL** (the email CTA target) — built in the
  member-auth step.

**Format to match (from the live "GEA Welcome — New Chapter Members" flow):**
- From label **"Gea"**, from email **concierge@geagems.com**.
- Message name style: **"№1 — …"** (e.g. "№1 — Your Cycle Is Open").
- Subject lines: short, literary, botanical glyph (❀ / ✿). e.g.
  *"Your next chapter is ready ✿"*.
- Preview text: one intriguing line, e.g. *"Choose this cycle's pieces — your
  included selections are on the house."*
- Single email (optional 2-day reminder branch if not opened), CTA button →
  rental-selection page. Available event properties: `tier`, `cycle_number`,
  `free_items`, `keep_allowance`.
