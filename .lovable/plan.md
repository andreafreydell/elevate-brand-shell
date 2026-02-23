

# GEA Digital Flagship -- Full Site Architecture Build

## Overview

Transform the current 2-page storefront into a 15-page fashion house digital flagship. Every page follows the GEA Design System, maintains "Access Is Luxury" positioning, and supports the subscription rotation model. All copy and structure is informed by distilled marketing principles from the Foundr coursework (appended at the bottom as build instructions).

---

## Build Sequence (5 Phases)

### Phase 1 -- Shared Infrastructure

Create reusable layout and section components used across all pages:

| Component | Purpose |
|-----------|---------|
| `PageLayout` | Wraps every page with Navbar + expanded SiteFooter + newsletter capture |
| `SiteFooter` | Multi-column footer with nav links, newsletter signup, legal links |
| `PageHero` | Reusable declarative hero: serif headline, subtitle, optional CTA |
| `SectionHeading` | Standardized section intro with label + heading |
| `NewsletterCapture` | Email capture block with high-perceived-value framing |

### Phase 2 -- Homepage Rebuild

Restructure `Index.tsx` into 8 runway-sequenced sections:

1. **Authority Hero** -- Large serif declaration ("Luxury, in rotation."), single CTA ("Apply for Access")
2. **Material Intelligence** -- Macro texture block, metal depth, lifecycle care messaging
3. **Access Framework** -- Educate on ownership vs rotation, economic intelligence argument
4. **How It Works (mini)** -- 4 elevated steps: Choose, Receive, Wear, Rotate
5. **Value Expansion** -- Freedom to experiment, RTR-inspired rotation benefits
6. **Social Validation** -- UGC strip (only place casual/smiling imagery allowed)
7. **Membership Engine** -- 3 tier cards (Essentials / Signature / Atelier) with value framing
8. **Final Declarative** -- "More beauty. Less burden." closing block

### Phase 3 -- Core Conversion Pages

**Membership (`/membership`)**
- Tier comparison table with value stacking
- Cost-per-wear reframing
- Keep-for-discount buyout logic
- First month offer psychology
- Founding member scarcity mechanic
- Concierge layer description
- Savings calculator concept
- Risk reversal block (cancel anytime, repair included, flexible returns)

**How It Works (`/how-it-works`)**
- Full-page friction removal
- 4-step visual process
- FAQ accordion answering shipping, returns, swaps, damage, keeping
- Confidence-building closing CTA

**Product Detail Enhancement**
- Design philosophy section
- Material composition
- Rotation logic and event styling suggestions
- Buyout option
- AI styling / undertone test / style persona quiz placeholders

### Phase 4 -- Brand Authority + Growth Pages

**About / Founder (`/about`)** -- Founder story, manifesto, values grid
**Sustainability (`/sustainability`)** -- Data-driven mining/waste impact, circular economy
**Care & Repair (`/care`)** -- Restoration process, lifecycle care
**FAQ (`/faq`)** -- Comprehensive accordion by category
**Contact (`/contact`)** -- Concierge-style form
**Refer a Friend (`/refer`)** -- Dual incentive referral structure
**Ambassador (`/ambassador`)** -- Application placeholder, program benefits
**Press (`/press`)** -- Press kit, brand assets, inquiries
**Legal (`/legal`)** -- Terms, Privacy, Membership Agreement placeholders

### Phase 5 -- Retention + Dashboard

**Stories / The Edit (`/stories`)** -- Style guides, rotation diaries, monthly drop calendar
**Account Dashboard (`/account`)** -- Wireframe: profile, current rotation, history, swap/return actions, keep-for-discount, style preferences

---

## Routing

All 15 routes added to `App.tsx`. Navbar updated with real navigation links.

---

## Membership Tier Structure

| Tier | Name | Pieces/Month | Key Features |
|------|------|-------------|--------------|
| 1 | Essentials | 1 shipment | Core rotation, repair included, insurance |
| 2 | Signature | 2 shipments | Priority access, flexible swaps, early drops |
| 3 | Atelier | 4 shipments | Concierge styling, founding badge, full vault access |

All tiers include: keep-any-piece buyout, insurance, repair, sanitization, free shipping.

---

## Technical Details

```text
New files to create:

src/components/layout/
  PageLayout.tsx
  SiteFooter.tsx
  PageHero.tsx
  SectionHeading.tsx

src/components/membership/
  TierCard.tsx
  TierComparison.tsx

src/components/shared/
  StepBlock.tsx
  ValueBlock.tsx
  TestimonialStrip.tsx
  NewsletterCapture.tsx
  AccordionFAQ.tsx
  SaveCalculator.tsx

src/pages/
  Index.tsx (rebuilt)
  HowItWorks.tsx
  Membership.tsx
  About.tsx
  Sustainability.tsx
  CareRepair.tsx
  ReferFriend.tsx
  Ambassador.tsx
  Press.tsx
  FAQ.tsx
  Contact.tsx
  Legal.tsx
  Account.tsx
  Stories.tsx

Modified files:
  src/App.tsx (add all routes)
  src/components/Navbar.tsx (update nav links)
```

---

## Distilled Marketing Doctrine (Build Instructions)

These principles, extracted from the Foundr coursework, must govern every section, CTA, and copy decision across the entire build:

### 1. Offers Drive Everything
A better offer outperforms a better ad. The membership offer must feel irresistible -- perceived value must dramatically outweigh cost (3-5x minimum). Every page should carry or reinforce the core offer. The offer must appear everywhere: homepage hero, PDP, membership page, footer, email capture.

### 2. Zero-Calorie Messaging
Every headline, subhead, and CTA must pass the 5-second clarity test: "Can the brain understand this message in 5 seconds without effort?" Clarity beats cleverness. Always. If a 6-year-old cannot repeat the message, it is too complicated.

### 3. The Customer Is the Hero
Use the StoryBrand framework throughout: Customer (Hero) has a Problem, meets a Guide (GEA), follows a Plan (Choose/Receive/Wear/Rotate), achieves Transformation (feels lighter, more expressive, more aligned), avoids Failure (clutter, waste, regret, overpaying). GEA is the guide, never the hero.

### 4. Conversion-Centered Design (CCD)
One page = one job. Remove everything that distracts from the primary CTA. Hero section must answer: What is this? Who is it for? Why does it matter? What do I do next? Place anxiety reducers near every CTA (cancel anytime, repair guarantee, flexible returns, free shipping). Visual hierarchy must guide the eye from headline to proof to CTA.

### 5. Value Stacking (Not Discounting)
Never frame as cheap or discount. Stack high-perceived-value, low-cost bonuses: free repairs, free swaps, early access, AI stylist access, founding member badge, quarterly surprises, free insurance month 1. Make the customer feel they are "beating the system."

### 6. Risk Reversal at Every Friction Point
Cancel anytime. Repair/replace guarantee. Flexible returns. Free shipping. Bonus credits. 60-day satisfaction adjustment. These must be visible and prominent near CTAs, on the membership page, and within the FAQ.

### 7. Scarcity and Exclusivity (Ethical)
Founding member access (limited spots). Early access drops. Vault access for higher tiers. Limited edition capsules. Always frame as invitation, access, privilege -- never as bargain or urgency.

### 8. Continuance Ladder
After every conversion, offer the next logical step (not a huge leap). Post-signup: style guide, rotation ritual, first drop preview. Post-first-box: upgrade options, referral boost, bonus credits. Design retention as product.

### 9. Social Proof Stacking
UGC, testimonials, press mentions, savings visualizations, member count badges. Social proof must be specific, relatable, and transformative -- not hyperbolic. Place proof immediately below hero sections.

### 10. Membership Must Feel Like Beating the System
Savings calculator showing "your membership pays for itself after X uses." Make the first order feel like it covers the membership cost. Use store credit and staged rewards to build retention into the offer structure. Members should spend 2-3x more than non-members.

### 11. The Four Pillars
Every page and section must reinforce: Good Product, Good Story, Good Experience, Consistency. A brand is only as strong as its weakest pillar. Inconsistency creates indirect anxiety in customers.

### 12. Single CTA Dominance
One CTA per section. Too many choices = no decision. The CTA must contrast visually (use `bg-foreground text-background`). Repeat the same CTA at top, middle, and bottom of long pages.

### 13. Identity-Based Messaging
Speak to who the customer is becoming, not features. "For women who live lighter." "Adorn the woman you are becoming." Transformation is the emotional payoff -- customers buy the after-state, not the product.

### 14. Email Capture = High Perceived Value
Never use "Sign up for our newsletter." Instead: "Apply for Founding Member Access," "Unlock Your First Rotation," "Join the Vault Waitlist." Tier 1 incentives for launch: exclusive access, founding member status, free first styling session.

### 15. Repetition Is Strength
The same core messages ("More beauty. Less burden." / "Access defines status." / "Luxury, in rotation.") should repeat across every page in varied contexts. Customers need 7+ consistent touchpoints to remember a brand.

