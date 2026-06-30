import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { serviceClient, verifySecret, verifyStaff } from "../_shared/auth.ts";
import { verifyShopifyWebhook } from "../_shared/shopify.ts";

// Two entry points:
//  (a) Shopify returns/create webhook -> open a member_return with expected_serials
//      from the order's shipped reservations (returned serials filled in later).
//  (b) Manual/WMS trigger (secret or staff) -> set returned_serials for an order
//      and reconcile (restock returned, mark not-returned as kept).
//
// Body (manual): { shopify_order_id, returned_serials?: string[], return_id?: uuid, force?: bool }

async function shippedSerialsForOrder(supabase: any, orderId: string) {
  const { data } = await supabase
    .from("rental_reservations")
    .select("serial_number, account_id, rental_cycle_id")
    .eq("shopify_order_id", orderId)
    .in("internal_status", ["assigned", "released_to_wms", "shipped", "return_open"]);
  const serials = (data || []).map((r: any) => r.serial_number);
  const accountId = (data || []).find((r: any) => r.account_id)?.account_id ?? null;
  const cycleId = (data || []).find((r: any) => r.rental_cycle_id)?.rental_cycle_id ?? null;
  return { serials, accountId, cycleId };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const supabase = serviceClient();
  const rawBody = await req.text();
  const isWebhook = Boolean(req.headers.get("x-shopify-hmac-sha256"));

  // ---- (a) Shopify returns/create webhook: open the return ----
  if (isWebhook) {
    if (!(await verifyShopifyWebhook(req, rawBody))) {
      return jsonResponse({ error: "Invalid Shopify webhook signature" }, 401);
    }
    const payload = JSON.parse(rawBody) as { id?: number | string; order_id?: number | string; order?: { id?: number | string } };
    const orderId = String(payload.order_id ?? payload.order?.id ?? "");
    if (!orderId) {
      return jsonResponse({ error: "Missing order_id on return webhook" }, 400);
    }
    const { serials, accountId, cycleId } = await shippedSerialsForOrder(supabase, orderId);
    const { data, error } = await supabase
      .from("member_returns")
      .insert({
        account_id: accountId,
        rental_cycle_id: cycleId,
        shopify_order_id: orderId,
        shopify_return_id: payload.id != null ? String(payload.id) : null,
        source: "shopify_return",
        status: "open",
        expected_serials: serials,
      })
      .select()
      .single();
    if (error) return jsonResponse({ error: error.message }, 500);
    return jsonResponse({ ok: true, member_return: data });
  }

  // ---- (b) Manual / WMS trigger: set returned serials + reconcile ----
  const secretOk = verifySecret(req, "x-gea-wms-secret", "GEA_WMS_EVENT_SECRET");
  const staff = secretOk ? { ok: true } : await verifyStaff(req, supabase);
  if (!secretOk && !staff.ok) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  const body = JSON.parse(rawBody || "{}") as {
    shopify_order_id?: string;
    returned_serials?: string[];
    return_id?: string;
    force?: boolean;
  };

  let returnId = body.return_id ?? null;

  // Find or create the return row for this order.
  if (!returnId) {
    if (!body.shopify_order_id) {
      return jsonResponse({ error: "shopify_order_id or return_id required" }, 400);
    }
    const { data: existing } = await supabase
      .from("member_returns")
      .select("id")
      .eq("shopify_order_id", body.shopify_order_id)
      .eq("status", "open")
      .maybeSingle();

    if (existing) {
      returnId = existing.id;
    } else {
      const { serials, accountId, cycleId } = await shippedSerialsForOrder(supabase, body.shopify_order_id);
      const { data: created, error: createError } = await supabase
        .from("member_returns")
        .insert({
          account_id: accountId,
          rental_cycle_id: cycleId,
          shopify_order_id: body.shopify_order_id,
          source: "wms",
          status: "open",
          expected_serials: serials,
        })
        .select("id")
        .single();
      if (createError) return jsonResponse({ error: createError.message }, 500);
      returnId = created.id;
    }
  }

  if (body.returned_serials) {
    const { error: updError } = await supabase
      .from("member_returns")
      .update({ returned_serials: body.returned_serials })
      .eq("id", returnId);
    if (updError) return jsonResponse({ error: updError.message }, 500);
  }

  const { data: reconciled, error: reconcileError } = await supabase.rpc("reconcile_member_return", {
    p_return_id: returnId,
    p_force: body.force ?? false,
  });
  if (reconcileError) return jsonResponse({ error: reconcileError.message }, 500);

  return jsonResponse({ ok: true, member_return: reconciled });
});
