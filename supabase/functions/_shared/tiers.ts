// Map a Shopify subscription contract line to a GEA membership tier.
//
// VERIFIED GEA mapping (from live product descriptions / prices):
//   Seed    = $35 = 3 items, keep 1  -> three_piece
//   Blossom = $65 = 6 items, keep 2  -> six_piece
//   Garden  = $85 = 10 items, keep 3 -> ten_piece
// (Note: NOT in Seed<Garden<Blossom size order — Garden is the largest.)
//
// Resolution order:
//   1. GEA_SELLING_PLAN_TIER_MAP env (JSON) keyed by selling-plan id OR variant id
//      (numeric or gid:// — both checked). Acts as an explicit override.
//   2. Plan/variant NAME keyword: "seed" -> three, "blossom" -> six, "garden" -> ten.
//      (The plans are named "SeedMembership35" etc., so this is the reliable path.)
//   3. Last resort: infer from a piece count (3 / 6 / 10) in the name.
//
// Returns null if no tier can be determined (caller logs + skips).

export type GeaTier = "seed" | "blossom" | "garden";

const PIECE_TO_TIER: Record<number, GeaTier> = {
  3: "seed",
  6: "blossom",
  10: "garden",
};

const NAME_TO_TIER: Array<[string, GeaTier]> = [
  ["seed", "seed"],
  ["blossom", "blossom"],
  ["garden", "garden"],
];

function loadEnvMap(): Record<string, GeaTier> {
  const raw = Deno.env.get("GEA_SELLING_PLAN_TIER_MAP");
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch (_e) {
    console.warn("GEA_SELLING_PLAN_TIER_MAP is not valid JSON; ignoring.");
    return {};
  }
}

function numericId(gid: string | null): string | null {
  if (!gid) return null;
  const match = gid.match(/(\d+)\s*$/);
  return match ? match[1] : null;
}

export function resolveTier(
  lines: Array<{ variantId?: string | null; sellingPlanId: string | null; sellingPlanName: string | null }>,
): GeaTier | null {
  const map = loadEnvMap();

  // 1. Explicit env override, by selling-plan id OR variant id (gid or numeric).
  for (const line of lines) {
    for (const raw of [line.sellingPlanId, line.variantId]) {
      if (!raw) continue;
      if (map[raw]) return map[raw];
      const num = numericId(raw);
      if (num && map[num]) return map[num];
    }
  }

  // 2. Name keyword (Seed / Blossom / Garden) — the reliable path for GEA's plans.
  for (const line of lines) {
    const name = (line.sellingPlanName || "").toLowerCase();
    for (const [keyword, tier] of NAME_TO_TIER) {
      if (name.includes(keyword)) return tier;
    }
  }

  // 3. Last resort: a literal piece count in the name.
  for (const line of lines) {
    const name = (line.sellingPlanName || "").toLowerCase();
    for (const pieces of [10, 6, 3]) {
      if (new RegExp(`\\b${pieces}\\b`).test(name) || name.includes(`${pieces} piece`) || name.includes(`${pieces}-piece`)) {
        return PIECE_TO_TIER[pieces];
      }
    }
  }

  return null;
}

// Normalize Shopify subscription contract status to the profile membership_status enum.
export function normalizeStatus(shopifyStatus: string | null | undefined): string {
  switch ((shopifyStatus || "").toUpperCase()) {
    case "ACTIVE":
      return "active";
    case "PAUSED":
      return "paused";
    case "CANCELLED":
    case "CANCELED":
    case "EXPIRED":
    case "FAILED":
      return "cancelled";
    default:
      return "active";
  }
}
