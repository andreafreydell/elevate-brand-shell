

## Alternate Product Card Images for Visual Dynamism

### Change

**`src/components/ProductCard.tsx`** — Accept an optional `index` prop and use it to pick which image to display (1st, 2nd, or 3rd), cycling with `index % 3`. Falls back to available images if fewer than 3 exist.

**`src/components/ProductGrid.tsx`** — Pass the array index to each `ProductCard`.

### Details

- `ProductCard` gets `index?: number` prop
- Image selection: `product.node.images.edges[index % imageCount]?.node` instead of always `[0]`
- If the product has only 1 image, it always shows that one (safe fallback)
- Desktop layout unaffected — this is purely which image URL is chosen

