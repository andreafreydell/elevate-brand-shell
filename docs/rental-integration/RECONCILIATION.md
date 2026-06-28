# Reconciliation: our platform vs. main's experimental prototype

`main` (live) carries a separate, experimental rental prototype — a **Theolia test
harness**. The founder confirmed **our platform supersedes it**. This file documents
exactly what main has, and the precise steps to remove it cleanly.

## What main has (the experiment)

**Frontend**
- `src/pages/AdminRentalOps.tsx` — admin page at route `/admin/rental-ops` with
  hardcoded "Theolia test unit" data; calls the `rental-ops-data` edge function.
- Route registered in `src/App.tsx`: `/admin/rental-ops` → `AdminRentalOps`.

**Database** (migrations `20260424225024` and `20260425004350`)
- Tables: `theolia_test_serials`, `unit_lifecycle_events`
- Functions:
  - `claim_theolia_serial(text, text, text, text)`
  - `validate_unit_status()` (trigger function)
  - `mark_unit_reserved(text, text, text)`
  - `mark_unit_shipped(text, text, text)`  ← collides by NAME with ours (ours is 4-arg)
  - `mark_unit_returned(text, text, text)`
  - `mark_unit_ready(text, text)`
  - `mark_unit_damaged(text, text)`
- Plus RLS policies on those tables (`20260425005922`).

**Edge functions:** `rental-ops-data`, `shopify-order-lifecycle`, `shopify-register-webhook`.

## Why a blind merge is unsafe

We also define `mark_unit_shipped` (4-arg) and a full unit/reservation schema. Stacking
without cleanup leaves **two overloaded `mark_unit_shipped` functions** and two parallel
unit systems → ambiguous calls and confusion. So we remove main's set as part of integration.

## Cleanup migration (proposed — runs AFTER our migrations)

> Touches the LIVE database, but only the Theolia **test** objects. Confirmed safe by
> founder. Review before running.

```sql
-- Remove main's experimental Theolia rental prototype.
DROP FUNCTION IF EXISTS public.claim_theolia_serial(text, text, text, text);
DROP FUNCTION IF EXISTS public.mark_unit_reserved(text, text, text);
DROP FUNCTION IF EXISTS public.mark_unit_shipped(text, text, text);   -- main's 3-arg (NOT ours, which is 4-arg)
DROP FUNCTION IF EXISTS public.mark_unit_returned(text, text, text);
DROP FUNCTION IF EXISTS public.mark_unit_ready(text, text);
DROP FUNCTION IF EXISTS public.mark_unit_damaged(text, text);
DROP TABLE IF EXISTS public.unit_lifecycle_events CASCADE;            -- drops its policies + the validate trigger usage
DROP TABLE IF EXISTS public.theolia_test_serials CASCADE;
DROP FUNCTION IF EXISTS public.validate_unit_status() CASCADE;        -- trigger fn; drop after its table is gone
```

Verify each signature against main's migrations `20260424225024` /
`20260425004350` before applying (signatures captured 2026 from those files).

## Frontend reconciliation

- Delete `src/pages/AdminRentalOps.tsx`.
- Point `/admin/rental-ops` in `src/App.tsx` to our guarded `RentalOps`
  (`src/pages/admin/RentalOps.tsx`) wrapped by `AuthProvider` + `AdminRoute`; add
  `/admin/login` → `AdminLogin`.
- Merge `src/integrations/supabase/types.ts`: drop the experimental
  `theolia_test_serials` / `unit_lifecycle_events` / `mark_unit_*` / `claim_theolia_serial`
  type entries; keep our rental tables. (Or regenerate types from the DB post-migration.)

## Edge-function reconciliation

- Delete main's `rental-ops-data`, `shopify-order-lifecycle`, `shopify-register-webhook`
  function folders.
- Remove their Shopify **webhook subscriptions** so they don't double-process orders
  alongside our `shopify-order-paid`.
- Deploy ours: `shopify-order-paid` (our version), `shopify-subscription-sync`,
  `gea-open-cycle`, `gea-create-return`, `gea-charge-keep-fee`, `gea-seed-inventory`,
  `wms-rental-event`, and `_shared/*`.

## config.toml

Union both function lists, minus the three removed experimental functions; keep
`send-contact-email` + `shopify-order-paid` + ours.
