
**Refactoring Product Actions to "Coming Soon" with Dual "Access / Buy" Logic on PDP**

Based on your instructions and drawing inspiration from the rent vs buy PDP models, I will disable current purchasing flows to prepare for launch and significantly improve the product detail page to communicate our "Access Is Luxury" positioning.

### 1. Update Product Detail Page (PDP)
I will replace the current single price and "Add to Bag" button in the buy box with a clear dual-option layout that explicitly communicates the business model while enforcing the "Coming Soon" state:

*   **Option 1: Access It (Membership)**
    *   Frames the item as accessible via the founding membership.
    *   Shows the membership cost structure instead of the single item price.
    *   Features a disabled "COMING SOON" button.
*   **Option 2: Buy It (Keep Forever)**
    *   Shows the full retail price.
    *   Features a secondary disabled "COMING SOON" button.
*   **Mobile Sticky Footer**: The sticky bottom action bar will also be updated to show a disabled "COMING SOON" button alongside the "See Membership" link.

### 2. Update Global Product Cards
I will update all product cards across the site to reflect the same launch state:
*   **`ProductCard.tsx`**: Change the hover CTA from "Add to Bag" to a disabled "COMING SOON".
*   **`FeaturedProduct.tsx`**: Change the primary CTA to a disabled "COMING SOON".

This will completely disable the cart functionality for now, ensuring visitors see the pieces but understand the vault is currently locked until launch, while successfully introducing the "Access vs Buy" education directly on the PDP.
