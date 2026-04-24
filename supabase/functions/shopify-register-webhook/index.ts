// One-shot helper: registers the `orders/paid` webhook subscription on the
// connected Shopify store, pointing to our shopify-order-paid edge function.
//
// Call this function ONCE from the dashboard (no body needed). It:
//   1. Exchanges SHOPIFY_CLIENT_ID + SHOPIFY_CLIENT_SECRET for an Admin API token
//      via the client-credentials grant.
//   2. Lists existing webhook subscriptions to avoid duplicates.
//   3. Creates the orders/paid subscription if missing.
//
// Required runtime secrets:
//   SHOPIFY_CLIENT_ID
//   SHOPIFY_CLIENT_SECRET
//   SHOPIFY_STORE_DOMAIN          e.g. maisonfreydell.myshopify.com
//   SUPABASE_URL                  (auto-provided, used to build the callback URL)

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SHOPIFY_API_VERSION = "2025-07";

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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const storeDomain = Deno.env.get("SHOPIFY_STORE_DOMAIN");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    if (!storeDomain) throw new Error("SHOPIFY_STORE_DOMAIN not set");
    if (!supabaseUrl) throw new Error("SUPABASE_URL not set");

    const callbackUrl = `${supabaseUrl}/functions/v1/shopify-order-paid`;

    const token = await getAdminAccessToken(storeDomain);

    // 1. Check for an existing orders/paid subscription pointing at our URL.
    const list = await gql(
      storeDomain,
      token,
      `query {
        webhookSubscriptions(first: 50, topics: [ORDERS_PAID]) {
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
    );

    const existing = list.webhookSubscriptions.edges.find(
      (e: any) => e.node.endpoint?.callbackUrl === callbackUrl,
    );

    if (existing) {
      return new Response(
        JSON.stringify({
          status: "already_subscribed",
          subscriptionId: existing.node.id,
          callbackUrl,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // 2. Create the subscription.
    const create = await gql(
      storeDomain,
      token,
      `mutation Create($topic: WebhookSubscriptionTopic!, $sub: WebhookSubscriptionInput!) {
        webhookSubscriptionCreate(topic: $topic, webhookSubscription: $sub) {
          webhookSubscription { id topic endpoint { __typename ... on WebhookHttpEndpoint { callbackUrl } } }
          userErrors { field message }
        }
      }`,
      {
        topic: "ORDERS_PAID",
        sub: {
          callbackUrl,
          format: "JSON",
        },
      },
    );

    const userErrors = create.webhookSubscriptionCreate.userErrors;
    if (userErrors.length > 0) {
      return new Response(
        JSON.stringify({ status: "error", userErrors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({
        status: "created",
        subscription: create.webhookSubscriptionCreate.webhookSubscription,
      }),
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
