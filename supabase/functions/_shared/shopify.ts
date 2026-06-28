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
  // Accept both our env names and the names already present in the live backend.
  const shopDomain = Deno.env.get("SHOPIFY_SHOP_DOMAIN") || Deno.env.get("SHOPIFY_STORE_DOMAIN");
  const adminToken = Deno.env.get("SHOPIFY_ADMIN_ACCESS_TOKEN") || Deno.env.get("SHOPIFY_ACCESS_TOKEN");
  const apiVersion = Deno.env.get("SHOPIFY_ADMIN_API_VERSION") || "2026-01";

  if (!shopDomain || !adminToken) {
    throw new Error("Shopify domain/token must be configured (SHOPIFY_STORE_DOMAIN/SHOPIFY_SHOP_DOMAIN + SHOPIFY_ACCESS_TOKEN/SHOPIFY_ADMIN_ACCESS_TOKEN).");
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

// ============================================================================
// Customer tagging — drives the `gea_cycle_open` segment that the automatic
// "100% off Rental collection" discount is restricted to.
// ============================================================================

export function getCustomerGid(customerId: string) {
  return customerId.startsWith("gid://") ? customerId : `gid://shopify/Customer/${customerId}`;
}

export async function getCustomerEmail(customerId: string): Promise<string | null> {
  const query = `
    query CustomerEmail($id: ID!) {
      customer(id: $id) { id email }
    }
  `;
  const result = await shopifyGraphql<{
    data?: { customer?: { id: string; email: string | null } | null };
  }>(query, { id: getCustomerGid(customerId) });
  return result.data?.customer?.email ?? null;
}

export async function addCustomerTags(customerId: string, tags: string[]) {
  const mutation = `
    mutation AddCustomerTags($id: ID!, $tags: [String!]!) {
      tagsAdd(id: $id, tags: $tags) {
        node { id }
        userErrors { field message }
      }
    }
  `;
  const result = await shopifyGraphql<{
    data?: { tagsAdd?: { userErrors?: Array<{ message: string }> } };
  }>(mutation, { id: getCustomerGid(customerId), tags });

  const userErrors = result.data?.tagsAdd?.userErrors || [];
  if (userErrors.length > 0) {
    throw new Error(`Failed to add customer tags: ${userErrors.map((e) => e.message).join(", ")}`);
  }
  return { ok: true, tags };
}

export async function removeCustomerTags(customerId: string, tags: string[]) {
  const mutation = `
    mutation RemoveCustomerTags($id: ID!, $tags: [String!]!) {
      tagsRemove(id: $id, tags: $tags) {
        node { id }
        userErrors { field message }
      }
    }
  `;
  const result = await shopifyGraphql<{
    data?: { tagsRemove?: { userErrors?: Array<{ message: string }> } };
  }>(mutation, { id: getCustomerGid(customerId), tags });

  const userErrors = result.data?.tagsRemove?.userErrors || [];
  if (userErrors.length > 0) {
    throw new Error(`Failed to remove customer tags: ${userErrors.map((e) => e.message).join(", ")}`);
  }
  return { ok: true, tags };
}

// ============================================================================
// Variant lookup — retail price (basis for the 40% keep fee), on-hand inventory
// (basis for catalog seeding), sku/product linkage.
// ============================================================================

export interface ShopifyVariantDetails {
  variantId: string;
  productId: string | null;
  sku: string | null;
  price: string | null;
  inventoryQuantity: number | null;
}

export function getVariantGid(variantId: string) {
  return variantId.startsWith("gid://") ? variantId : `gid://shopify/ProductVariant/${variantId}`;
}

export async function getVariantDetails(variantId: string): Promise<ShopifyVariantDetails | null> {
  const query = `
    query VariantDetails($id: ID!) {
      productVariant(id: $id) {
        id
        sku
        price
        inventoryQuantity
        product { id }
      }
    }
  `;
  const result = await shopifyGraphql<{
    data?: {
      productVariant?: {
        id: string;
        sku: string | null;
        price: string | null;
        inventoryQuantity: number | null;
        product?: { id: string } | null;
      } | null;
    };
  }>(query, { id: getVariantGid(variantId) });

  const v = result.data?.productVariant;
  if (!v) return null;
  return {
    variantId: v.id,
    productId: v.product?.id ?? null,
    sku: v.sku ?? null,
    price: v.price ?? null,
    inventoryQuantity: v.inventoryQuantity ?? null,
  };
}

// ============================================================================
// Subscription contract lookup — tier detection (mirrored into memberships).
// ============================================================================

export interface ShopifySubscriptionContract {
  id: string;
  status: string;
  customerId: string | null;
  createdAt: string | null;
  lines: Array<{ variantId: string | null; sellingPlanId: string | null; sellingPlanName: string | null }>;
}

export function getSubscriptionContractGid(contractId: string) {
  return contractId.startsWith("gid://")
    ? contractId
    : `gid://shopify/SubscriptionContract/${contractId}`;
}

export async function getSubscriptionContract(
  contractId: string,
): Promise<ShopifySubscriptionContract | null> {
  const query = `
    query SubscriptionContract($id: ID!) {
      subscriptionContract(id: $id) {
        id
        status
        createdAt
        customer { id }
        lines(first: 50) {
          edges {
            node {
              variantId
              sellingPlanId
              sellingPlanName
            }
          }
        }
      }
    }
  `;
  const result = await shopifyGraphql<{
    data?: {
      subscriptionContract?: {
        id: string;
        status: string;
        createdAt: string | null;
        customer?: { id: string } | null;
        lines?: { edges: Array<{ node: { variantId: string | null; sellingPlanId: string | null; sellingPlanName: string | null } }> };
      } | null;
    };
  }>(query, { id: getSubscriptionContractGid(contractId) });

  const c = result.data?.subscriptionContract;
  if (!c) return null;
  return {
    id: c.id,
    status: c.status,
    customerId: c.customer?.id ?? null,
    createdAt: c.createdAt ?? null,
    lines: (c.lines?.edges || []).map((e) => ({
      variantId: e.node.variantId ?? null,
      sellingPlanId: e.node.sellingPlanId ?? null,
      sellingPlanName: e.node.sellingPlanName ?? null,
    })),
  };
}

// ============================================================================
// Extra-keep fee charging.
//
// IMPORTANT — payment capture caveat: truly auto-capturing a customer's stored
// card for an arbitrary one-off amount requires a payment provider that supports
// it for the store. This helper creates a draft order for the fee against the
// customer and attempts to complete it as paid (paymentPending: false). Whether
// that actually captures the saved card depends on the store's payment setup; if
// it cannot, completion fails and the caller records the charge as `failed` with
// the draft order id retained so the team can collect it. This is the one path
// to validate against live Shopify before go-live (see the plan's pre-prod step).
// ============================================================================

export interface KeepFeeChargeResult {
  draftOrderId: string | null;
  invoiceUrl: string | null;
  completedOrderId: string | null;
  captured: boolean;
  error: string | null;
}

export async function chargeKeepFeeToCustomer(params: {
  customerId: string;
  title: string;
  amount: number;
  quantity?: number;
  tags?: string[];
}): Promise<KeepFeeChargeResult> {
  const createMutation = `
    mutation CreateKeepFeeDraft($input: DraftOrderInput!) {
      draftOrderCreate(input: $input) {
        draftOrder { id invoiceUrl }
        userErrors { field message }
      }
    }
  `;
  const createResult = await shopifyGraphql<{
    data?: {
      draftOrderCreate?: {
        draftOrder?: { id: string; invoiceUrl: string | null } | null;
        userErrors?: Array<{ message: string }>;
      };
    };
  }>(createMutation, {
    input: {
      customerId: getCustomerGid(params.customerId),
      tags: params.tags ?? ["gea_keep_fee"],
      lineItems: [
        {
          title: params.title,
          originalUnitPrice: params.amount.toFixed(2),
          quantity: params.quantity ?? 1,
          requiresShipping: false,
          taxable: false,
        },
      ],
    },
  });

  const createErrors = createResult.data?.draftOrderCreate?.userErrors || [];
  const draftOrder = createResult.data?.draftOrderCreate?.draftOrder;
  if (createErrors.length > 0 || !draftOrder) {
    return {
      draftOrderId: null,
      invoiceUrl: null,
      completedOrderId: null,
      captured: false,
      error: createErrors.map((e) => e.message).join(", ") || "draftOrderCreate failed",
    };
  }

  // Attempt to complete (capture) against the customer's payment method.
  const completeMutation = `
    mutation CompleteKeepFeeDraft($id: ID!) {
      draftOrderComplete(id: $id, paymentPending: false) {
        draftOrder { id order { id } }
        userErrors { field message }
      }
    }
  `;
  try {
    const completeResult = await shopifyGraphql<{
      data?: {
        draftOrderComplete?: {
          draftOrder?: { id: string; order?: { id: string } | null } | null;
          userErrors?: Array<{ message: string }>;
        };
      };
    }>(completeMutation, { id: draftOrder.id });

    const completeErrors = completeResult.data?.draftOrderComplete?.userErrors || [];
    const completedOrderId = completeResult.data?.draftOrderComplete?.draftOrder?.order?.id ?? null;

    if (completeErrors.length > 0 || !completedOrderId) {
      return {
        draftOrderId: draftOrder.id,
        invoiceUrl: draftOrder.invoiceUrl,
        completedOrderId: null,
        captured: false,
        error: completeErrors.map((e) => e.message).join(", ") || "draftOrderComplete did not capture payment",
      };
    }

    return {
      draftOrderId: draftOrder.id,
      invoiceUrl: draftOrder.invoiceUrl,
      completedOrderId,
      captured: true,
      error: null,
    };
  } catch (err) {
    return {
      draftOrderId: draftOrder.id,
      invoiceUrl: draftOrder.invoiceUrl,
      completedOrderId: null,
      captured: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
