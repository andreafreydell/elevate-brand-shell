export interface ShopifyWebhookLineItem {
  id: number | string;
  product_id?: number | string | null;
  variant_id?: number | string | null;
  sku?: string | null;
  title?: string;
  properties?: Array<{ name?: string; value?: string | number | boolean | null }>;
}

export interface ShopifyOrderPaidWebhook {
  id: number | string;
  name?: string;
  customer?: { id?: number | string | null } | null;
  line_items?: ShopifyWebhookLineItem[];
}

export interface AssignedSerial {
  shopify_order_id: string;
  shopify_line_item_id: string;
  shopify_variant_id: string;
  sku: string;
  unit_id: string;
  serial_number: string;
}

export interface ShopifyWmsFieldConfig {
  field_strategy:
    | "line_item_property"
    | "order_metafield"
    | "order_note_attribute"
    | "fulfillment_note"
    | "order_tag"
    | "wms_rest_api";
  field_namespace: string;
  field_key: string;
}

const textEncoder = new TextEncoder();

function timingSafeEqual(left: Uint8Array, right: Uint8Array) {
  if (left.length !== right.length) return false;

  let result = 0;
  for (let index = 0; index < left.length; index += 1) {
    result |= left[index] ^ right[index];
  }

  return result === 0;
}

export async function verifyShopifyWebhook(req: Request, rawBody: string) {
  const secret = Deno.env.get("SHOPIFY_WEBHOOK_SECRET");
  if (!secret) {
    console.warn("SHOPIFY_WEBHOOK_SECRET not set; skipping HMAC verification.");
    return true;
  }

  const sentHmac = req.headers.get("x-shopify-hmac-sha256");
  if (!sentHmac) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign("HMAC", key, textEncoder.encode(rawBody));
  const expected = btoa(String.fromCharCode(...new Uint8Array(signature)));

  return timingSafeEqual(textEncoder.encode(expected), textEncoder.encode(sentHmac));
}

export function getOrderGid(orderId: string) {
  return orderId.startsWith("gid://") ? orderId : `gid://shopify/Order/${orderId}`;
}

export function isRentalLineItem(lineItem: ShopifyWebhookLineItem) {
  const processAllLines = Deno.env.get("GEA_RENTAL_PROCESS_ALL_LINES") === "true";
  if (processAllLines) return true;

  const rentalPropertyKey = Deno.env.get("GEA_RENTAL_LINE_PROPERTY_KEY") || "_gea_rental";
  return (lineItem.properties || []).some((property) => {
    const value = String(property.value ?? "").toLowerCase();
    return property.name === rentalPropertyKey && ["true", "1", "yes", "rental"].includes(value);
  });
}

export async function writeAssignedSerialsToShopify(
  config: ShopifyWmsFieldConfig,
  order: ShopifyOrderPaidWebhook,
  assignedSerials: AssignedSerial[],
) {
  if (assignedSerials.length === 0) return { skipped: true };

  if (config.field_strategy === "order_metafield") {
    return writeOrderMetafield(config, order, assignedSerials);
  }

  if (config.field_strategy === "order_tag") {
    return addOrderTags(order, assignedSerials);
  }

  console.warn(
    `Field strategy ${config.field_strategy} is configured, but only order_metafield and order_tag writers are implemented in the MVP.`,
  );

  return { skipped: true, reason: `writer_not_implemented:${config.field_strategy}` };
}

async function shopifyGraphql<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const shopDomain = Deno.env.get("SHOPIFY_SHOP_DOMAIN");
  const adminToken = Deno.env.get("SHOPIFY_ADMIN_ACCESS_TOKEN");
  const apiVersion = Deno.env.get("SHOPIFY_ADMIN_API_VERSION") || "2026-01";

  if (!shopDomain || !adminToken) {
    throw new Error("SHOPIFY_SHOP_DOMAIN and SHOPIFY_ADMIN_ACCESS_TOKEN must be configured.");
  }

  const response = await fetch(`https://${shopDomain}/admin/api/${apiVersion}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": adminToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await response.json();

  if (!response.ok || json.errors) {
    console.error("Shopify GraphQL error:", JSON.stringify(json));
    throw new Error("Shopify GraphQL request failed.");
  }

  return json as T;
}

async function writeOrderMetafield(
  config: ShopifyWmsFieldConfig,
  order: ShopifyOrderPaidWebhook,
  assignedSerials: AssignedSerial[],
) {
  const mutation = `
    mutation SetAssignedSerials($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields {
          id
          key
          namespace
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const value = JSON.stringify({
    order_id: String(order.id),
    order_name: order.name || null,
    assigned_serials: assignedSerials,
  });

  const result = await shopifyGraphql<{
    data?: { metafieldsSet?: { userErrors?: Array<{ field?: string[]; message: string }> } };
  }>(mutation, {
    metafields: [
      {
        ownerId: getOrderGid(String(order.id)),
        namespace: config.field_namespace,
        key: config.field_key,
        type: "json",
        value,
      },
    ],
  });

  const userErrors = result.data?.metafieldsSet?.userErrors || [];
  if (userErrors.length > 0) {
    throw new Error(`Failed to write Shopify metafield: ${userErrors.map((error) => error.message).join(", ")}`);
  }

  return { strategy: "order_metafield", count: assignedSerials.length };
}

async function addOrderTags(order: ShopifyOrderPaidWebhook, assignedSerials: AssignedSerial[]) {
  const mutation = `
    mutation TagsAdd($id: ID!, $tags: [String!]!) {
      tagsAdd(id: $id, tags: $tags) {
        node {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const tags = assignedSerials.map((assignment) => `GEA_SERIAL_${assignment.serial_number}`);
  const result = await shopifyGraphql<{
    data?: { tagsAdd?: { userErrors?: Array<{ field?: string[]; message: string }> } };
  }>(mutation, {
    id: getOrderGid(String(order.id)),
    tags,
  });

  const userErrors = result.data?.tagsAdd?.userErrors || [];
  if (userErrors.length > 0) {
    throw new Error(`Failed to add Shopify tags: ${userErrors.map((error) => error.message).join(", ")}`);
  }

  return { strategy: "order_tag", count: assignedSerials.length };
}
