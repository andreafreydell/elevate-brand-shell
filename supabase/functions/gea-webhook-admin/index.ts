import { corsHeaders, jsonResponse } from "../_shared/cors.ts";

// TEMPORARY admin utility: list + ensure Shopify webhook subscriptions exist.
// Secret-guarded (x-register-key must equal REGISTER_WEBHOOKS_KEY). Deleted
// after use.

const FUNCTIONS_BASE = "https://nwgndnochdbpjijhnbgq.supabase.co/functions/v1";

const DESIRED: Array<{ topic: string; callbackUrl: string }> = [
  { topic: "FULFILLMENTS_CREATE", callbackUrl: `${FUNCTIONS_BASE}/shopify-fulfillment-event` },
  { topic: "FULFILLMENTS_UPDATE", callbackUrl: `${FUNCTIONS_BASE}/shopify-fulfillment-event` },
  { topic: "RETURNS_CLOSE", callbackUrl: `${FUNCTIONS_BASE}/shopify-return-event` },
];

function getShopDomain() {
  return Deno.env.get("SHOPIFY_SHOP_DOMAIN") || Deno.env.get("SHOPIFY_STORE_DOMAIN");
}

async function getAdminAccessToken(): Promise<string> {
  const staticToken = Deno.env.get("SHOPIFY_ADMIN_ACCESS_TOKEN");
  if (staticToken) return staticToken;

  const clientId = Deno.env.get("SHOPIFY_OAUTH_CLIENT_ID");
  const clientSecret = Deno.env.get("SHOPIFY_OAUTH_CLIENT_SECRET");
  const shopDomain = getShopDomain();
  if (clientId && clientSecret && shopDomain) {
    const resp = await fetch(`https://${shopDomain}/admin/oauth/access_token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });
    const json = await resp.json().catch(() => ({}));
    if (resp.ok && json.access_token) return json.access_token as string;
    console.error("client_credentials token error:", JSON.stringify(json));
  }

  const fallback = Deno.env.get("SHOPIFY_ACCESS_TOKEN");
  if (fallback) return fallback;
  throw new Error("No Shopify admin credentials available.");
}

async function gql<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const shopDomain = getShopDomain();
  const apiVersion = Deno.env.get("SHOPIFY_ADMIN_API_VERSION") || "2026-01";
  const token = await getAdminAccessToken();
  const resp = await fetch(`https://${shopDomain}/admin/api/${apiVersion}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": token },
    body: JSON.stringify({ query, variables }),
  });
  const json = await resp.json();
  if (!resp.ok || json.errors) {
    throw new Error(`Shopify GraphQL failed: ${JSON.stringify(json.errors || json)}`);
  }
  return json as T;
}

async function listWebhooks() {
  const q = `query {
    webhookSubscriptions(first: 100) {
      edges { node { id topic endpoint { __typename ... on WebhookHttpEndpoint { callbackUrl } } } }
    }
  }`;
  const res = await gql<{
    data: { webhookSubscriptions: { edges: Array<{ node: { id: string; topic: string; endpoint: { callbackUrl?: string } } }> } };
  }>(q);
  return res.data.webhookSubscriptions.edges.map((e) => ({
    id: e.node.id,
    topic: e.node.topic,
    address: e.node.endpoint?.callbackUrl ?? null,
  }));
}

async function createWebhook(topic: string, callbackUrl: string) {
  const m = `mutation ($topic: WebhookSubscriptionTopic!, $sub: WebhookSubscriptionInput!) {
    webhookSubscriptionCreate(topic: $topic, webhookSubscription: $sub) {
      webhookSubscription { id }
      userErrors { field message }
    }
  }`;
  const res = await gql<{
    data: { webhookSubscriptionCreate: { webhookSubscription: { id: string } | null; userErrors: Array<{ message: string }> } };
  }>(m, { topic, sub: { callbackUrl, format: "JSON" } });
  return res.data.webhookSubscriptionCreate;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const key = req.headers.get("x-register-key");
  if (!key || key !== Deno.env.get("GEA_WEBHOOK_REG_TMP")) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  const url = new URL(req.url);

  // Cron scheduling branch: passes GEA_CRON_SECRET (env) into the DB helper so
  // the daily gea-open-cycle POST authenticates without exposing the secret.
  if (url.searchParams.get("action") === "schedule-cron") {
    const cronSecret = Deno.env.get("GEA_CRON_SECRET");
    if (!cronSecret) return jsonResponse({ error: "GEA_CRON_SECRET missing" }, 500);
    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data, error } = await admin.rpc("gea_schedule_open_cycle", { p_secret: cronSecret });
    if (error) return jsonResponse({ error: error.message }, 500);
    const { data: jobs } = await admin
      .schema("cron")
      .from("job")
      .select("jobid, jobname, schedule, active")
      .eq("jobname", "gea-open-cycle-daily");
    return jsonResponse({ ok: true, scheduled: data, jobs });
  }

  try {
    const existing = await listWebhooks();
    const created: Array<{ topic: string; address: string; result: unknown }> = [];

    for (const want of DESIRED) {
      const already = existing.some(
        (w) => w.topic === want.topic && w.address === want.callbackUrl,
      );
      if (already) continue;
      const result = await createWebhook(want.topic, want.callbackUrl);
      created.push({ topic: want.topic, address: want.callbackUrl, result });
    }

    const finalList = await listWebhooks();
    return jsonResponse({ ok: true, created, webhooks: finalList });
  } catch (e) {
    return jsonResponse({ error: (e as Error).message }, 500);
  }
});
