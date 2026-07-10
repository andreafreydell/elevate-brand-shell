import { corsHeaders, jsonResponse } from "../_shared/cors.ts";

const GUARD = "r4-gea-pilot-9f3k2m7q1x8v-temp";
const SHOP_DOMAIN = Deno.env.get("SHOPIFY_STORE_DOMAIN") || Deno.env.get("SHOPIFY_SHOP_DOMAIN") || "1iggem-wc.myshopify.com";
const ADMIN_TOKEN = Deno.env.get("SHOPIFY_ACCESS_TOKEN")!;
const API_VERSION = "2025-07";
const GRAPHQL_URL = `https://${SHOP_DOMAIN}/admin/api/${API_VERSION}/graphql.json`;

const RENTAL_COLLECTION_GID = "gid://shopify/Collection/320845938788";

async function gql(query: string, variables: Record<string, unknown> = {}) {
  const res = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": ADMIN_TOKEN,
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

  const guard = Deno.env.get("R4_DISCOUNT_TMP");
  if (!guard || req.headers.get("x-r4-secret") !== guard) {
    return jsonResponse({ error: "unauthorized" }, 401);
  }

  const url = new URL(req.url);
  const action = url.searchParams.get("action") || "create";

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
