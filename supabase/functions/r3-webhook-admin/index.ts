import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const CALLBACK_BASE = "https://nwgndnochdbpjijhnbgq.supabase.co/functions/v1";

function getShopDomain() {
  return Deno.env.get("SHOPIFY_SHOP_DOMAIN") || Deno.env.get("SHOPIFY_STORE_DOMAIN");
}

let cachedToken: string | null = null;
let cachedExpiry = 0;

async function getAdminAccessToken(): Promise<string> {
  const staticToken = Deno.env.get("SHOPIFY_ADMIN_ACCESS_TOKEN");
  if (staticToken) return staticToken;

  const clientId = Deno.env.get("SHOPIFY_OAUTH_CLIENT_ID");
  const clientSecret = Deno.env.get("SHOPIFY_OAUTH_CLIENT_SECRET");
  const shopDomain = getShopDomain();

  if (clientId && clientSecret && shopDomain) {
    const now = Date.now();
    if (cachedToken && now < cachedExpiry - 60_000) return cachedToken;
    const res = await fetch(`https://${shopDomain}/admin/oauth/access_token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok || !j.access_token) {
      throw new Error("token_mint_failed: " + JSON.stringify(j));
    }
    cachedToken = j.access_token as string;
    cachedExpiry = now + Number(j.expires_in ?? 86400) * 1000;
    return cachedToken;
  }
  const fallback = Deno.env.get("SHOPIFY_ACCESS_TOKEN");
  if (fallback) return fallback;
  throw new Error("no_admin_credentials");
}

async function gql<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const shopDomain = getShopDomain();
  const apiVersion = Deno.env.get("SHOPIFY_ADMIN_API_VERSION") || "2026-01";
  const token = await getAdminAccessToken();
  const res = await fetch(`https://${shopDomain}/admin/api/${apiVersion}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": token },
    body: JSON.stringify({ query, variables }),
  });
  const j = await res.json();
  return j as T;
}

const LIST_QUERY = `
  query {
    webhookSubscriptions(first: 100) {
      edges {
        node {
          id
          topic
          endpoint { __typename ... on WebhookHttpEndpoint { callbackUrl } }
        }
      }
    }
  }
`;

const CREATE_MUTATION = `
  mutation Create($topic: WebhookSubscriptionTopic!, $url: URL!) {
    webhookSubscriptionCreate(
      topic: $topic,
      webhookSubscription: { callbackUrl: $url, format: JSON }
    ) {
      webhookSubscription { id topic endpoint { __typename ... on WebhookHttpEndpoint { callbackUrl } } }
      userErrors { field message }
    }
  }
`;

interface ListResp {
  data?: {
    webhookSubscriptions?: {
      edges: Array<{ node: { id: string; topic: string; endpoint: { callbackUrl?: string } } }>;
    };
  };
  errors?: unknown;
}

async function getAccessScopes(): Promise<string[]> {
  const shopDomain = getShopDomain();
  const apiVersion = Deno.env.get("SHOPIFY_ADMIN_API_VERSION") || "2026-01";
  const token = await getAdminAccessToken();
  const res = await fetch(`https://${shopDomain}/admin/api/${apiVersion}/oauth/access_scopes.json`, {
    headers: { "X-Shopify-Access-Token": token },
  });
  const j = await res.json().catch(() => ({}));
  return (j.access_scopes || []).map((s: { handle: string }) => s.handle);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const secret = req.headers.get("x-admin-secret");
  if (!secret || secret !== Deno.env.get("R3_WEBHOOK_TMP")) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Force a fresh client_credentials mint (bypass any warm cache).
  cachedToken = null;
  cachedExpiry = 0;

  let grantedScopes: string[] = [];
  try {
    grantedScopes = await getAccessScopes();
  } catch (e) {
    grantedScopes = [`error: ${e instanceof Error ? e.message : String(e)}`];
  }
  const hasFulfillmentScopes =
    grantedScopes.includes("read_fulfillments") &&
    grantedScopes.includes("read_merchant_managed_fulfillment_orders");

  const desired: Array<{ topic: string; fn: string }> = [
    { topic: "FULFILLMENTS_CREATE", fn: "shopify-fulfillment-event" },
    { topic: "FULFILLMENTS_UPDATE", fn: "shopify-fulfillment-event" },
    { topic: "RETURNS_CLOSE", fn: "shopify-return-event" },
  ];

  const results: Record<string, unknown> = {};

  // Snapshot existing
  let listBefore = await gql<ListResp>(LIST_QUERY);
  const existing = new Set(
    (listBefore.data?.webhookSubscriptions?.edges || []).map(
      (e) => `${e.node.topic}|${e.node.endpoint?.callbackUrl}`,
    ),
  );

  for (const d of desired) {
    const url = `${CALLBACK_BASE}/${d.fn}`;
    const key = `${d.topic}|${url}`;
    if (existing.has(key)) {
      results[d.topic] = { status: "already_exists", url };
      continue;
    }
    const created = await gql<{
      data?: { webhookSubscriptionCreate?: { webhookSubscription?: unknown; userErrors: Array<{ message: string }> } };
      errors?: unknown;
    }>(CREATE_MUTATION, { topic: d.topic, url });
    const errs = created.data?.webhookSubscriptionCreate?.userErrors || [];
    if (created.errors) {
      results[d.topic] = { status: "graphql_error", detail: created.errors };
    } else if (errs.length) {
      results[d.topic] = { status: "user_error", detail: errs };
    } else {
      results[d.topic] = { status: "created", url };
    }
  }

  const listAfter = await gql<ListResp>(LIST_QUERY);
  const allWebhooks = (listAfter.data?.webhookSubscriptions?.edges || []).map((e) => ({
    topic: e.node.topic,
    address: e.node.endpoint?.callbackUrl,
  }));

  return new Response(JSON.stringify({ grantedScopes, hasFulfillmentScopes, results, allWebhooks }, null, 2), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
