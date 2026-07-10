// Extra-keep fee charging, shared by the staff endpoint (gea-charge-keep-fee)
// and the automatic returns/close webhook (shopify-return-event). For every
// keep beyond the cycle's allowance: ensure a charge row exists (idempotent
// per reservation) and attempt capture against the member's payment on file.

import { chargeKeepFeeToCustomer } from "./shopify.ts";

export interface KeepFeeChargeOutcome {
  ok: boolean;
  cycle_id: string;
  charges: Array<Record<string, unknown>>;
  error?: string;
}

// deno-lint-ignore no-explicit-any
export async function chargeKeepFeesForCycle(supabase: any, cycleId: string): Promise<KeepFeeChargeOutcome> {
  const { data: cycle, error: cycleError } = await supabase
    .from("rental_cycles")
    .select("id, account_id")
    .eq("id", cycleId)
    .single();
  if (cycleError || !cycle) {
    return { ok: false, cycle_id: cycleId, charges: [], error: cycleError?.message || "cycle not found" };
  }

  const { data: account } = await supabase
    .from("profiles")
    .select("id, shopify_customer_id")
    .eq("id", cycle.account_id)
    .single();
  if (!account) {
    return { ok: false, cycle_id: cycleId, charges: [], error: "account not found" };
  }

  const { data: chargeable, error: feeError } = await supabase.rpc("compute_keep_fees", {
    p_cycle_id: cycleId,
  });
  if (feeError) {
    return { ok: false, cycle_id: cycleId, charges: [], error: feeError.message };
  }

  const results: Array<Record<string, unknown>> = [];

  for (const item of (chargeable || []) as Array<{
    rental_reservation_id: string;
    serial_number: string;
    item_price: number;
    fee_amount: number;
  }>) {
    const idempotencyKey = `keep_fee:${item.rental_reservation_id}`;

    const { data: charge, error: chargeError } = await supabase.rpc("create_charge", {
      p_account_id: account.id,
      p_rental_cycle_id: cycleId,
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

    if (charge.status === "charged") {
      results.push({ reservation_id: item.rental_reservation_id, status: "already_charged", charge_id: charge.id });
      continue;
    }

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
  return { ok: !anyFailed, cycle_id: cycleId, charges: results };
}
