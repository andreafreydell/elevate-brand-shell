# GEA Rental Platform — Live Status & Outstanding Workstreams

_Last updated: 2026-07-10 evening (Round-4: GEAPILOT live)._

## ✅ ROUND 4 (2026-07-10) — GEAPILOT: one free Seed month via checkout code
- **Shopify discount code `GEAPILOT`** (verified): 100% off, entitled to ONLY the
  Rental collection (320845938788) — can never discount memberships/extra/gifts;
  once per customer; active, no end date.
- **Backend (deployed)**: `handlePilotCodeOrder` in shopify-order-paid — an order
  carrying the code (and no membership variant) enrolls the buyer as a seed pilot
  (tier_source source=pilot-code) with a SILENTLY opened cycle (cycle_tag_applied +
  tag_removed_at pre-stamped: no gea_cycle_open tag, no "pick your pieces" email, no
  "pick now" PromoBar). Runs BEFORE the rental-lines loop so
  count_checkout_for_reservation attaches the order's pieces to the new cycle (free
  up to 3, 4+ count as extras = visible over-use). Active members typing the code are
  never downgraded. `ensureAccountForOrder` extracted for reuse.
- **No pilot auto-renewal**: gea-open-cycle skips tier_source pilot-code AND
  pilot-enrollment for renewals (one month only; buying a real membership rewrites
  tier_source and re-enables renewals). Day-31 return reminder unaffected.
- **Invite image**: `Dropbox/Ambiente Home LLC/Website/GEAPILOT-invite.png`
  (1080×1080 PNG, GEA field-note style, built via headless-Chrome render of
  scratchpad HTML). Copy: "A month of fine jewelry, on us" / code GEAPILOT / pick 3.
- **Untested**: a real checkout with the code (expect $0 total + pilot account +
  cycle + reservations on dashboard, receipt-only email).

## ✅ ROUND 3 (2026-07-10) — FULLY AUTOMATIC RETURNS PIPELINE, live & verified
The warehouse works ONLY in the Shopify admin; the dashboard is visualization-only.
Commit `Round 3: fully automatic returns pipeline` + Lovable deploys, all verified:
- **Member declares on /returns** → gea-member-return records internally AND creates a
  real **Shopify Return** on the order (createShopifyReturn; skips gracefully if lines
  unfulfilled — Shopify requires fulfilled lines).
- **Warehouse ships** (marks fulfilled in Shopify) → `fulfillments/create|update`
  webhooks → shopify-fulfillment-event → reservations → shipped.
- **Warehouse closes the return in Shopify** → `returns/close` webhook →
  shopify-return-event → returned_serials → reconcile_member_return(force) (arrivals
  restock; declared-but-missing become keeps) → **automatic keep-fee charging**
  (chargeKeepFeesForCycle in _shared/fees.ts). gea-charge-keep-fee = staff retry only.
- **Registered webhook set (verified live):** ORDERS_PAID→shopify-order-paid,
  RETURNS_REQUEST→gea-create-return, RETURNS_CLOSE→shopify-return-event,
  FULFILLMENTS_CREATE/UPDATE→shopify-fulfillment-event.
- **Daily cron LIVE:** gea-open-cycle 9am ET (renewals + day-31 reminders).
- **Dashboard**: manual reconcile removed; read-only + red Attention badge (member
  declared a return that never arrived) + "Retry failed charges" on failed charges only.
  Published to geagems.com.
- **Shopify app scopes**: released gea-rental-backend-3 (+4 fulfillment scopes) and
  approved the store grant — this also unblocks Round-2 membership auto-fulfill.
- **Shopify GUI (done with founder):** taxes verified correct (add-on-top; NOTE: no
  state tax registration yet — home state FL registration + accountant before real
  revenue; Shopify Tax active, tracks nexus thresholds); shipping rate renamed **"Free
  Concierge Shipping — Included ✿"** ($0); subscription-app confirmation email OFF;
  Shopify native return emails moot (returns flow via our Return objects, label manual).

_Previous session log below._

Running handoff log: what's DONE, what's PENDING and on whom. Per-goal test runbook in
`VERIFY.md`. **Round-1 dry run (2026-07-02, real client Kim) PASSED end-to-end.**

---

## ✅ DONE & LIVE (verified, not assumed)

### Core engine (Round 1, proven live with Kim on Jul 2)
- **orders/paid webhook is the spine.** `shopify-order-paid` (HMAC-verified) does it all:
  rental-line detection (variant ∈ `inventory_units`, exclusion set for
  memberships/extra/gifts), most-worn serial assignment, member cycle counting,
  `gea_cycle_open` tag removal after use, **membership two-in-one** (paying for a
  membership auto-creates the Supabase account + activates the tier — subscription
  webhooks are scope-blocked, this replaces them).
- **Kim's live proof:** purchase → auto account (seed 3/1, active) → cycle open → tag →
  Klaviyo email → she checked out 3 pieces at $0 (all `is_free_item:true`, most-worn
  serials) → tag auto-removed. Fixed along the way: tier naming normalization
  (`canonical_tier()` migration), staff read (`is_staff()` EXECUTE re-grant),
  segment-discount gotcha (checkout must be authenticated as the tagged customer —
  Shopify emails a 6-digit code; site login is separate).
- **Catalog**: 1,120 variants → 2,327 serialized `inventory_units`. Real retail prices
  captured (keep-fee basis). Discounts/segment/collections live (see git history).

### Round 2 code — committed 698bd8c, deployed by Lovable Jul 9 (report pending below)
- **Instant activation at purchase**: `_shared/cycles.ts` → `openCycleForMember()`
  (cycle + tag + Klaviyo "GEA Cycle Opened" with `selection_url:/welcome`, idempotent via
  `cycle_tag_applied`); called from `shopify-order-paid` the moment a membership order
  lands. `gea-open-cycle` refactored onto the same helper = month-2+ renewal engine; it
  also runs `emitReturnDueEvents()` (day-31 "GEA Return Due" Klaviyo event, stamped via
  `return_reminder_sent_at`).
- **Auto-fulfill membership lines** (`fulfillMembershipLines`, fulfillmentOrders +
  fulfillmentCreateV2) so membership orders don't sit "unfulfilled".
- **Logistics capture**: migration `20260703090000` adds `shipping_address`,
  `order_number`, `product_title` to `rental_reservations` + `return_reminder_sent_at`
  to `rental_cycles`; webhook fills them per order/line.
- **Member returns (RETURN SHIPMENT)**: `/returns` page (auth+membership gated,
  return/keep toggles, keep math "60% off list") → `gea-member-return` edge fn (member
  JWT, own-pieces validation, keeps finalized via `mark_unit_kept`, declared returns →
  `member_returns` upsert + reservations → `return_open`). No Shopify Return object —
  rental lines are never Shopify-fulfilled; `member_returns` is the source of truth.
- **Pilot enrollment (no card)**: `gea-enroll-member` edge fn (staff JWT): creates/finds
  Shopify customer (so the $0 segment discount works) + auth user + profile tier upsert +
  instant cycle open. Pilot = NO subscription: auto-cancel via API is scope-blocked, so
  pilot members are enrolled from the dashboard and never enter a payment flow.
- **Member-facing UI**: `useMemberEntitlement` hook; "Included in your membership ✿"
  replaces prices (cards/PDP/cart) for signed-in entitled members; cart subtotal excludes
  included items; PromoBar member states (cycle open → "pick your pieces", window open →
  "time to return"); navbar CTA swaps SEE MEMBERSHIP → RETURN SHIPMENT for members;
  copy: extras $6→**$15** everywhere (2 extras = $30 = Blossom upgrade math), "pay today
  → account created automatically" line on landing + offer.
- **Contact form leak fixed**: `send-contact-email` → concierge@geagems.com (was the
  founder's gmail).

### Klaviyo (all verified via API)
- **Flow ScYfu9 "GEA Cycle Opened" — LIVE** (metric YyJef8, template `VnVE8r`, CTA →
  /welcome, updated to $15 extras).
- **Flow Y9gcZR "GEA Return Due — Time To Return Your Items" — LIVE** (built this
  session; metric "GEA Return Due", template `WZaneG`, subject
  `{{ first_name|default:'Darling' }}, it's time to return your items ✿`, Smart Sending
  OFF, sender concierge@geagems.com).
- Members receive exactly: Shopify receipt + cycle-open email (+ day-31 return reminder).

### Lovable mega-batch (Jul 9 evening) — MOSTLY DONE, independently verified
- ✅ Migration `20260703090000` applied (columns probe 200).
- ✅ All 4 edge functions deployed (gea-enroll-member/gea-member-return 404→401).
- ✅ **Site outage found & fixed mid-batch:** anon REST reads went 401 site-wide. NOT a
  key rotation — a security-hardening pass had revoked EXECUTE on `is_staff()` from
  anon while `staff_read_*` policies were defined for `public`, so every anonymous read
  of the staff-guarded tables errored. Lovable fixed via two migrations (restore grant →
  rescope all staff policies to `authenticated` → re-revoke from anon; also cleared the
  linter warning), verified all tables 200 and the gea-member-return JWT chain intact.
- ✅ Frontend **published to geagems.com** (bundle index-DfK17vER.js): /welcome route,
  /returns, "Included in your membership", Concierge Shipping copy, Return Shipment
  navbar — all confirmed present in the live bundle.
- ❓ Auth Site URL → geagems.com: was in the task list; **confirm in Lovable's final
  report** (test: send a reset email, link should land on geagems.com not lovable.app).
- ⏸ **Shopify items PENDING founder's Connect click** (Lovable's Shopify session
  expired; "Connect to Shopify" prompt waiting in its chat): extra variant
  48643543760996 $6→$15 (verified still 6.00), membership description line, $0
  "Concierge Shipping — Included ✿" rate. A duplicate instruction message sits paused in
  Lovable's queue — delete it or let it no-op.

---

## ⏳ PENDING

### Founder GUI items (Shopify admin — she does these tomorrow)
1. **Settings → Taxes**: "all prices include tax" **OFF** (taxes added on top; affects
   the $35 membership too).
2. **Shopify Subscriptions app**: disable its confirmation email (keep receipt+Klaviyo).
3. **Settings → Notifications**: audit Returns/Cancellations templates — silence all but
   the return-label email.

### Round-2 verification test (next session, with founder)
1. Enroll tester #2 from the dashboard (no card) → instant email (~1 min) → /welcome →
   set password → PromoBar + "Included ✿" prices → checkout $0 + "Concierge Shipping —
   Included ✿" + tax shown on a $15 extra.
2. Membership order shows Paid + **Fulfilled**; only receipt + Klaviyo email arrive.
3. Dashboard: who/what/where on reservations; member drill-down; Kept tab shows
   title/SKU.
4. Kim: backdate cycle −31d → run gea-open-cycle → return-reminder email → RETURN
   SHIPMENT → declare 2 returns / 1 keep → team reconciles → **40% keep-fee charge**
   (gateway capture behavior still never observed — the last untested gear).
5. Refresh this file after.

### Parked
- Daily cron for `gea-open-cycle` — schedule only after the round-2 test passes.
- UPS Ship/Pickup API automation (Phase 2; needs founder's UPS account). Shipping is
  manual for pilot; USPS Ground Advantage/Priority cheapest for the 0.5-lb box
  (~$10–20 round trip; UPS ~$18–22/way retail = rejected).
- Magic-link email deliverability: Site URL fix was in the mega-batch; verify emails now
  land on geagems.com. Kim's password flow relied on one-time links.
- `geaworld.mp4` (12 MB unused) deletion — awaiting founder approval.
- Shopify store sender email → concierge@geagems.com.
- Lovable "Security: 1 issue" banner in workspace — review next session.

## Notes / decisions
- Extra = $15 so 2 extras ($30) = Seed→Blossom upgrade price (site says so).
- Pilot members: identical experience minus checkout/card; converters just buy the
  membership normally (two-in-one absorbs them, `findOrCreateCustomerByEmail` links).
- member_returns.source CHECK allows only manual|shopify_return|wms → member portal uses
  `manual` + `metadata.source_detail:'member_portal'`.
- Safety: no customer-facing actions against real members without the founder present;
  test on TEST customers only.
