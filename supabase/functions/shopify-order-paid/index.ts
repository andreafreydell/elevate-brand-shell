// Shopify webhook: orders/paid
// On a paid order, find any line items for the Theolia test product (matched by SKU),
// atomically claim the next available serial from `theolia_test_serials`, and write the
// claimed serial back to the Shopify order as both an order note and an order metafield.
//
// Auth model:
//  - Shopify signs every webhook with HMAC-SHA256 using a webhook signing secret.
//    We verify the X-Shopify-Hmac-Sha256 header before doing any work.
//  - To call the Shopify Admin API, we use the Client Credentials grant (new Dev
//    Dashboard flow): POST /admin/oauth/access_token with client_id + client_secret
//    to exchange them for a short-lived Admin API access token, then use that token.
//
// Required runtime secrets:
//   SHOPIFY_CLIENT_ID
//   SHOPIFY_CLIENT_SECRET         doubles as the webhook signing key for HTTPS
//                                 webhooks created via the Dev Dashboard / app config
//   SHOPIFY_STORE_DOMAIN          e.g. maisonfreydell.myshopify.com
//   SUPABASE_URL                  (auto-provided)
//   SUPABASE_SERVICE_ROLE_KEY     (auto-provided)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-shopify-hmac-sha256, x-shopify-topic, x-shopify-shop-domain",
};

const SHOPIFY_API_VERSION = "2025-07";

// SKUs that should receive a serial. Keep small and explicit while we test.
const SERIALIZED_SKUS = new Set<string>(["THEOLIA-SCC-NECK"]);

// ---------- Helpers ----------

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
  // Constant-time-ish compare
  if (computed.length !== hmacHeader.length) return false;
  let diff = 0;
  for (let i = 0; i < computed.length; i++) {
    diff |= computed.charCodeAt(i) ^ hmacHeader.charCodeAt(i);
  }
  return diff === 0;
}

async function getAdminAccessToken(): Promise<string> {
  const clientId = Deno.env.get("SHOPIFY_CLIENT_ID");
  const clientSecret = Deno.env.get("SHOPIFY_CLIENT_SECRET");
  const storeDomain = Deno.env.get("SHOPIFY_STORE_DOMAIN");
  if (!clientId || !clientSecret || !storeDomain) {
    throw new Error("Missing Shopify client credentials or store domain");
  }

  const res = await fetch(`https://${storeDomain}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials",
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Token exchange failed [${res.status}]: ${body}`);
  }

  const json = await res.json() as { access_token?: string };
  if (!json.access_token) {
    throw new Error("Token exchange returned no access_token");
  }
  return json.access_token;
}

async function appendOrderNote(
  storeDomain: string,
  token: string,
  orderId: number,
  appendedNote: string,
): Promise<void> {
  // First fetch existing note so we don't clobber it.
  const getRes = await fetch(
    `https://${storeDomain}/admin/api/${SHOPIFY_API_VERSION}/orders/${orderId}.json?fields=id,note`,
    { headers: { "X-Shopify-Access-Token": token } },
  );
  if (!getRes.ok) {
    console.error("Failed to read existing order note", await getRes.text());
    return;
  }
  const { order } = await getRes.json() as { order: { note: string | null } };
  const existing = order.note ?? "";
  const newNote = existing
    ? `${existing}\n\n${appendedNote}`
    : appendedNote;

  const putRes = await fetch(
    `https://${storeDomain}/admin/api/${SHOPIFY_API_VERSION}/orders/${orderId}.json`,
    {
      method: "PUT",
      headers: {
        "X-Shopify-Access-Token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ order: { id: orderId, note: newNote } }),
    },
  );
  if (!putRes.ok) {
    console.error("Failed to update order note", await putRes.text());
  }
}

async function setOrderSerialMetafield(
  storeDomain: string,
  token: string,
  orderId: number,
  serials: string[],
): Promise<void> {
  // Single metafield holding a JSON list of claimed serials for the order.
  const res = await fetch(
    `https://${storeDomain}/admin/api/${SHOPIFY_API_VERSION}/orders/${orderId}/metafields.json`,
    {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        metafield: {
          namespace: "gea",
          key: "theolia_serials",
          type: "json",
          value: JSON.stringify(serials),
        },
      }),
    },
  );
  if (!res.ok) {
    console.error("Failed to write order metafield", await res.text());
  }
}

// ---------- Handler ----------

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

  // Shopify signs HTTPS webhooks created via the Dev Dashboard/app config using
  // the app's Client Secret. There is no separate webhook signing secret.
  const webhookSecret = Deno.env.get("SHOPIFY_CLIENT_SECRET");
  if (!webhookSecret) {
    console.error("SHOPIFY_CLIENT_SECRET is not configured");
    return new Response("Server not configured", { status: 500, headers: corsHeaders });
  }

  const valid = await verifyShopifyHmac(rawBody, hmacHeader, webhookSecret);
  if (!valid) {
    console.warn("Rejected webhook: invalid HMAC", { topic, shopDomain });
    return new Response("Invalid signature", { status: 401, headers: corsHeaders });
  }

  // Acknowledge anything that isn't orders/paid quickly.
  if (topic && topic !== "orders/paid") {
    return new Response("Ignored topic", { status: 200, headers: corsHeaders });
  }

  let order: any;
  try {
    order = JSON.parse(rawBody);
  } catch {
    return new Response("Invalid JSON", { status: 400, headers: corsHeaders });
  }

  const orderId: number | undefined = order?.id;
  const orderName: string | undefined = order?.name;
  const lineItems: Array<any> = Array.isArray(order?.line_items) ? order.line_items : [];

  if (!orderId || !orderName) {
    return new Response("Missing order id/name", { status: 400, headers: corsHeaders });
  }

  // Find line items that need a serial.
  const targets = lineItems.filter((li) => li?.sku && SERIALIZED_SKUS.has(li.sku));
  if (targets.length === 0) {
    return new Response(JSON.stringify({ skipped: "no serialized SKUs in order" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Claim a serial from the DB for each matching line item, respecting quantity.
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const claimed: Array<{ sku: string; lineItemId: number; serial: string }> = [];
  const failed: Array<{ sku: string; lineItemId: number; reason: string }> = [];

  for (const li of targets) {
    const variantId = String(li.variant_id ?? "");
    const lineItemId = Number(li.id);
    const qty = Math.max(1, Number(li.quantity ?? 1));

    for (let i = 0; i < qty; i++) {
      const { data, error } = await supabase.rpc("claim_theolia_serial", {
        _variant_id: variantId,
        _order_id: String(orderId),
        _order_name: orderName,
        _line_item_id: String(lineItemId),
      });
      if (error) {
        console.error("claim_theolia_serial error", error);
        failed.push({ sku: li.sku, lineItemId, reason: error.message });
        break;
      }
      if (!data) {
        failed.push({ sku: li.sku, lineItemId, reason: "no_serial_available" });
        break;
      }
      claimed.push({ sku: li.sku, lineItemId, serial: data as unknown as string });
    }
  }

  if (claimed.length === 0) {
    console.warn("No serials claimed", { orderName, failed });
    return new Response(JSON.stringify({ claimed, failed }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Write claimed serials back to the Shopify order.
  try {
    const token = await getAdminAccessToken();
    const storeDomain = Deno.env.get("SHOPIFY_STORE_DOMAIN")!;

    const noteLines = [
      "GEA Serial Assignment",
      ...claimed.map((c) => `• ${c.sku} → ${c.serial}`),
    ];
    if (failed.length > 0) {
      noteLines.push("Unassigned:");
      for (const f of failed) {
        noteLines.push(`• ${f.sku} (line ${f.lineItemId}): ${f.reason}`);
      }
    }
    await appendOrderNote(storeDomain, token, orderId, noteLines.join("\n"));
    await setOrderSerialMetafield(
      storeDomain,
      token,
      orderId,
      claimed.map((c) => c.serial),
    );
  } catch (err) {
    console.error("Failed to write back to Shopify order", err);
    // We don't unwind the DB claim — the serial is still recorded against the order id.
    return new Response(
      JSON.stringify({ claimed, failed, writeBackError: String(err) }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  return new Response(JSON.stringify({ claimed, failed }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
