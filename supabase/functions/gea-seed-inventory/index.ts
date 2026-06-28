import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { serviceClient, verifySecret, verifyStaff } from "../_shared/auth.ts";
import { getCollectionVariants, getVariantDetails } from "../_shared/shopify.ts";
import type { ShopifyVariantDetails } from "../_shared/shopify.ts";

// Seed serialized inventory_units for rentable variants from Shopify on-hand
// quantity. Idempotent: only creates serials that don't already exist.
// Body (one of):
//   { variant_ids: string[], default_units?: number }  — seed specific variants
//   { collection_id: string, default_units?: number }  — seed every variant in a
//       collection (e.g. the Rental collection) in one call.
//   - units per variant = its Shopify inventoryQuantity (fallback default_units).
type SeedRow = Record<string, unknown>;

async function seedVariant(
  supabase: ReturnType<typeof serviceClient>,
  details: ShopifyVariantDetails,
  defaultUnits: number,
): Promise<SeedRow> {
  const numericVariant = details.variantId.replace(/^.*\/(\d+)$/, "$1");
  const numericProduct = details.productId
    ? details.productId.replace(/^.*\/(\d+)$/, "$1")
    : null;
  const targetUnits = details.inventoryQuantity ?? defaultUnits ?? 0;

  if (targetUnits <= 0) {
    return { variant_id: numericVariant, status: "no_quantity", target: targetUnits };
  }

  // Existing serials for this variant (idempotency).
  const { data: existing } = await supabase
    .from("inventory_units")
    .select("serial_number")
    .eq("shopify_variant_id", numericVariant);
  const existingSerials = new Set((existing || []).map((r: any) => r.serial_number));

  const rows: SeedRow[] = [];
  for (let i = 1; i <= targetUnits; i++) {
    const seq = String(i).padStart(4, "0");
    const serial = `GEA-${numericVariant}-${seq}`;
    if (existingSerials.has(serial)) continue;
    rows.push({
      unit_id: serial,
      serial_number: serial,
      shopify_variant_id: numericVariant,
      shopify_product_id: numericProduct,
      sku: details.sku || `SKU-${numericVariant}`,
      retail_price_cache: details.price ? Number(details.price) : null,
    });
  }

  if (rows.length === 0) {
    return { variant_id: numericVariant, status: "already_seeded", target: targetUnits };
  }

  const { error: insertError } = await supabase.from("inventory_units").insert(rows);
  if (insertError) {
    return { variant_id: numericVariant, status: "error", error: insertError.message };
  }

  return { variant_id: numericVariant, status: "seeded", created: rows.length, target: targetUnits };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const supabase = serviceClient();
  const secretOk = verifySecret(req, "x-gea-admin-secret", "GEA_ADMIN_SECRET");
  const staff = secretOk ? { ok: true } : await verifyStaff(req, supabase);
  if (!secretOk && !staff.ok) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  const body = (await req.json()) as {
    variant_ids?: string[];
    collection_id?: string;
    default_units?: number;
  };
  const defaultUnits = body.default_units ?? 0;
  const summary: SeedRow[] = [];

  try {
    if (body.collection_id) {
      // Resolve every variant in the collection server-side, then seed each.
      const variants = await getCollectionVariants(body.collection_id);
      if (variants.length === 0) {
        return jsonResponse({ error: "collection has no variants (check collection_id / scopes)" }, 400);
      }
      for (const details of variants) {
        try {
          summary.push(await seedVariant(supabase, details, defaultUnits));
        } catch (err) {
          summary.push({ variant_id: details.variantId, status: "error", error: err instanceof Error ? err.message : String(err) });
        }
      }
    } else {
      const variantIds = body.variant_ids || [];
      if (variantIds.length === 0) {
        return jsonResponse({ error: "variant_ids or collection_id required" }, 400);
      }
      for (const variantId of variantIds) {
        try {
          const details = await getVariantDetails(variantId);
          if (!details) {
            summary.push({ variant_id: variantId, status: "not_found" });
            continue;
          }
          summary.push(await seedVariant(supabase, details, defaultUnits));
        } catch (err) {
          summary.push({ variant_id: variantId, status: "error", error: err instanceof Error ? err.message : String(err) });
        }
      }
    }
  } catch (err) {
    // A top-level failure (e.g. the collection lookup itself) — surface it.
    return jsonResponse(
      { ok: false, error: err instanceof Error ? err.message : String(err), summary },
      502,
    );
  }

  const anyError = summary.some((s) => s.status === "error");
  const seeded = summary.filter((s) => s.status === "seeded").length;
  return jsonResponse({ ok: !anyError, seeded, total: summary.length, summary }, anyError ? 207 : 200);
});
