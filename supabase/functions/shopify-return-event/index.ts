import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { serviceClient } from "../_shared/auth.ts";
import { getReturnLineItems, verifyShopifyWebhook } from "../_shared/shopify.ts";
import { chargeKeepFeesForCycle } from "../_shared/fees.ts";

// Shopify returns/close webhook — the automatic reconciler. When the
// warehouse receives the box and closes the Return in the Shopify admin
// (their normal workflow), this:
//   1. resolves which line items the Return covered -> which serials arrived,
//   2. records them as returned_serials on the open member_returns row
//      (creating one if the return was opened directly in Shopify),
//   3. runs reconcile_member_return(force) — arrivals restock, declared-but-
//      missing pieces become keeps,
//   4. charges any over-allowance keep fees for the cycle automatically.
// The dashboard is visualization only; no human touches our backend.

interface ReturnWebhook {
  id?: number | string;
  admin_graphql_api_id?: string;
  order_id?: number | string;
  status?: string;
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

  const payload = JSON.parse(rawBody) as ReturnWebhook;
  const returnRef = payload.admin_graphql_api_id || (payload.id != null ? String(payload.id) : "");
  if (!returnRef) {
    return jsonResponse({ error: "Missing return id on webhook" }, 400);
  }

  // Which line items did the warehouse actually receive back?
  const lines = await getReturnLineItems(returnRef);
  const orderId = lines.orderId || (payload.order_id != null ? String(payload.order_id) : "");
  if (!orderId) {
    return jsonResponse({ error: lines.error || "Could not resolve order for return" }, 422);
  }

  const supabase = serviceClient();

  // Line items -> serials via our reservations.
  let receivedSerials: string[] = [];
  if (lines.lineItemIds.length > 0) {
    const { data: reservations, error } = await supabase
      .from("rental_reservations")
      .select("serial_number, account_id, rental_cycle_id")
      .eq("shopify_order_id", orderId)
      .in("shopify_line_item_id", lines.lineItemIds);
    if (error) return jsonResponse({ error: error.message }, 500);
    receivedSerials = (reservations || []).map((r) => r.serial_number);
  }

  // Find the open member_returns row for this order (prefer a shopify_return_id
  // match, fall back to the order's open row).
  const returnIdTail = returnRef.split("/").pop() ?? returnRef;
  let { data: row } = await supabase
    .from("member_returns")
    .select("id, rental_cycle_id, returned_serials, expected_serials, status")
    .eq("shopify_order_id", orderId)
    .eq("status", "open")
    .maybeSingle();

  if (!row) {
    // Return was opened directly in Shopify (not via our member portal):
    // create the row so reconciliation has something to work with. Everything
    // received counts as expected; nothing becomes a keep in this path.
    const { data: anyReservation } = await supabase
      .from("rental_reservations")
      .select("account_id, rental_cycle_id")
      .eq("shopify_order_id", orderId)
      .limit(1)
      .maybeSingle();
    const { data: created, error: createError } = await supabase
      .from("member_returns")
      .insert({
        account_id: anyReservation?.account_id ?? null,
        rental_cycle_id: anyReservation?.rental_cycle_id ?? null,
        shopify_order_id: orderId,
        shopify_return_id: returnIdTail,
        source: "shopify_return",
        status: "open",
        expected_serials: receivedSerials,
        metadata: { source_detail: "returns_close_webhook" },
      })
      .select("id, rental_cycle_id, returned_serials, expected_serials, status")
      .single();
    if (createError || !created) {
      return jsonResponse({ error: createError?.message || "could not create member_returns row" }, 500);
    }
    row = created;
  }

  // Record what physically arrived (merge with any prior partial receipts).
  const returnedMerged = Array.from(new Set([...(row.returned_serials || []), ...receivedSerials]));
  const { error: updateError } = await supabase
    .from("member_returns")
    .update({ returned_serials: returnedMerged, shopify_return_id: returnIdTail })
    .eq("id", row.id);
  if (updateError) return jsonResponse({ error: updateError.message }, 500);

  // Reconcile now (force): the warehouse closing the return is the final word.
  // Arrivals restock; declared-but-missing pieces become keeps.
  const { data: reconciled, error: reconcileError } = await supabase.rpc("reconcile_member_return", {
    p_return_id: row.id,
    p_force: true,
  });
  if (reconcileError) return jsonResponse({ error: reconcileError.message }, 500);

  // Charge over-allowance keep fees for the cycle, automatically.
  let fees = null;
  const cycleId = reconciled?.rental_cycle_id ?? row.rental_cycle_id;
  if (cycleId) {
    fees = await chargeKeepFeesForCycle(supabase, cycleId);
    if (!fees.ok) console.error("Automatic keep-fee charging reported failures:", JSON.stringify(fees));
  }

  return jsonResponse({
    ok: true,
    order_id: orderId,
    shopify_return_id: returnIdTail,
    received_serials: receivedSerials,
    member_return: reconciled,
    keep_fees: fees,
  });
});
