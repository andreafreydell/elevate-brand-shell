

## Add Filters to Category Pages

### Current State
- The `PRODUCTS_QUERY` (list query) fetches basic data: title, price, images, variants, options — but **no tags, no productType, no metafields**.
- The `PRODUCT_BY_HANDLE_QUERY` (PDP) fetches rich metafields like `plating_color_primary`, `silhouette_category`, `occasions_possible`, `material_category`, `outfit_style`, etc.
- Category pages already filter by `product_type` via the Shopify query parameter.

### Approach: Client-side filtering using enriched product list query

Since the Storefront API `products` query doesn't support filtering by metafields server-side, the best approach is:

1. **Expand `PRODUCTS_QUERY`** to also fetch `tags`, `productType`, and key metafields (`plating_color_primary`, `silhouette_category`, `material_category`, `occasions_possible`) — the same ones already defined in the PDP query.

2. **Build a `ProductFilters` component** — a horizontal filter bar sitting between the PageHero and ProductGrid with pill/dropdown style filters. Filters will be:
   - **Color** — derived from `plating_color_primary` metafield (e.g. Gold, Silver, Rose Gold)
   - **Style** — derived from `silhouette_category` metafield (e.g. Hoop, Stud, Drop, Cuff)
   - **Occasion** — derived from `occasions_possible` metafield (e.g. Everyday, Date Night, Black Tie)
   - **Sort** — Price Low→High, Price High→Low, Newest

   Filter values are dynamically extracted from the fetched products (no hardcoded lists). Each filter renders as a minimal dropdown using the existing `Select` component, styled to match the editorial aesthetic. A "Clear All" link resets filters.

3. **Update `ProductGrid`** to accept filter state and apply client-side filtering/sorting on the fetched products array.

4. **Update `CategoryPage`** to compose the filter bar above the grid, managing filter state and passing it down.

### Technical Details

- Extend `ShopifyProduct` type to include optional `productType`, `tags`, and `metafields` fields.
- Add metafield identifiers to `PRODUCTS_QUERY` for the 4 filter dimensions.
- Filter logic: for each active filter, check if the product's corresponding metafield value matches (case-insensitive, supports comma-separated metafield values like occasions).
- Sort logic: parse `priceRange.minVariantPrice.amount` for price sorting.
- The filter bar uses a responsive layout: horizontal row on desktop, collapsible or scrollable on mobile.

### Files Changed
- `src/lib/shopify.ts` — expand `PRODUCTS_QUERY` and `ShopifyProduct` type
- `src/components/ProductFilters.tsx` — new component
- `src/components/ProductGrid.tsx` — accept and apply filters
- `src/pages/CategoryPage.tsx` — integrate filters
- `src/pages/BrowseAll.tsx` — also integrate filters for consistency

