import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const API_VERSION = Deno.env.get("SHOPIFY_ADMIN_API_VERSION") || "2026-01";
const FUNCTIONS_BASE = "https://nwgndnochdbpjijhnbgq.supabase.co/functions/v1";

const DESIRED = [
  { topic: "subscription_contracts/create", fn: "shopify-subscription-sync" },
  { topic: "subscription_contracts/update", fn: "shopify-subscription-sync" },
  { topic: "returns/request", fn: "gea-create-return" },
  { topic: "orders/paid", fn: "shopify-order-paid" },
];

function getShopDomain() {
  return Deno.env.get("SHOPIFY_SHOP_DOMAIN") || Deno.env.get("SHOPIFY_STORE_DOMAIN");
}

async function mintAdminToken(shopDomain: string): Promise<string> {
  const staticToken = Deno.env.get("SHOPIFY_ADMIN_ACCESS_TOKEN");
  if (staticToken) return staticToken;

  const clientId = Deno.env.get("SHOPIFY_OAUTH_CLIENT_ID");
  const clientSecret = Deno.env.get("SHOPIFY_OAUTH_CLIENT_SECRET");
  if (clientId && clientSecret) {
    const res = await fetch(`https://${shopDomain}/admin/oauth/access_token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });
    const json = await res.json().catch(() => ({}));
    if (res.ok && json.access_token) return json.access_token as string;
    throw new Error(`client_credentials failed: ${JSON.stringify(json)}`);
  }

  const fallback = Deno.env.get("SHOPIFY_ACCESS_TOKEN");
  if (fallback) return fallback;
  throw new Error("No Shopify admin credentials available.");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const adminSecret = Deno.env.get("REGISTER_WEBHOOKS_KEY");
  if (!adminSecret || req.headers.get("x-admin-secret") !== adminSecret) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const shopDomain = getShopDomain();
    if (!shopDomain) throw new Error("Shop domain not configured.");
    const token = await mintAdminToken(shopDomain);

    const restBase = `https://${shopDomain}/admin/api/${API_VERSION}`;
    const authHeaders = { "X-Shopify-Access-Token": token, "Content-Type": "application/json" };

    // Existing webhooks
    const listRes = await fetch(`${restBase}/webhooks.json?limit=250`, { headers: authHeaders });
    const listJson = await listRes.json().catch(() => ({}));
    const existing: Array<{ id: number; topic: string; address: string }> = listJson.webhooks || [];

    const results: unknown[] = [];

    for (const { topic, fn } of DESIRED) {
      const address = `${FUNCTIONS_BASE}/${fn}`;
      const match = existing.find((w) => w.topic === topic && w.address === address);
      if (match) {
        results.push({ topic, address, status: "already_exists", id: match.id });
        continue;
      }

      const createRes = await fetch(`${restBase}/webhooks.json`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ webhook: { topic, address, format: "json" } }),
      });
      const createJson = await createRes.json().catch(() => ({}));
      if (createRes.ok && createJson.webhook) {
        results.push({ topic, address, status: "created", id: createJson.webhook.id });
      } else {
        results.push({ topic, address, status: "error", http: createRes.status, body: createJson });
      }
    }

    // Re-list for confirmation
    const finalRes = await fetch(`${restBase}/webhooks.json?limit=250`, { headers: authHeaders });
    const finalJson = await finalRes.json().catch(() => ({}));
    const finalWebhooks = (finalJson.webhooks || []).map((w: { id: number; topic: string; address: string }) => ({
      id: w.id,
      topic: w.topic,
      address: w.address,
    }));

    return new Response(
      JSON.stringify({ ok: true, apiVersion: API_VERSION, results, allWebhooks: finalWebhooks }, null, 2),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
