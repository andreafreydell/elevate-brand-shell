import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { serviceClient, verifySecret, verifyStaff } from "../_shared/auth.ts";
import { getVariantDetails } from "../_shared/shopify.ts";

// Seed serialized inventory_units for rentable variants from Shopify on-hand
// quantity. Idempotent: only creates serials that don't already exist.
// Body: { variant_ids: string[], default_units?: number }
//   - units per variant = its Shopify inventoryQuantity (fallback default_units).
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

  const body = (await req.json()) as { variant_ids?: string[]; default_units?: number };
  const variantIds = body.variant_ids || [];
  if (variantIds.length === 0) {
    return jsonResponse({ error: "variant_ids required" }, 400);
  }

  const summary: Array<Record<string, unknown>> = [];

  for (const variantId of variantIds) {
    try {
      const details = await getVariantDetails(variantId);
      if (!details) {
        summary.push({ variant_id: variantId, status: "not_found" });
        continue;
      }

      const numericVariant = details.variantId.replace(/^.*\/(\d+)$/, "$1");
      const numericProduct = details.productId ? details.productId.replace(/^.*\/(\d+)$/, "$1") : null;
      const targetUnits = details.inventoryQuantity ?? body.default_units ?? 0;

      if (targetUnits <= 0) {
        summary.push({ variant_id: numericVariant, status: "no_quantity", target: targetUnits });
        continue;
      }

      // Existing serials for this variant (idempotency).
      const { data: existing } = await supabase
        .from("inventory_units")
        .select("serial_number")
        .eq("shopify_variant_id", numericVariant);
      const existingSerials = new Set((existing || []).map((r: any) => r.serial_number));

      const rows: Array<Record<string, unknown>> = [];
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
        summary.push({ variant_id: numericVariant, status: "already_seeded", target: targetUnits });
        continue;
      }

      const { error: insertError } = await supabase.from("inventory_units").insert(rows);
      if (insertError) {
        summary.push({ variant_id: numericVariant, status: "error", error: insertError.message });
        continue;
      }

      summary.push({ variant_id: numericVariant, status: "seeded", created: rows.length, target: targetUnits });
    } catch (err) {
      summary.push({ variant_id: variantId, status: "error", error: err instanceof Error ? err.message : String(err) });
    }
  }

  const anyError = summary.some((s) => s.status === "error");
  return jsonResponse({ ok: !anyError, summary }, anyError ? 207 : 200);
});
