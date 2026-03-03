

# Rename "Founding 100" → "Founding Circle" Everywhere

A global find-and-replace across all files that reference "Founding 100", "founding-100", or "100 founding members".

## Files to update (15 files)

### Route & Navigation
- **`src/App.tsx`** — Change route path from `/founding-100` to `/founding-circle`, update redirect
- **`src/components/Navbar.tsx`** — Label "Founding 100" → "Founding Circle", href → `/founding-circle`
- **`src/components/layout/SiteFooter.tsx`** — Label and href

### Components
- **`src/components/PromoBar.tsx`** — Link href, copy "Limited to first 100 members" → "Limited founding members"
- **`src/components/membership/OfferUnit.tsx`** — All `/founding-100` hrefs → `/founding-circle`
- **`src/components/membership/TierCard.tsx`** — href

### Pages (all `/founding-100` link hrefs + display text)
- **`src/pages/Membership.tsx`** — PageHero label "The Founding 100" → "The Founding Circle", section heading, body copy ("100 founding members" → "founding circle members"), CTA "Join the Founding 100" → "Join the Founding Circle", all hrefs
- **`src/pages/Index.tsx`** — hrefs
- **`src/pages/HowItWorks.tsx`** — hrefs
- **`src/pages/About.tsx`** — hrefs
- **`src/pages/Sustainability.tsx`** — hrefs
- **`src/pages/FAQ.tsx`** — hrefs
- **`src/pages/CareRepair.tsx`** — hrefs
- **`src/pages/Account.tsx`** — hrefs
- **`src/pages/ReferFriend.tsx`** — hrefs

### Also check
- **`src/pages/Stories.tsx`** — "Founding Members Speak" (keep as-is, this says "Founding Members" not "Founding 100")
- **`src/components/LaunchGate.tsx`** — "Founding members" (keep as-is)
- FAQ items in Membership.tsx referencing "founding perks" (keep as-is, no "100")

### Summary of text changes
| Old | New |
|-----|-----|
| `Founding 100` (display) | `Founding Circle` |
| `/founding-100` (route/href) | `/founding-circle` |
| `The Founding 100` | `The Founding Circle` |
| `Join the Founding 100` | `Join the Founding Circle` |
| `100 founding members` | `founding circle members` |
| `Limited to first 100 members` | `Limited founding membership` |
| `FOUNDING10` coupon code | Keep as-is (it's a promo code, not display name) |

