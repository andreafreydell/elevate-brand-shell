# GEA Digital Flagship — Full Site Architecture Build (v2.1)

## Overview

Transform the storefront into a fashion-house digital flagship. Every page follows the GEA Design System v2.1, maintains "Access Is Luxury" positioning, and supports the 2-tier access model. All copy governed by CORE ASSETS v2.1 (February 2026).

**Core Positioning:** This is not a jewelry rental site. This is a fashion house jewelry access system. Access Is Luxury. Ownership is outdated. Presence > Possession. Experience > Accumulation.

---

## Canonical Offer Structure (v2.1 — Locked)

| Tier | Name | Pieces/Cycle | Price | Month 1 Promo |
|------|------|-------------|-------|---------------|
| A | Tier A | 10 curated pieces | $85/month | $75 ($10 off) |
| B | Tier B | 5 curated pieces | $65/month | $55 ($10 off) |

**Cycle rule:** 1 shipment per 30-day cycle. Refresh at cycle end.

**Both tiers include:** Free delivery + free returns, protection coverage, Keep Your Favorite option, cancel anytime.

### Three Format Variants
- **Compact** (ads, email headers): `Tier A: 10 pieces · $75 your first month · Cancel anytime`
- **Standard** (homepage hero, email popup): Both tiers side-by-side without cycle rule
- **Full** (Founding 100 page, checkout): Both tiers with cycle mechanics, founding language, full value stack

### Trust Strip (deploy near every CTA)
- **Full:** Cancel Anytime · Sanitized & Sealed · Repair Guarantee · Free Returns · No Surprise Fees
- **Compact:** Cancel Anytime · Sanitized & Sealed · Free Returns

### 5 Named Trust Standards
1. Sanitized & Sealed Protocol
2. Repair Guarantee
3. Secure Delivery Standard
4. Damage Clarity Promise
5. Cancel Anytime Freedom

---

## Access Vocabulary (Enforced)

| Never Use | Always Use |
|-----------|-----------|
| Rotation / rotate | Access, refresh, renew, choose your next chapter |
| Rental / rent | Access, membership, experience |
| Subscription box | Membership, access tier |
| Swap | Refresh, renew your selection |

Exception: "Rotation" acceptable only in internal/ops docs, never customer-facing.

---

## Approved Copy (Production-Ready)

### Hero Headlines
- The Founding 100
- Luxury, Accessed
- Adorn the Woman You Are Becoming
- Access Defines Status
- The Collection — Curated High-Design Jewelry, Accessed
- More Beauty. Less Burden.

### CTAs
- APPLY FOR ACCESS
- CLAIM MY FOUNDING SPOT
- JOIN THE FOUNDING 100
- EXPLORE THE COLLECTION
- SEE MEMBERSHIP OPTIONS
- UNLOCK FIRST MONTH

### Repeatable Lines
- "More beauty, less burden."
- "Luxury designed for who you're becoming."
- "Access is our rebellion."
- "Elevated. Sustainable. Evolving."
- "This is not rental. This is access."

### How It Works Steps
1. **Choose** — Browse our curated vault and select the pieces that speak to your moment.
2. **Receive** — Your selections arrive in 1–3 days, freshly restored and sealed in our signature packaging.
3. **Wear** — Style them for your life — the event, the meeting, the dinner, the everyday.
4. **Refresh** — When you're ready for something new, return and choose your next chapter.

---

## Build Sequence (5 Phases)

### Phase 1 — Shared Infrastructure ✅ (Mostly Complete)
Reusable layout components: PageLayout, SiteFooter, PageHero, SectionHeading, NewsletterCapture.

### Phase 2 — Homepage Rebuild
8-section runway sequence (fixed order):
1. Authority Hero — Large serif declaration, single CTA
2. Material Intelligence — Macro texture, metal depth, lifecycle care
3. Access Framework — Reframe ownership vs access, economic argument
4. How It Works — Choose, Receive, Wear, Refresh (elevated language)
5. Value Expansion — Freedom to experiment
6. Social Validation — UGC strip (only place smiling allowed)
7. Membership Engine — 2 tier cards (Tier A / Tier B) with value framing
8. Final Declarative — "More Beauty. Less Burden."

### Phase 3 — Core Conversion Pages

**Founding 100 (`/founding-100`)** — Replaces `/membership`
- 2-tier comparison with value stacking
- Cost-per-wear reframing
- Keep Your Favorite logic
- Month 1 promotion psychology
- Founding member scarcity (first 100)
- 5 Named Trust Standards
- Savings calculator
- Risk reversal block

**How It Works (`/how-it-works`)**
- Full-page friction removal
- 4-step visual process
- FAQ accordion
- Confidence-building closing CTA

**Product Detail Enhancement**
- Design philosophy section
- Material composition (316L stainless steel messaging)
- Styling suggestions from Piece Styling Matrix
- Keep Your Favorite option

### Phase 4 — Brand Authority + Growth Pages
- About / Founder (`/about`) — Founder story, manifesto, values grid
- Sustainability (`/sustainability`) — Circular economy, no extraction
- Care & Repair (`/care`) — Sanitized & Sealed Protocol, restoration process
- FAQ (`/faq`) — Comprehensive accordion by category
- Contact (`/contact`) — Concierge-style form
- Refer a Friend (`/refer`) — Dual incentive referral
- Ambassador (`/ambassador`) — Application placeholder
- Press (`/press`) — Press kit, inquiries
- Legal (`/legal`) — Terms, Privacy, Membership Agreement

### Phase 5 — Retention + Dashboard
- Stories / The Edit (`/stories`) — Style guides, monthly drop calendar
- Account Dashboard (`/account`) — Profile, current access, history, Keep Your Favorite actions

---

## Routing

All routes added to `App.tsx`. Key change: `/membership` → `/founding-100`.

---

## Photography Archetype Hierarchy (Fixed Order)
1. **Authority** — Editorial crop, runway authority, detached gaze
2. **Material Intelligence** — Macro texture, metal depth on travertine
3. **Cultural** — Art/architecture connection, timeless
4. **Validation** — UGC only, smiling permitted here only

---

## Marketing Doctrine (15 Pillars — Governing All Copy)
1. Offers drive everything (perceived value 3-5x cost)
2. Zero-calorie messaging (5-second clarity test)
3. StoryBrand framework (Customer as Hero)
4. Conversion-Centered Design (one job per page)
5. Value Stacking (never discounting)
6. Risk Reversal at friction points
7. Scarcity and Exclusivity (founding access)
8. Continuance Ladder
9. Social Proof Stacking
10. Membership as "beating the system"
11. Four Pillars (Product, Story, Experience, Consistency)
12. Single CTA dominance
13. Identity-based messaging (after-state)
14. High-perceived-value email capture
15. Strategic repetition of core messages
