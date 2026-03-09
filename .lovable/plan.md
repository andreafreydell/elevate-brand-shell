

## Two Issues to Fix

### 1. Page loading speed — add Shopify image size parameters

Shopify CDN images are being loaded at full resolution. The `cdn.shopify.com` URLs support appending `_400x` or `width=400` query params to serve optimized sizes. This is the main bottleneck.

**`src/components/ProductCard.tsx`**
- Append `&width=600` to the primary image URL and `&width=600` to the hover image URL (grid cards don't need full-res)
- Keep `loading="lazy"` as-is

**`src/components/ProductGrid.tsx`**
- Add a skeleton/placeholder grid while loading instead of a single centered spinner, so the page feels faster (perceived performance)

### 2. PromoBar too tall on mobile

The promo text wraps across multiple lines on narrow screens, making the bar vertically oversized.

**`src/components/PromoBar.tsx`**
- On mobile (`md:` breakpoint), show a shortened version of the text: just "Code **FOUNDING10** · $10 off first month" — hide the "Exclusive Access" prefix and "Learn about membership" suffix using `hidden md:inline` classes
- Reduce mobile padding from `py-2.5` to `py-1.5` on small screens

