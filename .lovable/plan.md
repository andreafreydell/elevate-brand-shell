

## Shuffle Products in Browse All

Shopify's Storefront API doesn't support random sorting. The fix is to shuffle the products array client-side after fetching.

### Changes

**`src/components/ProductGrid.tsx`**
- Add a `shuffle` prop (boolean, default `false`)
- After fetching products, if `shuffle` is true, apply a Fisher-Yates shuffle before setting state
- Use a seeded approach based on the current date so the order feels fresh daily but stays stable during a session

**`src/pages/BrowseAll.tsx`**
- Pass `shuffle` prop to `ProductGrid`

