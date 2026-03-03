

# Consolidate Membership Page Content into How It Works

## What changes

### 1. Restructure HowItWorks.tsx — add sections from Membership above and below tiers

**Above the tiers** (between the "Keep Your Favorite / Sanitized & Sealed" blocks and the tier cards), insert in order:

1. **"Access Is The New Luxury" hero block** — dark background section with headline, subtitle ("Two tiers of access…"), and trust strip (Cancel Anytime, Sanitized & Sealed, Repair Guarantee, Free Returns, No Surprise Fees)
2. **"Founding Member Access" scarcity block** — dark background section with "Limited Invitation" label, heading, body copy, and CTA

**Below the tiers** (after OfferUnit, before Common Questions FAQ), insert:

3. **Cost-Per-Wear + Calculator** — switch OfferUnit from `standard` to `full` variant (this automatically adds the cost-per-wear comparison and SavingsCalculator below the tier cards)
4. **The 5 Trust Standards** — the 5-card grid (Sanitized & Sealed, Repair Guarantee, Secure Delivery, Damage Clarity, Cancel Anytime) with icons

### 2. Remove Membership page and route

- Delete `src/pages/Membership.tsx`
- In `src/App.tsx`: remove the `/founding-circle` route pointing to Membership, add redirect from `/founding-circle` → `/how-it-works`
- Update all site-wide links that point to `/founding-circle` → `/how-it-works` (Navbar, SiteFooter, OfferUnit, TierCard, PromoBar, Index, About, Sustainability, FAQ, CareRepair, Account, ReferFriend, and HowItWorks closing CTA)

### New HowItWorks page structure (top to bottom):
1. PageHero ("Effortless by Design")
2. 4-step process (Choose, Receive, Wear, Refresh)
3. Keep Your Favorite / Sanitized & Sealed blocks
4. **NEW: "Access Is The New Luxury" + Trust Strip**
5. **NEW: "Founding Member Access" scarcity block**
6. Tier cards heading + OfferUnit `full` (includes tier cards + cost-per-wear + calculator)
7. **NEW: The 5 Trust Standards grid**
8. Common Questions FAQ (merge both FAQ lists — HowItWorks 8 items + Membership 6 items, deduplicated)
9. Closing CTA

### Files affected (~15):
- `src/pages/HowItWorks.tsx` — major restructure
- `src/pages/Membership.tsx` — delete
- `src/App.tsx` — route changes
- `src/components/Navbar.tsx`, `src/components/layout/SiteFooter.tsx`, `src/components/PromoBar.tsx`, `src/components/membership/OfferUnit.tsx`, `src/components/membership/TierCard.tsx` — update `/founding-circle` → `/how-it-works`
- `src/pages/Index.tsx`, `src/pages/About.tsx`, `src/pages/Sustainability.tsx`, `src/pages/FAQ.tsx`, `src/pages/CareRepair.tsx`, `src/pages/Account.tsx`, `src/pages/ReferFriend.tsx` — update hrefs

