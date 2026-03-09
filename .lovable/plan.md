

## Mobile-Only PDP Compaction

All changes will be **strictly within `@media (max-width: 768px)` blocks or mobile-only Tailwind prefixes** — zero risk to desktop.

### Strategy: CSS-only compaction via `src/index.css` + minimal responsive class additions in `src/pages/ProductDetail.tsx`

### Changes

**1. `src/index.css` — Add a new `@media (max-width: 768px)` block for PDP sections**

Target each PDP section with mobile-only overrides:

- **Buy Box**: Reduce padding from `p-8` to `p-4`, shrink title from ~2.2rem to ~1.5rem, hero phrase from `text-lg` to `text-sm`, price from `text-3xl` to `text-xl`, option cards padding from `p-6` to `p-4`, trust strip gap tighter
- **Tagline Band (Section 2)**: Reduce `py-12` to `py-6`, font from `text-2xl` to `text-lg`
- **Story Section (Section 3)**: Reduce `p-10` to `p-4`, story text from `text-lg` to `text-base`, hide MarginNote (already hidden on mobile), category graphic padding smaller
- **Material & Fit (Section 5)**: Reduce `p-8` to `p-4`, force 2-column grid on mobile
- **Trust Section (Section 7)**: Reduce `p-8` to `p-4`, tighten text
- **Membership Upsell (Section 8)**: Add compact mobile wrapper class
- **Bottom CTA (Section 9)**: Reduce `p-8` to `p-4`, title from `text-2xl` to `text-lg`
- **"This Piece Belongs In"**: Reduce padding, smaller WashiTapeNote text, tighter gap
- **Outfit Styles / Occasions**: Smaller blob tags, tighter gaps

**2. `src/pages/ProductDetail.tsx` — Add mobile-specific CSS classes to elements**

Add semantic mobile class names (e.g., `pdp-buybox-mobile`, `pdp-tagline-mobile`, etc.) to the existing elements so the CSS can target them without affecting desktop. Use responsive Tailwind where simpler (e.g., `p-4 md:p-8`, `text-lg md:text-2xl`).

Key inline responsive adjustments:
- Main container: `py-4 md:py-12`
- Buy box: `p-4 md:p-8 lg:p-14`
- Access/Buy cards: `p-3 md:p-6`
- Tagline band: `py-6 md:py-16 px-5 md:px-16`
- Story section: `p-5 md:p-14`
- Material grid: `p-4 md:p-10`
- Trust grid: `p-4 md:p-10`
- Bottom CTA: `p-4 md:p-12`
- Title: `text-2xl md:text-[2.2rem]`
- Price: `text-xl md:text-3xl`
- Hero phrase: `text-base md:text-lg`
- "This Piece Belongs In": `p-4 md:p-8`, gap `gap-4 md:gap-8`
- Outfit WashiTapeNote text: `text-[13px] md:text-[15px]`

### Files Changed
- `src/pages/ProductDetail.tsx` — swap hardcoded paddings/sizes for responsive Tailwind classes
- `src/index.css` — add PDP mobile overrides block for anything that can't be done inline

