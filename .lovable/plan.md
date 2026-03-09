

## Fix PDP Layout Gap: Move "This Piece Belongs In" Into the Image Column

### Problem
The left column (images, 55%) is shorter than the right column (buy box, 45%) because the dual Access/Buy options made the buy box much taller. CSS grid stretches both columns to match, leaving a large empty gap below the product images.

### Solution
Move the "This Piece Belongs In" section **inside** the left column of the hero grid, directly below the thumbnail strip. This fills the dead space naturally and keeps outfit styles visually paired with the product imagery.

### Changes

**`src/pages/ProductDetail.tsx`**
- Remove the standalone "Section 1B" block (lines 381-404) that currently sits outside and below the hero grid.
- Place the same outfit styles markup inside the left image column (`<div className="border-b md:border-b-0 md:border-r border-border">`), after the thumbnail strip. This fills the vertical gap beside the buy box.
- Adjust padding to be slightly more compact (`p-6 md:p-8` instead of `p-10 md:p-14`) since it's now within the grid column rather than a full-width section.

