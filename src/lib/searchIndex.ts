import { storefrontApiRequest, SEARCH_INDEX_QUERY } from "@/lib/shopify";

export interface SearchItem {
  title: string;
  handle: string;
  productType: string;
  image?: string;
  price?: string;
  currency?: string;
  color?: string;
  occasions?: string;
  /** lowercase blob of everything searchable (title, type, tags, metafields) */
  haystack: string;
}

interface RawNode {
  title: string;
  handle: string;
  productType?: string;
  tags?: string[];
  featuredImage?: { url?: string } | null;
  priceRange?: { minVariantPrice?: { amount?: string; currencyCode?: string } };
  metafields?: Array<{ key: string; value: string | null } | null> | null;
}

const ATTR_KEYS = ["occasions_possible", "plating_color_primary", "material_category", "silhouette_category", "outfit_style"] as const;

let cache: SearchItem[] | null = null;
let vocab: string[] | null = null;
let inflight: Promise<SearchItem[]> | null = null;

const mf = (node: RawNode, key: string) =>
  (node.metafields || []).find((m) => m && m.key === key)?.value || "";

const splitVals = (v: string) => v.split(",").map((x) => x.trim()).filter(Boolean);

async function fetchAll(): Promise<SearchItem[]> {
  const items: SearchItem[] = [];
  const vocabSet = new Set<string>();
  let after: string | null = null;

  for (let page = 0; page < 8; page++) {
    const data = await storefrontApiRequest(SEARCH_INDEX_QUERY, { first: 250, after });
    const conn = data?.data?.products;
    if (!conn) break;

    for (const edge of conn.edges as Array<{ node: RawNode }>) {
      const n = edge.node;
      const color = mf(n, "plating_color_primary");
      const occasions = mf(n, "occasions_possible");

      const parts = [
        n.title,
        n.productType || "",
        (n.tags || []).join(" "),
        occasions,
        color,
        mf(n, "other_predominant_color"),
        mf(n, "material_category"),
        mf(n, "silhouette_category"),
        mf(n, "outfit_style"),
        mf(n, "stacking_role"),
        mf(n, "item_type"),
        mf(n, "hero_descriptor_phrase"),
      ];

      // collect human-friendly attribute values for suggestions
      for (const key of ATTR_KEYS) {
        for (const val of splitVals(mf(n, key))) vocabSet.add(val);
      }

      items.push({
        title: n.title,
        handle: n.handle,
        productType: n.productType || "",
        image: n.featuredImage?.url || undefined,
        price: n.priceRange?.minVariantPrice?.amount,
        currency: n.priceRange?.minVariantPrice?.currencyCode,
        color: color || undefined,
        occasions: occasions || undefined,
        haystack: parts.join(" ").toLowerCase(),
      });
    }

    if (!conn.pageInfo?.hasNextPage) break;
    after = conn.pageInfo.endCursor;
  }

  vocab = Array.from(vocabSet).sort((a, b) => a.localeCompare(b));
  return items;
}

/** Loads (and caches for the session) the full search index. */
export function loadSearchIndex(): Promise<SearchItem[]> {
  if (cache) return Promise.resolve(cache);
  if (!inflight) {
    inflight = fetchAll()
      .then((items) => {
        cache = items;
        return items;
      })
      .catch((error) => {
        inflight = null; // allow retry
        throw error;
      });
  }
  return inflight;
}

/** Rank items by an AND-match across the metadata haystack. */
export function searchItems(items: SearchItem[], rawTerm: string, limit = 7): SearchItem[] {
  const term = rawTerm.trim().toLowerCase();
  if (!term) return [];
  const words = term.split(/\s+/).filter(Boolean);

  const scored: Array<{ item: SearchItem; score: number }> = [];
  for (const item of items) {
    const titleLc = item.title.toLowerCase();
    const typeLc = item.productType.toLowerCase();
    let score = 0;
    let matchesAll = true;

    for (const w of words) {
      if (!item.haystack.includes(w)) {
        matchesAll = false;
        break;
      }
      if (titleLc.includes(w)) score += 3;
      else if (typeLc.includes(w)) score += 2;
      else score += 1;
    }

    if (matchesAll) {
      if (titleLc.startsWith(term)) score += 6;
      else if (titleLc.includes(term)) score += 3;
      scored.push({ item, score });
    }
  }

  scored.sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title));
  return scored.slice(0, limit).map((s) => s.item);
}

/** Distinct attribute values (occasions, colors, materials, silhouettes, styles)
 *  that match the term — used for "smart" suggestion chips. */
export function suggestAttributes(rawTerm: string, limit = 4): string[] {
  const term = rawTerm.trim().toLowerCase();
  if (!term || !vocab) return [];
  const starts: string[] = [];
  const contains: string[] = [];
  for (const v of vocab) {
    const lc = v.toLowerCase();
    if (lc === term) continue;
    if (lc.startsWith(term)) starts.push(v);
    else if (lc.includes(term)) contains.push(v);
  }
  return [...starts, ...contains].slice(0, limit);
}
