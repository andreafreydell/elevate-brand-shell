// Map a Shopify subscription contract's selling plan to a GEA membership tier.
//
// Resolution order:
//   1. GEA_SELLING_PLAN_TIER_MAP env (JSON: { "<sellingPlanId>": "three_piece", ... }).
//      Selling plan ids may be numeric or gid:// — both are checked.
//   2. Fallback: infer from the selling plan NAME by piece count (3 / 6 / 10).
//
// Returns null if no tier can be determined (caller logs + skips).

export type GeaTier = "three_piece" | "six_piece" | "ten_piece";

const PIECE_TO_TIER: Record<number, GeaTier> = {
  3: "three_piece",
  6: "six_piece",
  10: "ten_piece",
};

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
  lines: Array<{ sellingPlanId: string | null; sellingPlanName: string | null }>,
): GeaTier | null {
  const map = loadEnvMap();

  for (const line of lines) {
    if (line.sellingPlanId) {
      if (map[line.sellingPlanId]) return map[line.sellingPlanId];
      const num = numericId(line.sellingPlanId);
      if (num && map[num]) return map[num];
    }
  }

  // Fallback: infer from the plan name's piece count.
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

// Normalize Shopify subscription contract status to the memberships.status enum.
export function normalizeStatus(shopifyStatus: string | null | undefined): string {
  switch ((shopifyStatus || "").toUpperCase()) {
    case "ACTIVE":
      return "active";
    case "PAUSED":
      return "paused";
    case "CANCELLED":
    case "CANCELED":
      return "cancelled";
    case "EXPIRED":
    case "FAILED":
      return "expired";
    default:
      return "active";
  }
}
