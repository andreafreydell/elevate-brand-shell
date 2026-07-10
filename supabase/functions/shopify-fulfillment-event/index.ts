import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { serviceClient } from "../_shared/auth.ts";
import { verifyShopifyWebhook } from "../_shared/shopify.ts";

// Shopify fulfillments/create + fulfillments/update webhook: the warehouse
// marks the box shipped in Shopify (their normal workflow) and this flips the
// matching rental reservations to "shipped" — nobody touches our dashboard.
// Idempotent: only reservations still in assigned/released_to_wms transition,
// and mark_unit_shipped guards the unit-side state machine.

interface FulfillmentWebhook {
  id?: number | string;
  order_id?: number | string;
  status?: string;
  tracking_number?: string | null;
  line_items?: Array<{ id?: number | string }>;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const rawBody = await req.text();
  if (!(await verifyShopifyWebhook(req, rawBody))) {
    return jsonResponse({ error: "Invalid Shopify webhook signature" }, 401);
  }

  const payload = JSON.parse(rawBody) as FulfillmentWebhook;
  const orderId = payload.order_id != null ? String(payload.order_id) : "";
  if (!orderId) {
    return jsonResponse({ error: "Missing order_id on fulfillment webhook" }, 400);
  }
  // Cancelled/failed fulfillments don't ship anything.
  const status = (payload.status || "").toLowerCase();
  if (status === "cancelled" || status === "error" || status === "failure") {
    return jsonResponse({ ok: true, skipped: `fulfillment status ${status}` });
  }

  const lineItemIds = (payload.line_items || [])
    .map((li) => (li.id != null ? String(li.id) : null))
    .filter((id): id is string => Boolean(id));
  if (lineItemIds.length === 0) {
    return jsonResponse({ ok: true, shipped: [], note: "no line items on fulfillment" });
  }

  const supabase = serviceClient();

  const { data: reservations, error } = await supabase
    .from("rental_reservations")
    .select("serial_number, shopify_line_item_id, internal_status")
    .eq("shopify_order_id", orderId)
    .in("shopify_line_item_id", lineItemIds)
    .in("internal_status", ["assigned", "released_to_wms"]);

  if (error) return jsonResponse({ error: error.message }, 500);

  const shipped: string[] = [];
  const errors: Array<{ serial: string; error: string }> = [];
  for (const r of reservations || []) {
    const { error: rpcError } = await supabase.rpc("mark_unit_shipped", {
      p_serial_number: r.serial_number,
      p_shopify_order_id: orderId,
      p_shopify_line_item_id: r.shopify_line_item_id,
      p_tracking_number: payload.tracking_number || null,
    });
    if (rpcError) errors.push({ serial: r.serial_number, error: rpcError.message });
    else shipped.push(r.serial_number);
  }

  return jsonResponse(
    { ok: errors.length === 0, order_id: orderId, shipped, errors },
    errors.length > 0 ? 207 : 200,
  );
});
