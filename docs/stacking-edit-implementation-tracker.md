# Stacking Edit Implementation Tracker

Last updated: 2026-03-31

This doc tracks the current site changes requested in the latest refinement pass so we can complete them in blocks without losing scope.

## Block A: Offer Flow, Capture, and Merchandising

- [x] A1. Make the divider between homepage `How It Works` and `Your Tier of Access` live on the same darker background so it does not read like a floating light divider.
- [x] A2. Replace the generic `The Edit` proof placeholders with mock member-quote placeholders inspired by common Mejuri, gorjana, and marketplace jewelry review themes.
- [x] A3. Reframe all newsletter-style `Founding Access` email boxes into `The Stacking Edit`, a higher-converting trend/style newsletter concept.
- [x] A4. Update the `How It Works` calculator so the `wears per piece` slider has clearer notches and visible numeric guidance below the control.
- [x] A5. Keep `Choose Your Tier` first on `How It Works`, then place `How Access Works`, `Keep Your Favorite`, and `Sanitized & Sealed` directly below it.
- [x] A6. Rename the two memberships consistently:
  - `Stacking Membership` = `$85`
  - `Starter Membership` = `$65`
- [x] A7. On PDPs, make the `$85/month` line read as the price per 10-piece cycle, not a price for one item.
- [x] A8. On collection/category grids, replace `USD` labels with `$` formatting.
- [x] A9. Update the popup capture offer to promote a free tennis necklace incentive tied to signing up and taking the style quiz.
  - Dependency: there is no real style-quiz flow in the repo yet, so this pass may be copy/UI only unless a quiz destination is added later.
- [x] A10. Rename `Material Intelligence` to `What Your Pieces Are Made of`.
- [x] A11. Rewrite sanitation/care language to a stronger 3-step process:
  - Inspect and restore
  - Sanitize
  - Restore shine and polish

## Block B: Supporting Page Rewrites

- [x] B1. Update occasion routes so the intro copy is customer-facing and no longer mentions internal metadata.
- [x] B2. Keep the founder story on `/about`, but add a zero-calorie bridge back to the offer plus a strong end CTA.
- [x] B3. Keep the anti-extraction angle on `/sustainability`, but soften or cite stats and tie the page back to member benefit.
- [x] B4. Keep the anxiety-based structure on `/faq`, but shorten top answers and align every policy with the current offer.
- [x] B5. Remove the 24-hour promise on `/contact` and add quick-entry paths like `Membership`, `Press`, `Damage`, and `Founding Access` or its replacement.
- [x] B6. Expand `/refer` with clearer terms, timing, and availability details.
- [x] B7. Expand `/ambassador` with qualification criteria, review timeline, expected deliverables, and a more direct application path.
- [x] B8. Restyle `/404` into the brand system and add recovery links to `Browse`, `How It Works`, and the primary membership CTA.

## Block C: Internal Product Ranking System

- [x] C1. Research competitor merchandising patterns from Mejuri, gorjana, and other relevant jewelry brands.
- [x] C2. Design an internal ranking model that can score category placement using adjustable attributes.
- [x] C3. Create the first version of the internal ranking database/config so the order can be tuned manually.
- [x] C4. Seed the database/config with initial weights and product-level scores based on the research.
- [x] C5. Connect category rendering to the ranking system so products can actually appear in the intended order.

## Notes

- We already moved the main offer higher on Home and `How It Works`, made tier cards fully clickable, and routed the main membership CTAs into `How It Works`.
- The style quiz does not currently exist in the app, so any quiz-linked offer in this pass will be positioned as a copy/UX scaffold unless a quiz route is added.
- Competitor research for Block C should use current public sources and be documented separately so the ranking logic is transparent and editable.
- The live ranking system now uses `src/data/merchandising/productRankingConfig.ts` and `src/lib/productRanking.ts`, with companion research notes in `docs/product-merchandising-research.md`.
