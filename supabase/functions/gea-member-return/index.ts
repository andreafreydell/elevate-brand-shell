import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { serviceClient } from "../_shared/auth.ts";

// Member-facing return declaration (the RETURN SHIPMENT flow): a signed-in
// member says which of their out pieces they're RETURNING and which they're
// KEEPING. Keeps are finalized immediately (mark_unit_kept -> keep counters +
// over-allowance keeps become chargeable). Declared returns are recorded on a
// member_returns row (expected_serials = what the box should contain); the
// team reconciles on arrival exactly as before. No Shopify Return object is
// created here — rental lines are never Shopify-fulfilled, so the native
// returns API can't represent them; member_returns is the source of truth.

const OUT_STATUSES = ["assigned", "released_to_wms", "shipped", "return_open"];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  // Identify the calling member from their JWT.
  const authHeader = req.headers.get("Authorization") || "";
  const jwt = authHeader.replace(/^Bearer\s+/i, "");
  if (!jwt) return jsonResponse({ error: "Unauthorized" }, 401);

  const authClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? "",
  );
  const { data: userData, error: userError } = await authClient.auth.getUser(jwt);
  const userId = userData?.user?.id;
  if (userError || !userId) return jsonResponse({ error: "Unauthorized" }, 401);

  let body: { return_serials?: string[]; keep_serials?: string[] };
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const returnSerials = Array.from(new Set(body.return_serials || []));
  const keepSerials = Array.from(new Set(body.keep_serials || []));
  if (returnSerials.length === 0 && keepSerials.length === 0) {
    return jsonResponse({ error: "Nothing selected" }, 400);
  }
  const overlap = returnSerials.filter((s) => keepSerials.includes(s));
  if (overlap.length > 0) {
    return jsonResponse({ error: `Serials marked both return and keep: ${overlap.join(", ")}` }, 400);
  }

  const supabase = serviceClient();

  // The member may only act on their own out pieces.
  const { data: outReservations, error: outError } = await supabase
    .from("rental_reservations")
    .select("id, serial_number, shopify_order_id, shopify_line_item_id, rental_cycle_id, account_id, internal_status")
    .eq("account_id", userId)
    .in("internal_status", OUT_STATUSES);

  if (outError) return jsonResponse({ error: outError.message }, 500);

  const ownedBySerial = new Map((outReservations || []).map((r) => [r.serial_number, r]));
  const notOwned = [...returnSerials, ...keepSerials].filter((s) => !ownedBySerial.has(s));
  if (notOwned.length > 0) {
    return jsonResponse({ error: `Not your active pieces: ${notOwned.join(", ")}` }, 403);
  }

  // 1. Finalize keeps immediately (the decision is final; over-allowance keeps
  //    become chargeable via the existing counters/keep-fee machinery).
  const keptOk: string[] = [];
  const errors: Array<{ serial: string; error: string }> = [];
  for (const serial of keepSerials) {
    const r = ownedBySerial.get(serial)!;
    const { error } = await supabase.rpc("mark_unit_kept", {
      p_serial_number: serial,
      p_shopify_order_id: r.shopify_order_id,
      p_shopify_line_item_id: r.shopify_line_item_id,
    });
    if (error) errors.push({ serial, error: error.message });
    else keptOk.push(serial);
  }

  // 2. Record the declared returns, grouped per originating order.
  const byOrder = new Map<string, string[]>();
  for (const serial of returnSerials) {
    const r = ownedBySerial.get(serial)!;
    const key = r.shopify_order_id || "no_order";
    byOrder.set(key, [...(byOrder.get(key) || []), serial]);
  }

  const returnsRecorded: Array<{ shopify_order_id: string; return_id: string; serials: string[] }> = [];
  for (const [orderId, serials] of byOrder) {
    const cycleId = ownedBySerial.get(serials[0])!.rental_cycle_id;
    const { data: existing } = await supabase
      .from("member_returns")
      .select("id, expected_serials")
      .eq("shopify_order_id", orderId)
      .eq("status", "open")
      .maybeSingle();

    if (existing?.id) {
      const merged = Array.from(new Set([...(existing.expected_serials || []), ...serials]));
      const { error } = await supabase
        .from("member_returns")
        .update({ expected_serials: merged })
        .eq("id", existing.id);
      if (error) errors.push({ serial: serials.join(","), error: error.message });
      else returnsRecorded.push({ shopify_order_id: orderId, return_id: existing.id, serials });
    } else {
      const { data: created, error } = await supabase
        .from("member_returns")
        .insert({
          account_id: userId,
          rental_cycle_id: cycleId,
          shopify_order_id: orderId,
          source: "manual",
          status: "open",
          expected_serials: serials,
          metadata: { source_detail: "member_portal", declared_at: new Date().toISOString() },
        })
        .select("id")
        .single();
      if (error || !created) errors.push({ serial: serials.join(","), error: error?.message || "insert failed" });
      else returnsRecorded.push({ shopify_order_id: orderId, return_id: created.id, serials });
    }
  }

  // Mark declared returns as return_open so the dashboard reflects the intent.
  if (returnSerials.length > 0) {
    await supabase
      .from("rental_reservations")
      .update({ internal_status: "return_open" })
      .eq("account_id", userId)
      .in("serial_number", returnSerials)
      .in("internal_status", ["assigned", "released_to_wms", "shipped"]);
  }

  return jsonResponse(
    {
      ok: errors.length === 0,
      kept: keptOk,
      returns: returnsRecorded,
      errors,
    },
    errors.length > 0 ? 207 : 200,
  );
});
