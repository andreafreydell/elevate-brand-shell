# GEA Rental Membership Platform — Integration Plan & Audit

**Status:** Built, validated, **NOT deployed.** All work is on branch
`gea-rental-backend` (latest commit `750486c`). `main` (the live site) is
**untouched**. This folder is the self-contained record so any engineer or model
can audit the work and the integration plan without hunting.

Companion files in this folder:
- **MANIFEST.md** — every file we created/changed, with purpose + status.
- **RECONCILIATION.md** — the collision with main's prototype + the exact
  cleanup steps (DROP statements, function/webhook removals).
- See also `../gea-rental-setup.md` for the Shopify/Klaviyo/secrets runbook.

---

## 1. What this is and why

GEA is a membership-based jewelry **access** business (rent, don't own). This work
builds the operational backend + team dashboard for it. Requirements:

1. Assign the **most-rented** available unit for each rental (wear one down, retire it).
2. Tie each rental to the member's **tier**, sourced from their Shopify subscription.
3. **Rolling 30-day cycle**: each cycle the member gets their tier's items free; extras **$6**.
4. On return, **reconcile** shipped vs returned → returned back in stock, not-returned **kept**.
5. If kept items exceed the tier's keep allowance, **auto-charge 40% of item price**.
6. Flag a unit for **retirement review** after **>3 rentals**.
7. **Seed the catalog** of serialized units from Shopify stock and wire it end-to-end.

**Verified tiers** (from live product descriptions/prices):

| Membership | Price | Tier code | Items / Keep | Variant id |
| --- | --- | --- | --- | --- |
| Seed | $35 | `three_piece` | 3 / keep 1 | 48545833943140 |
| Blossom | $65 | `six_piece` | 6 / keep 2 | 48630640345188 |
| Garden | $85 | `ten_piece` | 10 / keep 3 | 48545842724964 |

(Note: NOT in size order — Garden is the largest.)

## 2. Architecture (how the pieces fit)

- **Shopify** = commerce + checkout + where memberships (subscriptions) are sold.
- **Supabase** = owns serialized inventory, reservations, memberships, 30-day cycles,
  charges, and returns; runs the edge functions and the daily cycle job.
- **Member "free items"** = ONE standing Shopify automatic discount (100% off the
  "Rental" collection) restricted to the **`gea_cycle_open`** customer segment. The
  backend tags a customer when their cycle opens and un-tags after checkout.
- **$6 extras** = a separate "Extra Rental Item" product (variant `48643543760996`),
  outside the Rental collection, added by the member checkout flow.
- **Free gift** = a separate "Membership Gift" collection + its own 100%-off discount
  for the same segment (2 items the member keeps).
- **40% keep fee** = charged after a return is reconciled.
- **Klaviyo** = sends the "your cycle is open" nudge email (triggered by the backend).

## 3. Shopify objects already created (live, in the `maisonfreydell` store)

- **Rental collection** (id 320845938788) — Smart: type ≠ "Rental Fee" AND ≠ "Membership".
- **Extra Rental Item** product (id 8601798606948, $6, type "Rental Fee").
- **Membership Gift** collection (id 320874545252, manual). *Open: add the 2 gift items —
  Ear Lobe Patches variant 48466377703524, Resin Earring Lifter Backs variant 48466377736292.*
- **Automatic discount "Membership Included Pieces"** (id 1170540724324) — 100% off
  Rental collection, eligibility = Cycle Open segment.
- **Automatic discount "Membership Gift"** (id 1170659508324) — 100% off Membership Gift
  collection, eligibility = Cycle Open segment.
- **"Cycle Open" segment** (id 566177628260) — `customer_tags CONTAINS 'gea_cycle_open'`.
- **Subscriptions already existed** (Seed/Blossom/Garden, deliver every 4 weeks).

## 4. The collision with `main` (important)

`main` already contains a **separate, experimental rental prototype** (built via
Lovable/codex) — a Theolia test harness. Decision (confirmed with the founder):
**our platform supersedes it.** Details + exact removal in **RECONCILIATION.md**.

## 5. Integration plan (how it reaches production safely)

Build a branch off the **latest main** (so the PR carries the rebrand + our work,
conflict-free), verify, open a PR. **`main` changes only when the founder merges.**

1. **Keep all of main's rebrand** (copy/components/pages — already correct & tier-aware).
2. **Swap the rental admin page**: remove main's `src/pages/AdminRentalOps.tsx` (Theolia
   test), point `/admin/rental-ops` to our real `RentalOps` (+ `AuthContext`, `AdminRoute`,
   `AdminLogin`).
3. **Install our backend** (migrations + edge functions) and add **one cleanup migration**
   that drops main's experimental tables/functions (see RECONCILIATION.md). *This is the
   only change that touches live data — only the Theolia test objects.*
4. **Remove main's experimental edge functions** (`rental-ops-data`,
   `shopify-order-lifecycle`, `shopify-register-webhook`) and their webhook subscriptions.
5. **Verify** (`tsc --noEmit`, SQL parse) before proposing merge.

After merge / Lovable deploy:
- Set secrets (§6), register webhooks, run `gea-seed-inventory`, schedule `gea-open-cycle`
  daily, build the Klaviyo flow, and finish the member rental-selection page.

## 6. Config the founder/Lovable must set

- **Edge function secrets:** `GEA_CRON_SECRET` (random), `GEA_ADMIN_SECRET` (random),
  `KLAVIYO_PRIVATE_KEY` (from Klaviyo), optional `GEA_SELLING_PLAN_TIER_MAP` (tier
  detection also works automatically off plan names Seed/Blossom/Garden).
- **Secret-name reconcile:** live backend uses `SHOPIFY_ACCESS_TOKEN` /
  `SHOPIFY_STORE_DOMAIN`; our code reads `SHOPIFY_ADMIN_ACCESS_TOKEN` /
  `SHOPIFY_SHOP_DOMAIN`. **Action:** update our `_shared/shopify.ts` to accept both
  names (pending — see Open items), or add aliased secrets. Also add `SHOPIFY_WEBHOOK_SECRET`.
- **Frontend env:** `VITE_EXTRA_RENTAL_ITEM_VARIANT_ID=48643543760996`.
- **Shopify scopes to add:** `write_customers`, `read/write_returns`,
  `read_customer_payment_methods`, `read_inventory`.
- **Webhooks:** `subscription_contracts/create|update` → `shopify-subscription-sync`;
  `returns/create` → `gea-create-return`; `orders/paid` → our `shopify-order-paid`.

## 7. Verification done

- All SQL migrations parse cleanly (Postgres parser, `scripts/sqlcheck.cjs`).
- `tsc --noEmit` passed on the frontend (admin dashboard + auth + types).
- Edge functions reviewed; **not** runtime-tested (no Deno/Docker locally) — validate on deploy.

## 8. Open items / not yet done

- **Secret-name reconcile** in `_shared/shopify.ts` (accept both token/domain names).
- **Member rental-selection page** + member `/account` cycle view (member auth =
  Shopify Customer Account API — deferred by founder).
- **Klaviyo "cycle open" flow** (build after the `GEA Cycle Opened` metric exists).
- **Add the 2 gift items** to the Membership Gift collection.
- The cleanup-migration **function signatures** in RECONCILIATION.md should be
  confirmed against main's migration before running.

## 9. Risks

- Cleanup migration drops main's Theolia test objects on the live DB (safe = test data only).
- `mark_unit_shipped` exists in both systems (different arity: main 3-arg, ours 4-arg);
  the cleanup drops main's 3-arg version specifically.
- Edge functions unit-tested only by review; first live deploy should be smoke-tested
  (subscription webhook → membership row; orders/paid → reservation; seed → units).
