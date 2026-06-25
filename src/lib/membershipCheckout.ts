// Direct-to-checkout links for membership tiers.
// Chain: clear cart -> add variant with its Supercycle selling plan -> checkout.
// This guarantees the subscription attaches (a plain /cart/ permalink with
// ?selling_plan= does NOT attach the plan and would charge once, verified 2026-06-11).
// IDs from Shopify store maisonfreydell (geagems.shop):
//   Seed:    variant 48545833943140, selling plan 6726189156 ($35 / 4 weeks)
//   Blossom: variant 48630640345188, selling plan 6755287140 ($65 / 4 weeks)
//   Garden:  variant 48545842724964, selling plan 6726221924 ($85 / 4 weeks)
export const MEMBERSHIP_CHECKOUT_URLS: Record<string, string> = {
  "Seed Membership":
    "https://geagems.shop/cart/clear?return_to=%2Fcart%2Fadd%3Fid%3D48545833943140%26quantity%3D1%26selling_plan%3D6726189156%26return_to%3D%2Fcheckout",
  "Blossom Membership":
    "https://geagems.shop/cart/clear?return_to=%2Fcart%2Fadd%3Fid%3D48630640345188%26quantity%3D1%26selling_plan%3D6755287140%26return_to%3D%2Fcheckout",
  "Garden Membership":
    "https://geagems.shop/cart/clear?return_to=%2Fcart%2Fadd%3Fid%3D48545842724964%26quantity%3D1%26selling_plan%3D6726221924%26return_to%3D%2Fcheckout",
};

export const CUSTOMER_ACCOUNT_URL = "https://account.geagems.shop";
