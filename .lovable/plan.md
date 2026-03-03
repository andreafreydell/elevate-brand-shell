

# GEA Build Order -- Phased Implementation Plan

This is a large scope covering 13 workstreams. Here is how to sequence them for maximum impact, grouped into phases so each one delivers a working, improved site before the next begins.

---

## Current State Assessment

**Already built and functional:**
- Homepage (Index) with hero, material intelligence, access framework, how-it-works mini, value expansion, membership engine
- Membership/Founding 100 page with 2-tier cards, savings calculator, trust standards, FAQ
- How It Works page (8 sections including FAQ, trust strip, CTA)
- About page (founder story, values, manifesto)
- Sustainability page (stats, circular model, CTA)
- Care & Repair page (6-step process, care guidelines)
- FAQ page (4 categories, accordion pattern)
- Product Detail page (images, variants, editorial sections, membership upsell)
- TrustStrip component (full/compact variants)
- Navbar with desktop/mobile drawer
- Footer with 3 link columns

**Known inconsistencies to fix:**
- Homepage tier cards say "Tier A / Tier B" but Membership page says "Tier 1 / Tier 2"
- Homepage cost-per-wear block references "GEA Tier A" instead of "Tier 2"

**Not yet built:**
- OfferUnit reusable component (compact/standard/full)
- Email capture popup with trigger logic
- Promo announcement bar
- Collection browse pages (by type and occasion)
- Nav restructure (shopping-first header, support-in-footer)
- Expanded FAQ (32 Q&As with 8 anxiety clusters)
- Sustainability homepage module ("Designed for Less")
- Stripe integration

---

## Phase 1 -- Fix Foundations (1 prompt)

**Goal:** Consistent tier naming and nav/footer restructure.

1. **Normalize tier naming everywhere** -- Change Homepage `Index.tsx` from "Tier A / Tier B" to "Tier 1 / Tier 2" and fix the cost-per-wear reference.

2. **Restructure navigation (Navbar + Footer):**
   - **Header keeps only shopping-entry links:** New, Browse All, Earrings, Necklaces, Rings, Bracelets, How It Works, Founding 100
   - **Move FAQ, About, Sustainability, Care, Contact, Legal to footer** in organized columns: MEMBERSHIP (Founding 100, How It Works, Refer a Friend) / COMPANY (About GEA, Sustainability, The Edit) / HELP (FAQ, Care & Repair, Contact, Press) / LEGAL (Terms, Privacy)
   - **Mobile hamburger** mirrors the same hierarchy
   - Collection links (Earrings, etc.) will be placeholder routes for now pointing to `/` until collection pages are built

---

## Phase 2 -- OfferUnit Component + Promo Bar (1 prompt)

**Goal:** Create the canonical pricing display and deploy it.

1. **Build `OfferUnit.tsx`** with 3 variants:
   - **Compact** (one-line): tier name, price, piece count -- for PDP sidebar
   - **Standard** (card): both tiers side-by-side with features -- for How It Works
   - **Full** (with savings calculator + value stack) -- for Membership page

2. **Build `PromoBar.tsx`:** A slim, dismissible announcement bar above the Navbar. Copy: "FOUNDING -- Use code FOUNDING10 for $10 off your first month -- Limited to first 100 members". Dismissible with X, reappears on new sessions (sessionStorage). Links to `/founding-100`.

3. **Deploy OfferUnit:**
   - PDP: compact variant in the membership upsell section
   - How It Works: standard variant replacing the current inline tier mention
   - Membership page: full variant (replaces current inline tier cards with the canonical component)
   - Homepage membership engine: standard variant

---

## Phase 3 -- Expand FAQ to 32 Q&As (1 prompt)

**Goal:** Full trust-building FAQ with 8 anxiety clusters.

- Expand `/faq` from 4 categories / ~13 questions to **8 categories / 32 questions:**
  1. Access Model & How It Works (4 Qs)
  2. Membership & Pricing (4 Qs)
  3. Shipping & Timing (4 Qs)
  4. Quality & Authentication (4 Qs)
  5. Care & Cleaning (4 Qs)
  6. Returns & Damage Policy (4 Qs)
  7. Founding 100 Program (4 Qs)
  8. Account Management (4 Qs)

- Add anchor-link navigation at the top (jump-to sections)
- Add FAQPage JSON-LD schema for SEO
- Add a floating "Still have questions?" CTA that links to `/contact`

---

## Phase 4 -- Enhance Care & Repair + Sustainability (1 prompt)

**Goal:** Deepen both editorial pages and add the homepage sustainability module.

1. **Care & Repair `/care`:** Add sections for material-specific guides (gold, silver, plated, gemstones) and the Repair Promise (what happens when something breaks, damage vs. normal wear).

2. **Sustainability `/sustainability`:** Expand to 4 full editorial sections as specified -- Hero with striking stat, The Lifecycle (mineral extraction + over-consumption with equal depth), Impact by the Numbers, Philosophy Close. Rewrite to feel like an interesting magazine feature, not corporate responsibility.

3. **Homepage "Designed for Less" module:** A 3-column proof strip between the Social Validation and Membership Engine sections on Index.tsx: "No Extraction / Full Lifecycle Care / Zero Waste Access" with one-sentence facts each. Links to `/sustainability`.

4. **PDP micro-copy:** Add a subtle line near product details: "This piece is part of GEA's access system -- learn about our impact" linking to `/sustainability`.

---

## Phase 5 -- Email Capture Popup (1 prompt)

**Goal:** Top-of-funnel lead capture.

1. **Build `EmailCapturePopup.tsx`:** Modal/slide-up with founding access variant as default ("Join the Founding 100 -- Get First Access + $10 Off Your First Month"). Single email field + CTA. Mobile = bottom slide-up.

2. **Build `useEmailCaptureTrigger.ts` hook:** 3 trigger conditions -- 8s delay on desktop, 40% scroll on mobile, exit-intent on both. Suppress 30 days after close (localStorage), permanently after conversion.

3. **Integrate into `PageLayout.tsx`** so it fires site-wide.

4. **Klaviyo integration** will require an edge function and API key setup -- this will be wired as a placeholder that logs to console until Klaviyo credentials are configured.

---

## Phase 6 -- About Page Enhancement (1 prompt)

**Goal:** Full 8-section founder authority page.

Expand the current About page from 3 sections to 8:
1. Hero (founder portrait + one-line positioning) -- exists, refine
2. Origin Story -- exists, expand
3. The Problem (why ownership is broken) -- new
4. The Vision (Access Is Luxury) -- fold in from existing manifesto
5. How It Works (brief, links to /how-it-works) -- new
6. The Founding 100 (scarcity + perks) -- new
7. Values -- exists, refine
8. Press/Contact -- new

---

## Phase 7 -- Collection Browse Pages (1-2 prompts)

**Goal:** Shopping-entry pages that make the nav functional.

- Create a reusable `CollectionPage.tsx` that fetches Shopify products filtered by collection/tag
- Build routes: `/collections/earrings`, `/collections/necklaces`, `/collections/rings`, `/collections/bracelets`, `/collections/cuffs`
- Build occasion routes: `/collections/everyday`, `/collections/evening`, `/collections/office`, `/collections/bridal`, `/collections/travel`
- Each page uses `PageHero` + `ProductGrid` filtered by Shopify query
- Add a `/collections` browse-all page
- Wire all nav links to real routes

---

## Phase 8 -- Stripe Integration (separate effort)

**Goal:** Live checkout with 2-tier subscriptions.

This requires enabling Stripe through Lovable's integration tools and setting up Supabase/Cloud for edge functions. It is best handled as its own focused session:
- Create Stripe Products for Tier 1 and Tier 2
- Create FOUNDING10 coupon ($10 off first invoice)
- Build checkout flow: tier selection -> Stripe Checkout -> confirmation
- Add trust strip and anxiety reducers at checkout
- Webhook handling for subscription lifecycle

---

## Recommended Execution

Start with **Phase 1** (foundations), then **Phase 2** (OfferUnit + PromoBar) since these affect every other page. After that, Phases 3-6 can be done in any order. Phase 7 depends on having Shopify products tagged by collection. Phase 8 (Stripe) is independent and can happen whenever you are ready to go live with payments.

Each phase is scoped to fit in 1-2 prompts.
