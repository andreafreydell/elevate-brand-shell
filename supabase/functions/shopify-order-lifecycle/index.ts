// Shopify webhook: lifecycle events for serialized rental units.
//
// Handles two topics in one function (Shopify includes the topic in the
// X-Shopify-Topic header):
//   - orders/fulfilled  → flip the unit's claimed serial(s) to SHIPPED
//                         and bump rental_count + last_shipped_at.
//   - refunds/create    → flip the unit's claimed serial(s) to UNDER_INSPECTION
//                         (treated as the customer return event for our rental flow).
//
// We resolve which serial(s) belong to the order by reading the
// `theolia_test_serials.assigned_order_id` column that `orders/paid` already set.
//
// Auth model mirrors shopify-order-paid: HMAC verified using SHOPIFY_CLIENT_SECRET.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-shopify-hmac-sha256, x-shopify-topic, x-shopify-shop-domain",
};

async function verifyShopifyHmac(
  rawBody: string,
  hmacHeader: string | null,
  secret: string,
): Promise<boolean> {
  if (!hmacHeader) return false;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sigBytes = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(rawBody),
  );
  const computed = btoa(String.fromCharCode(...new Uint8Array(sigBytes)));
  if (computed.length !== hmacHeader.length) return false;
  let diff = 0;
  for (let i = 0; i < computed.length; i++) {
    diff |= computed.charCodeAt(i) ^ hmacHeader.charCodeAt(i);
  }
  return diff === 0;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  const rawBody = await req.text();
  const hmacHeader = req.headers.get("x-shopify-hmac-sha256");
  const topic = req.headers.get("x-shopify-topic");
  const shopDomain = req.headers.get("x-shopify-shop-domain");

  const webhookSecret = Deno.env.get("SHOPIFY_CLIENT_SECRET");
  if (!webhookSecret) {
    console.error("SHOPIFY_CLIENT_SECRET not configured");
    return new Response("Server not configured", { status: 500, headers: corsHeaders });
  }

  const valid = await verifyShopifyHmac(rawBody, hmacHeader, webhookSecret);
  if (!valid) {
    console.warn("Rejected lifecycle webhook: invalid HMAC", { topic, shopDomain });
    return new Response("Invalid signature", { status: 401, headers: corsHeaders });
  }

  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return new Response("Invalid JSON", { status: 400, headers: corsHeaders });
  }

  // For orders/fulfilled the body is the order. For refunds/create it's the refund,
  // which has order_id at the top level but no order_name. We fetch the assigned
  // serials by order id either way.
  const orderId: number | undefined = payload?.id && topic === "orders/fulfilled"
    ? payload.id
    : payload?.order_id;
  const orderName: string | undefined = payload?.name ?? payload?.order_name ?? "";

  if (!orderId) {
    console.warn("lifecycle webhook missing order id", { topic });
    return new Response("Missing order id", { status: 400, headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // Find every serial assigned to this Shopify order.
  const { data: units, error: lookupErr } = await supabase
    .from("theolia_test_serials")
    .select("serial, assigned_order_name")
    .eq("assigned_order_id", String(orderId));

  if (lookupErr) {
    console.error("lookup error", lookupErr);
    return new Response("Lookup failed", { status: 500, headers: corsHeaders });
  }

  if (!units || units.length === 0) {
    console.log("No serialized units for this order — ignoring", { orderId, topic });
    return new Response(
      JSON.stringify({ skipped: "no_serials_for_order", orderId, topic }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const resolvedOrderName = orderName || units[0].assigned_order_name || "";
  const results: Array<{ serial: string; ok: boolean; reason?: string }> = [];

  for (const unit of units) {
    // Cancellations release the unit back into available inventory.
    if (topic === "orders/cancelled") {
      const { error } = await supabase.rpc("mark_unit_ready", {
        _serial: unit.serial,
        _source: "webhook_cancel",
      });
      if (error) {
        console.error("mark_unit_ready (cancel) failed", { serial: unit.serial, error });
        results.push({ serial: unit.serial, ok: false, reason: error.message });
      } else {
        results.push({ serial: unit.serial, ok: true });
      }
      continue;
    }

    let rpcName: "mark_unit_shipped" | "mark_unit_returned";
    if (topic === "orders/fulfilled") {
      rpcName = "mark_unit_shipped";
    } else if (topic === "refunds/create") {
      rpcName = "mark_unit_returned";
    } else {
      console.log("Unhandled topic, ignoring", { topic });
      return new Response("Ignored topic", { status: 200, headers: corsHeaders });
    }

    const { error } = await supabase.rpc(rpcName, {
      _serial: unit.serial,
      _order_id: String(orderId),
      _order_name: resolvedOrderName,
    });
    if (error) {
      console.error(`${rpcName} failed`, { serial: unit.serial, error });
      results.push({ serial: unit.serial, ok: false, reason: error.message });
    } else {
      results.push({ serial: unit.serial, ok: true });
    }
  }

  return new Response(
    JSON.stringify({ topic, orderId, results }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
