import { corsHeaders, jsonResponse } from "../_shared/cors.ts";

const GUARD = "r4-gea-pilot-9f3k2m7q1x8v-temp";
const SHOP_DOMAIN = Deno.env.get("SHOPIFY_SHOP_DOMAIN") || Deno.env.get("SHOPIFY_STORE_DOMAIN") || "1iggem-wc.myshopify.com";
const API_VERSION = Deno.env.get("SHOPIFY_ADMIN_API_VERSION") || "2026-01";
const GRAPHQL_URL = `https://${SHOP_DOMAIN}/admin/api/${API_VERSION}/graphql.json`;

const RENTAL_COLLECTION_GID = "gid://shopify/Collection/320845938788";

async function getAdminToken(): Promise<string> {
  const staticToken = Deno.env.get("SHOPIFY_ADMIN_ACCESS_TOKEN");
  if (staticToken) return staticToken;
  const clientId = Deno.env.get("SHOPIFY_OAUTH_CLIENT_ID");
  const clientSecret = Deno.env.get("SHOPIFY_OAUTH_CLIENT_SECRET");
  if (clientId && clientSecret) {
    const res = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
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
    throw new Error(`client_credentials mint failed: ${JSON.stringify(json)}`);
  }
  const fallback = Deno.env.get("SHOPIFY_ACCESS_TOKEN");
  if (fallback) return fallback;
  throw new Error("No Shopify admin credentials available.");
}

async function gql(query: string, variables: Record<string, unknown> = {}) {
  const adminToken = await getAdminToken();
  const res = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": adminToken,
    },
    body: JSON.stringify({ query, variables }),
  });
  const text = await res.text();
  let json: unknown = null;
  try { json = JSON.parse(text); } catch { /* keep raw */ }
  return { status: res.status, json, raw: text };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const guard = GUARD;
  if (!guard || req.headers.get("x-r4-secret") !== guard) {
    return jsonResponse({ error: "unauthorized" }, 401);
  }

  const url = new URL(req.url);
  const action = url.searchParams.get("action") || "create";

  if (action === "diag") {
    const permanent = "1iggem-wc.myshopify.com";
    const envKeys = Object.keys(Deno.env.toObject()).filter((k) => k.toUpperCase().includes("SHOPIFY"));
    const candidates: Record<string, string | undefined> = {
      SHOPIFY_ACCESS_TOKEN: Deno.env.get("SHOPIFY_ACCESS_TOKEN"),
      ONLINE_LITERAL: Deno.env.get("SHOPIFY_ONLINE_ACCESS_TOKEN:user:djoX1ZLa7yNi4l875ImBCPzeenJ3"),
    };
    // add any env key that looks like an online token
    for (const k of envKeys) {
      if (k.startsWith("SHOPIFY_ONLINE_ACCESS_TOKEN")) candidates[k] = Deno.env.get(k);
    }
    const results: Record<string, unknown> = {};
    for (const [name, tok] of Object.entries(candidates)) {
      if (!tok) { results[name] = "absent"; continue; }
      const r = await fetch(`https://${permanent}/admin/api/${API_VERSION}/price_rules.json?limit=1`, {
        headers: { "X-Shopify-Access-Token": tok },
      });
      results[name] = { present: true, len: tok.length, prefix: tok.slice(0, 6), status: r.status };
    }
    return jsonResponse({
      shopify_env_keys: envKeys,
      SHOPIFY_SHOP_DOMAIN: Deno.env.get("SHOPIFY_SHOP_DOMAIN") || null,
      SHOPIFY_STORE_DOMAIN: Deno.env.get("SHOPIFY_STORE_DOMAIN") || null,
      read_tests: results,
    }, 200);
  }



  // REST route: create a collection-scoped price rule + discount code.
  if (action === "rest-create") {
    const adminToken = await getAdminToken();
    const restBase = `https://${SHOP_DOMAIN}/admin/api/${API_VERSION}`;
    const headers = {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": adminToken,
    };

    const priceRuleBody = {
      price_rule: {
        title: "GEAPILOT",
        target_type: "line_item",
        target_selection: "entitled",
        allocation_method: "each",
        value_type: "percentage",
        value: "-100.0",
        customer_selection: "all",
        entitled_collection_ids: [320845938788],
        once_per_customer: true,
        starts_at: new Date().toISOString(),
        ends_at: null,
      },
    };

    const prRes = await fetch(`${restBase}/price_rules.json`, {
      method: "POST",
      headers,
      body: JSON.stringify(priceRuleBody),
    });
    const prText = await prRes.text();
    let prJson: any = null;
    try { prJson = JSON.parse(prText); } catch { /* raw */ }
    if (!prRes.ok || !prJson?.price_rule?.id) {
      return jsonResponse({ step: "price_rule", status: prRes.status, body: prJson ?? prText }, 200);
    }

    const priceRuleId = prJson.price_rule.id;
    const dcRes = await fetch(`${restBase}/price_rules/${priceRuleId}/discount_codes.json`, {
      method: "POST",
      headers,
      body: JSON.stringify({ discount_code: { code: "GEAPILOT" } }),
    });
    const dcText = await dcRes.text();
    let dcJson: any = null;
    try { dcJson = JSON.parse(dcText); } catch { /* raw */ }

    return jsonResponse({
      step: "done",
      price_rule: prJson.price_rule,
      discount_code: { status: dcRes.status, body: dcJson ?? dcText },
    }, 200);
  }

  if (action === "rest-read") {
    const adminToken = await getAdminToken();
    const restBase = `https://${SHOP_DOMAIN}/admin/api/${API_VERSION}`;
    const id = url.searchParams.get("id");
    const headers = { "X-Shopify-Access-Token": adminToken };
    const prRes = await fetch(`${restBase}/price_rules/${id}.json`, { headers });
    const prJson = await prRes.json().catch(() => null);
    const dcRes = await fetch(`${restBase}/price_rules/${id}/discount_codes.json`, { headers });
    const dcJson = await dcRes.json().catch(() => null);
    return jsonResponse({ price_rule: prJson, discount_codes: dcJson }, 200);
  }



  if (action === "create") {
    const mutation = `
      mutation CreateGeaPilot($basicCodeDiscount: DiscountCodeBasicInput!) {
        discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
          codeDiscountNode {
            id
            codeDiscount {
              ... on DiscountCodeBasic {
                title
                status
                startsAt
                endsAt
                appliesOncePerCustomer
                usageLimit
                combinesWith { orderDiscounts productDiscounts shippingDiscounts }
                codes(first: 5) { nodes { code } }
                customerGets {
                  value {
                    ... on DiscountPercentage { percentage }
                  }
                  items {
                    ... on DiscountCollections {
                      collections(first: 10) { nodes { id title } }
                    }
                  }
                }
                customerSelection {
                  ... on DiscountCustomerAll { allCustomers }
                }
              }
            }
          }
          userErrors { field code message }
        }
      }`;

    const variables = {
      basicCodeDiscount: {
        title: "GEAPILOT",
        code: "GEAPILOT",
        startsAt: new Date().toISOString(),
        endsAt: null,
        appliesOncePerCustomer: true,
        combinesWith: {
          orderDiscounts: false,
          productDiscounts: false,
          shippingDiscounts: false,
        },
        customerSelection: { all: true },
        customerGets: {
          value: { percentage: 1.0 },
          items: {
            collections: { add: [RENTAL_COLLECTION_GID] },
          },
        },
      },
    };

    const result = await gql(mutation, variables);
    return jsonResponse(result);
  }

  if (action === "read") {
    const id = url.searchParams.get("id");
    const query = `
      query ReadDiscount($id: ID!) {
        codeDiscountNode(id: $id) {
          id
          codeDiscount {
            ... on DiscountCodeBasic {
              title
              status
              startsAt
              endsAt
              appliesOncePerCustomer
              usageLimit
              combinesWith { orderDiscounts productDiscounts shippingDiscounts }
              codes(first: 5) { nodes { code } }
              customerGets {
                value { ... on DiscountPercentage { percentage } }
                items {
                  ... on DiscountCollections {
                    collections(first: 10) { nodes { id title } }
                  }
                  ... on AllDiscountItems { allItems }
                }
              }
              customerSelection {
                ... on DiscountCustomerAll { allCustomers }
              }
            }
          }
        }
      }`;
    const result = await gql(query, { id });
    return jsonResponse(result);
  }

  if (action === "find") {
    const query = `
      query {
        codeDiscountNodes(first: 20, query: "GEAPILOT") {
          nodes {
            id
            codeDiscount {
              ... on DiscountCodeBasic {
                title
                codes(first: 5) { nodes { code } }
              }
            }
          }
        }
      }`;
    const result = await gql(query, {});
    return jsonResponse(result);
  }

  return jsonResponse({ error: "unknown action" }, 400);
});
