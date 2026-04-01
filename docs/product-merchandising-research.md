# Product Merchandising Research

Last updated: 2026-03-31

This note documents the rationale behind the category-ranking system added to the site.

## What Competitors Are Merchandising

### Mejuri

Observed from current best-seller surfaces:

- Best-selling earrings are dominated by mini hoops, tube huggies, medium hoops, and studs.
- Best-selling assortments lean on easy-to-understand silhouettes that work for everyday stacking.
- Pendant-led necklaces, huggies, simple hoops, and polished basics appear repeatedly across best-seller categories.

Implication for GEA:

- Earrings should favor huggies first, then studs and versatile drops.
- Necklaces should favor pendants, tennis silhouettes, and chain-base pieces before more complex novelty shapes.
- The clearest conversion drivers are easy, stackable heroes before statement complexity.

Source:

- [Mejuri Best Selling Earrings](https://mejuri.com/collections/best-selling-earrings)
- [Mejuri Best Selling Necklaces](https://mejuri.com/world/en/collections/best-selling-necklaces)

### gorjana

Observed from current merchandising surfaces:

- The brand repeatedly promotes best sellers, layered looks, charms, shell jewelry, bow jewelry, silver earrings, and gifting categories.
- The collection language suggests lightweight layering, familiar gold essentials, trend-adjacent motifs, and easy day-to-night styling.
- Stackability and effortless wearability are doing a lot of merchandising work.

Implication for GEA:

- Bracelets and necklaces should reward chain bases, tennis sparkle, charms, and link silhouettes.
- Hair accessories should reward visibly trend-driven shapes like bows, shells, barrettes, and claw clips.
- Mixed “easy stack + trend signal” pieces should outrank ambiguous or harder-to-style items.

Source:

- [gorjana Best Sellers](https://www.gorjana.com/collections/best-sellers)
- [gorjana Fine Best Sellers](https://www.gorjana.com/collections/fine-bestsellers)

### Kendra Scott

Observed from current category and merchandising conventions:

- Pendant-led product stories, recognizable giftable motifs, and signature silhouettes remain central to conversion.
- The assortment teaches that obvious product utility and fast visual comprehension still matter, even when the brand is style-led.

Implication for GEA:

- Personalized, pendant, and giftable shapes deserve a lift, especially in necklaces and charms.
- When two pieces are otherwise similar, the one a shopper can understand at a glance should usually rank higher.

Reference:

- [Kendra Scott](https://www.kendrascott.com/)

## What Our Catalog Looks Like Right Now

Shopify storefront pull reviewed during implementation:

- 250 products returned in the current working set.
- Category volume is strongest in earrings, bracelets, necklaces, charms, hair accessories, and sunglasses.
- Earrings skew heavily toward huggies and studs.
- Necklaces skew toward pendants and delicate strands, with a smaller but important tennis subset.
- Bracelets skew toward bead strands, link bracelets, cuffs, and tennis bracelets.
- Hair accessories skew toward clips, barrettes, butterflies, shells, and claw silhouettes.
- Sunglasses skew toward thick acetate frames, cat-eye-adjacent shapes, and oversized statement frames.

## Ranking Columns

The live ranking engine scores products across these columns:

- `categoryFit`
- `stackability`
- `everydayAppeal`
- `trendSignal`
- `statementAppeal`
- `occasionBreadth`
- `priceAccessibility`
- `materialConfidence`
- `manualBoost`

The first eight are computed automatically from current product data:

- `productType`
- `silhouette_category`
- `stacking_role`
- `occasions_possible`
- title and tag keywords
- material language
- price

`manualBoost` is the intentional merchandiser override layer for hero products.

## Where To Tune It

Files added for this system:

- `src/data/merchandising/productRankingConfig.ts`
- `src/lib/productRanking.ts`

What to edit:

- Change category-level priorities in `CATEGORY_WEIGHT_PROFILES`.
- Change silhouette importance in `CATEGORY_SILHOUETTE_SCORES`.
- Change stacking logic in `STACKING_ROLE_SCORES`.
- Change trend sensitivity in `KEYWORD_SIGNAL_SCORES`.
- Boost or suppress specific products in `MANUAL_PRODUCT_RANKING_ROWS`.

## Current Strategy

The default ranking now intentionally pushes:

- Earrings: huggies, studs, and clean drop silhouettes.
- Necklaces: pendants, tennis chains, and chain-base pieces.
- Bracelets: tennis, link, and clean cuff silhouettes.
- Charms: pendant and giftable charm shapes.
- Hair: bow, shell, barrette, and claw-clip shapes.
- Sunglasses: cat-eye, thick acetate, and oversized hero frames.

The aim is not to make every category look identical. The aim is to surface the pieces that are easiest to understand, easiest to style, and closest to proven merchandising patterns from current competitors.
