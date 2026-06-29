import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const API_VERSION = Deno.env.get("SHOPIFY_ADMIN_API_VERSION") || "2026-01";
const FUNCTIONS_BASE = "https://nwgndnochdbpjijhnbgq.supabase.co/functions/v1";

const DESIRED = [
  { topic: "SUBSCRIPTION_CONTRACTS_CREATE", fn: "shopify-subscription-sync" },
  { topic: "SUBSCRIPTION_CONTRACTS_UPDATE", fn: "shopify-subscription-sync" },
  { topic: "RETURNS_REQUEST", fn: "gea-create-return" },
  { topic: "ORDERS_PAID", fn: "shopify-order-paid" },
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
    const gqlUrl = `https://${shopDomain}/admin/api/${API_VERSION}/graphql.json`;
    const authHeaders = { "X-Shopify-Access-Token": token, "Content-Type": "application/json" };

    async function gql(query: string, variables: Record<string, unknown> = {}) {
      const r = await fetch(gqlUrl, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ query, variables }),
      });
      return r.json();
    }

    const listQuery = `{
      webhookSubscriptions(first: 100) {
        edges { node { id topic endpoint { __typename ... on WebhookHttpEndpoint { callbackUrl } } } }
      }
    }`;

    const listJson = await gql(listQuery);
    type Node = { id: string; topic: string; endpoint?: { callbackUrl?: string } };
    const existing: Node[] = (listJson?.data?.webhookSubscriptions?.edges || []).map(
      (e: { node: Node }) => e.node,
    );

    const createMutation = `
      mutation Create($topic: WebhookSubscriptionTopic!, $sub: WebhookSubscriptionInput!) {
        webhookSubscriptionCreate(topic: $topic, webhookSubscription: $sub) {
          webhookSubscription { id }
          userErrors { field message }
        }
      }`;

    const results: unknown[] = [];

    for (const { topic, fn } of DESIRED) {
      const callbackUrl = `${FUNCTIONS_BASE}/${fn}`;
      const match = existing.find((w) => w.topic === topic && w.endpoint?.callbackUrl === callbackUrl);
      if (match) {
        results.push({ topic, callbackUrl, status: "already_exists", id: match.id });
        continue;
      }

      const createJson = await gql(createMutation, {
        topic,
        sub: { callbackUrl, format: "JSON" },
      });

      const payload = createJson?.data?.webhookSubscriptionCreate;
      const userErrors = payload?.userErrors || [];
      const topErrors = createJson?.errors;

      if (payload?.webhookSubscription?.id) {
        results.push({ topic, callbackUrl, status: "created", id: payload.webhookSubscription.id });
      } else {
        results.push({ topic, callbackUrl, status: "error", userErrors, topErrors });
      }
    }

    const finalJson = await gql(listQuery);
    const finalWebhooks: Array<{ topic: string; callbackUrl?: string; id: string }> = (
      finalJson?.data?.webhookSubscriptions?.edges || []
    ).map((e: { node: Node }) => ({
      id: e.node.id,
      topic: e.node.topic,
      callbackUrl: e.node.endpoint?.callbackUrl,
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
