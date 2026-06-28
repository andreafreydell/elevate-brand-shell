# File Manifest — GEA rental platform work

Every file we created/changed for the rental platform, on branch
`gea-rental-backend` (commit `750486c`). `A` = added, `M` = modified vs main.

## Database migrations (`supabase/migrations/`)
| File | Purpose |
| --- | --- |
| `20260422090000_gea_rental_backend_mvp.sql` (A) | Base: `inventory_units`, `rental_reservations`, `wms_events`, `shopify_wms_field_config`; assign/ship/return RPCs; RLS enabled. |
| `20260625120001_gea_rental_reservation_idempotency.sql` (A) | Idempotent reservation creation (no double-assign on webhook retry). |
| `20260625120002_gea_rental_most_used_and_retire.sql` (A) | Most-rented assignment; retire-flag at >3 rentals; `acquired_at`, `retired`, `retail_price_cache` cols. |
| `20260625120003_gea_membership_cycles_charges_returns.sql` (A) | `memberships`, `rental_cycles`, `charges`, `member_returns`; cycle/return/fee RPCs; `staff`; RLS policies. |
| `20260625120004_gea_staff_write_policies.sql` (A) | Staff UPDATE policy on `inventory_units` (retire action). |
| *(planned)* cleanup migration | Drops main's Theolia experiment — see RECONCILIATION.md. NOT yet written into a file. |

## Edge functions (`supabase/functions/`)
| File | Purpose |
| --- | --- |
| `_shared/cors.ts` (A) | CORS + JSON response helpers. |
| `_shared/shopify.ts` (A) | Shopify Admin GraphQL: HMAC verify, customer tagging, variant/subscription lookup, keep-fee charge. **TODO: accept both `SHOPIFY_ACCESS_TOKEN`/`SHOPIFY_ADMIN_ACCESS_TOKEN` + `SHOPIFY_STORE_DOMAIN`/`SHOPIFY_SHOP_DOMAIN`.** |
| `_shared/auth.ts` (A) | Service client; secret + staff-JWT verification. |
| `_shared/klaviyo.ts` (A) | Klaviyo Events API client (cycle-opened event). |
| `_shared/tiers.ts` (A) | Tier resolution (Seed/Blossom/Garden → 3/6/10) + status normalize. |
| `shopify-order-paid/index.ts` (A/M) | orders/paid webhook: assign serials, count cycle, remove cycle tag. |
| `shopify-subscription-sync/index.ts` (A) | subscription_contracts webhook → upsert membership/tier. |
| `gea-open-cycle/index.ts` (A) | Daily cron: open due cycles, tag `gea_cycle_open`, fire Klaviyo event. |
| `gea-create-return/index.ts` (A) | returns/create webhook + manual reconcile (returned→stock, kept→kept). |
| `gea-charge-keep-fee/index.ts` (A) | Staff: charge 40% extra-keep fee. |
| `gea-seed-inventory/index.ts` (A) | Seed serialized units from Shopify on-hand qty. |
| `wms-rental-event/index.ts` (A) | WMS event endpoint → unit/reservation state. |

## Frontend (`src/`)
| File | Purpose |
| --- | --- |
| `contexts/AuthContext.tsx` (A) | Supabase staff auth provider + `useAuth`. |
| `components/auth/AdminRoute.tsx` (A) | Guards `/admin/*` to signed-in staff. |
| `pages/admin/AdminLogin.tsx` (A) | Staff sign-in. |
| `pages/admin/RentalOps.tsx` (A) | `/admin/rental-ops` dashboard (inventory, retire, reservations, returns, kept, charges, members). |
| `App.tsx` (M) | Wrap in `AuthProvider`; add `/admin/login` + `/admin/rental-ops`. |
| `integrations/supabase/types.ts` (M) | Added rental tables (hand-written; regenerate post-deploy). |

## Docs / tooling
| File | Purpose |
| --- | --- |
| `docs/gea-rental-setup.md` (A) | Shopify/Klaviyo/secrets/webhooks runbook + captured IDs. |
| `docs/rental-integration/README.md` (A) | This integration plan + status (start here). |
| `docs/rental-integration/RECONCILIATION.md` (A) | main-vs-ours collision + cleanup DROPs. |
| `docs/rental-integration/MANIFEST.md` (A) | This file. |
| `scripts/sqlcheck.cjs` (A) | Dev-only Postgres SQL syntax checker (`npm i --no-save pg-query-emscripten`). |

## NOT built yet
- Member rental-selection page + member `/account` cycle view (Shopify Customer Account API).
- Klaviyo "cycle open" flow (needs the live metric first).
- Gift items not yet added to the Membership Gift collection.
- `_shared/shopify.ts` secret-name reconcile.
