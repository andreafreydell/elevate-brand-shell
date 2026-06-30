import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { serviceClient, verifyStaff } from "../_shared/auth.ts";
import { chargeKeepFeeToCustomer } from "../_shared/shopify.ts";

// Staff-triggered: charge the 40%-of-retail extra-keep fee for every keep beyond
// the cycle's allowance. Idempotent per reservation (one charge row each); already
// charged rows are skipped, failed ones can be retried.
// Body: { cycle_id: uuid }
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const supabase = serviceClient();
  const staff = await verifyStaff(req, supabase);
  if (!staff.ok) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  const { cycle_id } = (await req.json()) as { cycle_id?: string };
  if (!cycle_id) {
    return jsonResponse({ error: "cycle_id required" }, 400);
  }

  // Resolve account + Shopify customer for this cycle.
  const { data: cycle, error: cycleError } = await supabase
    .from("rental_cycles")
    .select("id, account_id")
    .eq("id", cycle_id)
    .single();
  if (cycleError || !cycle) {
    return jsonResponse({ error: cycleError?.message || "cycle not found" }, 404);
  }

  const { data: account } = await supabase
    .from("profiles")
    .select("id, shopify_customer_id")
    .eq("id", cycle.account_id)
    .single();
  if (!account) {
    return jsonResponse({ error: "account not found" }, 404);
  }

  const { data: chargeable, error: feeError } = await supabase.rpc("compute_keep_fees", {
    p_cycle_id: cycle_id,
  });
  if (feeError) {
    return jsonResponse({ error: feeError.message }, 500);
  }

  const results: Array<Record<string, unknown>> = [];

  for (const item of (chargeable || []) as Array<{
    rental_reservation_id: string;
    serial_number: string;
    item_price: number;
    fee_amount: number;
  }>) {
    const idempotencyKey = `keep_fee:${item.rental_reservation_id}`;

    // Ensure the charge row exists (idempotent).
    const { data: charge, error: chargeError } = await supabase.rpc("create_charge", {
      p_account_id: account.id,
      p_rental_cycle_id: cycle_id,
      p_rental_reservation_id: item.rental_reservation_id,
      p_charge_type: "extra_keep_fee",
      p_amount: item.fee_amount,
      p_basis: { unit_price: item.item_price, pct: 0.4, serial_number: item.serial_number },
      p_idempotency_key: idempotencyKey,
    });
    if (chargeError || !charge) {
      results.push({ reservation_id: item.rental_reservation_id, status: "error", error: chargeError?.message });
      continue;
    }

    // Already collected: skip.
    if (charge.status === "charged") {
      results.push({ reservation_id: item.rental_reservation_id, status: "already_charged", charge_id: charge.id });
      continue;
    }

    // Attempt to capture against the customer's payment on file.
    const charged = await chargeKeepFeeToCustomer({
      customerId: account.shopify_customer_id,
      title: `GEA extra-keep fee — ${item.serial_number}`,
      amount: Number(item.fee_amount),
    });

    const newStatus = charged.captured ? "charged" : "failed";
    await supabase
      .from("charges")
      .update({
        status: newStatus,
        shopify_charge_ref: charged.completedOrderId || charged.draftOrderId,
        error: charged.error,
      })
      .eq("id", charge.id);

    results.push({
      reservation_id: item.rental_reservation_id,
      status: newStatus,
      charge_id: charge.id,
      amount: item.fee_amount,
      draft_order_id: charged.draftOrderId,
      invoice_url: charged.invoiceUrl,
      error: charged.error,
    });
  }

  const anyFailed = results.some((r) => r.status === "failed" || r.status === "error");
  return jsonResponse({ ok: !anyFailed, cycle_id, charges: results }, anyFailed ? 207 : 200);
});
