

## Move "This Piece Belongs In" Below Hero Grid on Mobile Only

### What Changes
On mobile only, the "This Piece Belongs In" outfit styles section moves from inside the image column to directly after the main product hero grid (after the `</AnimateIn>` at line 400). Desktop stays exactly as-is.

### How
**`src/pages/ProductDetail.tsx`** — two changes:

1. **Hide existing block on mobile** (line 210): Add `hidden md:block` to the existing outfit styles wrapper inside the image column, so it only renders on desktop.

2. **Duplicate the block for mobile** right after the hero grid `</AnimateIn>` (after line 400): Add a `md:hidden` version of the same outfit styles markup. This renders only on mobile, appearing directly below the buy box grid.

No CSS file changes needed — pure responsive Tailwind classes.

