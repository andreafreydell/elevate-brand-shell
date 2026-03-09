

## Compact Editorial Category Banner

### Problem
Current category pages use the full-height `PageHero` (dark background, centered text, lots of padding). It's oversized for a category listing page where the products should be the star.

### Inspiration
Anthropologie's category banner: compact, editorial, with a collage-like layout mixing typography and product imagery. We'll achieve a similar feel using our existing craft components and CategoryGraphic SVGs instead of photos.

### Approach
Create a new `CategoryBanner` component that replaces `PageHero` on category pages. It uses a horizontal layout with:

- **Left**: Category title (large serif) + subtitle + a ScribbleUnderline on a key word
- **Right**: The existing `CategoryGraphic` SVG for that category, placed inside a `HandDrawnFrame`, with a small `WaxSeal` or `TagRedStamp` accent overlaid

The banner has a warm cream/sand background (not the dark hero), much less vertical padding (py-12 md:py-16), and a `StitchLineDivider` or `WavyDivider` at the bottom edge.

On mobile: stacks vertically — title on top, graphic below, compact.

### Files

**New: `src/components/layout/CategoryBanner.tsx`**
- Props: `title`, `subtitle`, `category` (for CategoryGraphic lookup)
- Layout: `flex` row on md+, column on mobile
- Left column (~60%): animated label ("The Collection"), serif H1 with `ScribbleUnderline` on the title word, subtitle paragraph
- Right column (~40%): `CategoryGraphic` inside a subtle `HandDrawnFrame`, with a `WaxSeal` positioned top-right as a decorative accent
- Bottom: `StitchLineDivider` full-width
- Background: `bg-background` with `GrainOverlay` at low opacity
- Compact padding: `py-10 md:py-16`

**Edit: `src/pages/CategoryPage.tsx`**
- Replace `PageHero` with `CategoryBanner`, passing `title`, `subtitle`, `category={productType}`

**Edit: `src/App.tsx`**
- No changes needed — category data already flows through props

### Per-category details
Each category automatically gets its unique SVG from the existing `CategoryGraphic` component (earrings → ear silhouette, rings → finger+ring, etc.), so no new graphics needed.

