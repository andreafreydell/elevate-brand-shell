import { type ShopifyProduct } from "@/lib/shopify";
import {
  CATEGORY_SILHOUETTE_SCORES,
  CATEGORY_WEIGHT_PROFILES,
  KEYWORD_SIGNAL_SCORES,
  MANUAL_PRODUCT_RANKING_ROWS,
  MATERIAL_SIGNAL_SCORES,
  STACKING_ROLE_SCORES,
  type MerchandisingCategory,
  type ProductRankingColumns,
  type ProductRankingOverrideRow,
} from "@/data/merchandising/productRankingConfig";

interface ProductRankingContext {
  query?: string;
  lockedOccasion?: string;
}

interface ProductRankingBreakdown extends ProductRankingColumns {
  manualBoost: number;
  finalScore: number;
}

const MAX_COMPONENT_SCORE = 10;

const MANUAL_OVERRIDE_MAP = new Map<string, ProductRankingOverrideRow>(
  MANUAL_PRODUCT_RANKING_ROWS.map((row) => [row.handle, row]),
);

function clampScore(value: number): number {
  return Math.max(0, Math.min(MAX_COMPONENT_SCORE, value));
}

function getMetafieldValue(product: ShopifyProduct, key: string): string {
  return product.node.metafields?.find((metafield) => metafield?.key === key)?.value ?? "";
}

function normalizeProductType(rawValue?: string): MerchandisingCategory {
  const value = rawValue?.toLowerCase().trim() ?? "";
  if (value.includes("earring")) return "earrings";
  if (value.includes("necklace")) return "necklace";
  if (value.includes("bracelet")) return "bracelet";
  if (value.includes("hair")) return "hair accessory";
  if (value.includes("sunglass")) return "sunglasses";
  if (value.includes("charm")) return "charm";
  return "default";
}

function parseQueryProductType(query?: string): MerchandisingCategory | undefined {
  if (!query) {
    return undefined;
  }

  const match = query.match(/product_type:([^,]+)/i);
  if (!match?.[1]) {
    return undefined;
  }

  return normalizeProductType(match[1]);
}

function splitList(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildSearchHaystack(product: ShopifyProduct): string {
  const silhouette = getMetafieldValue(product, "silhouette_category");
  const stackingRole = getMetafieldValue(product, "stacking_role");
  const heroDescriptor = getMetafieldValue(product, "hero_descriptor_phrase");
  const outfitStyle = getMetafieldValue(product, "outfit_style");
  const material = getMetafieldValue(product, "material_category");
  const tags = product.node.tags?.join(" ") ?? "";

  return [
    product.node.title,
    product.node.productType,
    silhouette,
    stackingRole,
    heroDescriptor,
    outfitStyle,
    material,
    tags,
  ]
    .join(" ")
    .toLowerCase();
}

function getCategoryFitScore(product: ShopifyProduct, category: MerchandisingCategory, haystack: string): number {
  const silhouette = getMetafieldValue(product, "silhouette_category");
  const silhouetteScores = CATEGORY_SILHOUETTE_SCORES[category] ?? CATEGORY_SILHOUETTE_SCORES.default;
  const baseScore = silhouetteScores[silhouette] ?? CATEGORY_SILHOUETTE_SCORES.default[silhouette] ?? 5;

  let score = baseScore;

  if (haystack.includes("best seller") || haystack.includes("everyday")) {
    score += 0.5;
  }

  if (category === "necklace" && (haystack.includes("pendant") || haystack.includes("tennis"))) {
    score += 0.5;
  }

  if (category === "earrings" && (haystack.includes("huggie") || haystack.includes("stud"))) {
    score += 0.5;
  }

  if (category === "bracelet" && haystack.includes("tennis")) {
    score += 0.75;
  }

  if (category === "sunglasses" && haystack.includes("cat eye")) {
    score += 0.75;
  }

  return clampScore(score);
}

function getStackabilityScore(product: ShopifyProduct, haystack: string): number {
  const stackingRole = getMetafieldValue(product, "stacking_role");
  let score = STACKING_ROLE_SCORES[stackingRole] ?? 5;

  if (haystack.includes("stack") || haystack.includes("layer")) {
    score += 1;
  }

  if (haystack.includes("delicate") || haystack.includes("chain base")) {
    score += 0.5;
  }

  return clampScore(score);
}

function getEverydayAppealScore(occasions: string[], haystack: string): number {
  let score = 4;

  if (occasions.includes("everyday")) score += 2.5;
  if (occasions.includes("office")) score += 1.5;
  if (occasions.includes("event")) score += 0.5;

  if (
    haystack.includes("everyday") ||
    haystack.includes("minimal") ||
    haystack.includes("classic") ||
    haystack.includes("timeless") ||
    haystack.includes("polished")
  ) {
    score += 1.5;
  }

  return clampScore(score);
}

function getTrendSignalScore(haystack: string): number {
  let score = 0;

  for (const [keyword, value] of Object.entries(KEYWORD_SIGNAL_SCORES)) {
    if (haystack.includes(keyword)) {
      score += value;
    }
  }

  return clampScore(Math.max(score, 3));
}

function getStatementAppealScore(occasions: string[], haystack: string): number {
  let score = 3;

  if (occasions.includes("event")) score += 2;
  if (occasions.includes("evening")) score += 2;
  if (occasions.includes("vacation")) score += 1.5;

  if (
    haystack.includes("chunky") ||
    haystack.includes("bold") ||
    haystack.includes("oversized") ||
    haystack.includes("statement") ||
    haystack.includes("glamour")
  ) {
    score += 1.5;
  }

  return clampScore(score);
}

function getOccasionBreadthScore(occasions: string[]): number {
  if (occasions.length === 0) {
    return 4;
  }

  return clampScore(occasions.length * 2 + (occasions.includes("everyday") ? 1 : 0));
}

function getPriceAccessibilityScore(product: ShopifyProduct): number {
  const price = Number.parseFloat(product.node.priceRange.minVariantPrice.amount);
  if (price <= 35) return 10;
  if (price <= 50) return 9;
  if (price <= 75) return 8;
  if (price <= 100) return 7;
  if (price <= 150) return 6;
  return 5;
}

function getMaterialConfidenceScore(haystack: string): number {
  let score = 4;

  for (const [keyword, value] of Object.entries(MATERIAL_SIGNAL_SCORES)) {
    if (haystack.includes(keyword)) {
      score = Math.max(score, value);
    }
  }

  return clampScore(score);
}

function getCategoryContext(product: ShopifyProduct, context: ProductRankingContext): MerchandisingCategory {
  return parseQueryProductType(context.query) ?? normalizeProductType(product.node.productType);
}

function applyManualOverrides(
  handle: string,
  breakdown: Omit<ProductRankingBreakdown, "finalScore">,
): Omit<ProductRankingBreakdown, "finalScore"> {
  const overrides = MANUAL_OVERRIDE_MAP.get(handle);

  if (!overrides) {
    return breakdown;
  }

  return {
    ...breakdown,
    categoryFit: overrides.categoryFit ?? breakdown.categoryFit,
    stackability: overrides.stackability ?? breakdown.stackability,
    everydayAppeal: overrides.everydayAppeal ?? breakdown.everydayAppeal,
    trendSignal: overrides.trendSignal ?? breakdown.trendSignal,
    statementAppeal: overrides.statementAppeal ?? breakdown.statementAppeal,
    occasionBreadth: overrides.occasionBreadth ?? breakdown.occasionBreadth,
    priceAccessibility: overrides.priceAccessibility ?? breakdown.priceAccessibility,
    materialConfidence: overrides.materialConfidence ?? breakdown.materialConfidence,
    manualBoost: overrides.manualBoost ?? breakdown.manualBoost,
  };
}

export function getProductRankingBreakdown(
  product: ShopifyProduct,
  context: ProductRankingContext = {},
): ProductRankingBreakdown {
  const category = getCategoryContext(product, context);
  const profile = CATEGORY_WEIGHT_PROFILES[category] ?? CATEGORY_WEIGHT_PROFILES.default;
  const haystack = buildSearchHaystack(product);
  const occasions = splitList(getMetafieldValue(product, "occasions_possible").toLowerCase());

  const baseBreakdown = applyManualOverrides(product.node.handle, {
    categoryFit: getCategoryFitScore(product, category, haystack),
    stackability: getStackabilityScore(product, haystack),
    everydayAppeal: getEverydayAppealScore(occasions, haystack),
    trendSignal: getTrendSignalScore(haystack),
    statementAppeal: getStatementAppealScore(occasions, haystack),
    occasionBreadth: getOccasionBreadthScore(occasions),
    priceAccessibility: getPriceAccessibilityScore(product),
    materialConfidence: getMaterialConfidenceScore(haystack),
    manualBoost: 0,
  });

  let finalScore =
    baseBreakdown.categoryFit * profile.categoryFit +
    baseBreakdown.stackability * profile.stackability +
    baseBreakdown.everydayAppeal * profile.everydayAppeal +
    baseBreakdown.trendSignal * profile.trendSignal +
    baseBreakdown.statementAppeal * profile.statementAppeal +
    baseBreakdown.occasionBreadth * profile.occasionBreadth +
    baseBreakdown.priceAccessibility * profile.priceAccessibility +
    baseBreakdown.materialConfidence * profile.materialConfidence +
    baseBreakdown.manualBoost;

  if (context.lockedOccasion) {
    const normalizedOccasion = context.lockedOccasion.toLowerCase();
    if (occasions.includes(normalizedOccasion)) {
      finalScore += 0.75;
    }
  }

  return {
    ...baseBreakdown,
    finalScore: Number(finalScore.toFixed(2)),
  };
}

export function rankProducts(
  products: ShopifyProduct[],
  context: ProductRankingContext = {},
): ShopifyProduct[] {
  return [...products].sort((left, right) => {
    const leftScore = getProductRankingBreakdown(left, context).finalScore;
    const rightScore = getProductRankingBreakdown(right, context).finalScore;

    if (rightScore !== leftScore) {
      return rightScore - leftScore;
    }

    const leftPrice = Number.parseFloat(left.node.priceRange.minVariantPrice.amount);
    const rightPrice = Number.parseFloat(right.node.priceRange.minVariantPrice.amount);

    if (leftPrice !== rightPrice) {
      return leftPrice - rightPrice;
    }

    return left.node.title.localeCompare(right.node.title);
  });
}
