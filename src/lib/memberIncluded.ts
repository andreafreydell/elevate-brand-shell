// Variants that are never "included" for members: the memberships themselves,
// the paid Extra Rental Item, and the always-free gifts. Mirrors the exclusion
// list in supabase/functions/_shared/membership.ts + shopify.ts.
const NON_INCLUDED_VARIANT_IDS = new Set([
  "48545833943140", // Seed membership
  "48630640345188", // Blossom membership
  "48545842724964", // Garden membership
  "48643543760996", // Extra Rental Item ($15)
  "48466377703524", // Gift: Ear Lobe Patches
  "48466377736292", // Gift: Resin Earring Lifter Backs
]);

/** Numeric tail of a Storefront GID ("gid://shopify/ProductVariant/123" -> "123"). */
export const numericVariantId = (gid: string | undefined | null) =>
  gid ? gid.split("/").pop() ?? "" : "";

/** True when a piece should display as "Included in your membership ✿" for an entitled member. */
export const isMemberIncludedVariant = (variantGid: string | undefined | null) => {
  const id = numericVariantId(variantGid);
  return id !== "" && !NON_INCLUDED_VARIANT_IDS.has(id);
};

export const INCLUDED_LABEL = "Included in your membership ✿";
