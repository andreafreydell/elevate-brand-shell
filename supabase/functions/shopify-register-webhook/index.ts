// One-shot helper: registers Shopify webhook subscriptions for the rental
// lifecycle. Subscribes to:
//   - orders/paid       → shopify-order-paid       (claim serial + reserve)
//   - orders/fulfilled  → shopify-order-lifecycle  (mark shipped)
//   - refunds/create    → shopify-order-lifecycle  (mark returned/inspection)
//
// Idempotent: skips topics that are already pointing at the right callback.
//
// Required runtime secrets:
//   SHOPIFY_CLIENT_ID
//   SHOPIFY_CLIENT_SECRET
//   SHOPIFY_STORE_DOMAIN          e.g. maisonfreydell.myshopify.com
//   SUPABASE_URL                  (auto-provided, used to build callback URLs)

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SHOPIFY_API_VERSION = "2025-07";

type TopicSpec = {
  topic: "ORDERS_PAID" | "ORDERS_FULFILLED" | "REFUNDS_CREATE";
  fnPath: "shopify-order-paid" | "shopify-order-lifecycle";
};

const TOPICS: TopicSpec[] = [
  { topic: "ORDERS_PAID", fnPath: "shopify-order-paid" },
  { topic: "ORDERS_FULFILLED", fnPath: "shopify-order-lifecycle" },
  { topic: "REFUNDS_CREATE", fnPath: "shopify-order-lifecycle" },
];

async function getAdminAccessToken(storeDomain: string): Promise<string> {
  const clientId = Deno.env.get("SHOPIFY_CLIENT_ID");
  const clientSecret = Deno.env.get("SHOPIFY_CLIENT_SECRET");
  if (!clientId || !clientSecret) {
    throw new Error("Missing SHOPIFY_CLIENT_ID or SHOPIFY_CLIENT_SECRET");
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
    throw new Error(`Token exchange failed [${res.status}]: ${await res.text()}`);
  }
  const json = await res.json() as { access_token?: string };
  if (!json.access_token) throw new Error("Token exchange returned no access_token");
  return json.access_token;
}

async function gql(
  storeDomain: string,
  token: string,
  query: string,
  variables: Record<string, unknown> = {},
): Promise<any> {
  const res = await fetch(
    `https://${storeDomain}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
    },
  );
  const body = await res.json();
  if (!res.ok || body.errors) {
    throw new Error(`Shopify GraphQL error: ${JSON.stringify(body)}`);
  }
  return body.data;
}

async function ensureSubscription(
  storeDomain: string,
  token: string,
  spec: TopicSpec,
  callbackUrl: string,
): Promise<{ topic: string; status: string; subscriptionId?: string; userErrors?: any }> {
  const list = await gql(
    storeDomain,
    token,
    `query($topics: [WebhookSubscriptionTopic!]) {
      webhookSubscriptions(first: 50, topics: $topics) {
        edges {
          node {
            id
            topic
            endpoint {
              __typename
              ... on WebhookHttpEndpoint { callbackUrl }
            }
          }
        }
      }
    }`,
    { topics: [spec.topic] },
  );

  const existing = list.webhookSubscriptions.edges.find(
    (e: any) => e.node.endpoint?.callbackUrl === callbackUrl,
  );
  if (existing) {
    return { topic: spec.topic, status: "already_subscribed", subscriptionId: existing.node.id };
  }

  const create = await gql(
    storeDomain,
    token,
    `mutation Create($topic: WebhookSubscriptionTopic!, $sub: WebhookSubscriptionInput!) {
      webhookSubscriptionCreate(topic: $topic, webhookSubscription: $sub) {
        webhookSubscription { id topic endpoint { __typename ... on WebhookHttpEndpoint { callbackUrl } } }
        userErrors { field message }
      }
    }`,
    { topic: spec.topic, sub: { callbackUrl, format: "JSON" } },
  );

  const userErrors = create.webhookSubscriptionCreate.userErrors;
  if (userErrors.length > 0) {
    return { topic: spec.topic, status: "error", userErrors };
  }
  return {
    topic: spec.topic,
    status: "created",
    subscriptionId: create.webhookSubscriptionCreate.webhookSubscription.id,
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const storeDomain = Deno.env.get("SHOPIFY_STORE_DOMAIN");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    if (!storeDomain) throw new Error("SHOPIFY_STORE_DOMAIN not set");
    if (!supabaseUrl) throw new Error("SUPABASE_URL not set");

    const token = await getAdminAccessToken(storeDomain);

    const results = [];
    for (const spec of TOPICS) {
      const callbackUrl = `${supabaseUrl}/functions/v1/${spec.fnPath}`;
      const result = await ensureSubscription(storeDomain, token, spec, callbackUrl);
      results.push({ ...result, callbackUrl });
    }

    return new Response(
      JSON.stringify({ status: "ok", subscriptions: results }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("register-webhook failed", err);
    return new Response(
      JSON.stringify({ status: "error", message: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
