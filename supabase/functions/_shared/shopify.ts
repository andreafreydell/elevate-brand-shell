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
  order_number?: number | string;
  email?: string | null;
  customer?: {
    id?: number | string | null;
    email?: string | null;
    first_name?: string | null;
    last_name?: string | null;
  } | null;
  // Raw shipping address from the orders/paid payload (name, address1, city,
  // province, zip, country, phone, ...). Stored verbatim for logistics.
  shipping_address?: Record<string, unknown> | null;
  discount_codes?: Array<{ code?: string | null }> | null;
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

async function hmacMatches(secret: string, rawBody: string, sentHmac: string) {
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

export async function verifyShopifyWebhook(req: Request, rawBody: string) {
  const sentHmac = req.headers.get("x-shopify-hmac-sha256");
  if (!sentHmac) return false;

  // Candidate signing secrets, in priority order. Webhooks created via the
  // Shopify admin UI are signed with SHOPIFY_WEBHOOK_SECRET; webhooks
  // registered through this custom app's Admin API are signed with the app's
  // client secret, so we also accept that as a fallback.
  const candidates = [
    Deno.env.get("SHOPIFY_WEBHOOK_SECRET"),
    Deno.env.get("SHOPIFY_OAUTH_CLIENT_SECRET"),
    Deno.env.get("SHOPIFY_CLIENT_SECRET"),
  ].filter((value): value is string => Boolean(value));

  if (candidates.length === 0) {
    console.warn("No Shopify signing secret set; skipping HMAC verification.");
    return true;
  }

  for (const secret of candidates) {
    if (await hmacMatches(secret, rawBody, sentHmac)) return true;
  }

  return false;
}


export function getOrderGid(orderId: string) {
  return orderId.startsWith("gid://") ? orderId : `gid://shopify/Order/${orderId}`;
}

// Variants that must NEVER grab a rental serial, even if they somehow appear in
// inventory_units or carry a rental property:
//  - the three membership subscription variants (Seed / Blossom / Garden)
//  - the $6 "Extra Rental Item" fee line (not a physical unit)
//  - the two gift-with-purchase items
export const NON_RENTAL_VARIANT_IDS = new Set<string>([
  "48545833943140", // Seed membership
  "48630640345188", // Blossom membership
  "48545842724964", // Garden membership
  "48643543760996", // $6 Extra Rental Item (fee)
  "48466377703524", // gift item
  "48466377736292", // gift item
]);

export function isExcludedFromRental(lineItem: ShopifyWebhookLineItem) {
  const vid = lineItem.variant_id != null ? String(lineItem.variant_id) : null;
  return vid != null && NON_RENTAL_VARIANT_IDS.has(vid);
}

// LIVE RULE: a line is a rental line when its variant exists in inventory_units
// AND it is not one of the explicitly excluded variants above. The storefront
// cart does not set any line-item properties, so this DB-backed check is the
// authoritative signal. `rentalVariantIds` is the set of variant ids found in
// inventory_units for this order (resolved once, in the webhook handler).
export function isRentalLineItem(
  lineItem: ShopifyWebhookLineItem,
  rentalVariantIds: Set<string>,
) {
  if (isExcludedFromRental(lineItem)) return false;
  const vid = lineItem.variant_id != null ? String(lineItem.variant_id) : null;
  return vid != null && rentalVariantIds.has(vid);
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

function getShopDomain() {
  return Deno.env.get("SHOPIFY_SHOP_DOMAIN") || Deno.env.get("SHOPIFY_STORE_DOMAIN");
}

// In-memory cache for client_credentials tokens (valid ~24h, scoped per warm instance).
let cachedAdminToken: string | null = null;
let cachedAdminTokenExpiry = 0;

// Resolve an Admin API access token. Priority:
// 1. A static SHOPIFY_ADMIN_ACCESS_TOKEN, if set (manual override).
// 2. Mint a fresh token via the OAuth client_credentials grant using
//    SHOPIFY_OAUTH_CLIENT_ID + SHOPIFY_OAUTH_CLIENT_SECRET (auto-refreshes every 24h).
// 3. Fall back to the connector-managed SHOPIFY_ACCESS_TOKEN.
async function getAdminAccessToken(): Promise<string> {
  const staticToken = Deno.env.get("SHOPIFY_ADMIN_ACCESS_TOKEN");
  if (staticToken) return staticToken;

  const clientId = Deno.env.get("SHOPIFY_OAUTH_CLIENT_ID");
  const clientSecret = Deno.env.get("SHOPIFY_OAUTH_CLIENT_SECRET");
  const shopDomain = getShopDomain();

  if (clientId && clientSecret && shopDomain) {
    const now = Date.now();
    if (cachedAdminToken && now < cachedAdminTokenExpiry - 60_000) {
      return cachedAdminToken;
    }

    const tokenResponse = await fetch(`https://${shopDomain}/admin/oauth/access_token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    const tokenJson = await tokenResponse.json().catch(() => ({}));
    if (!tokenResponse.ok || !tokenJson.access_token) {
      console.error("Shopify client_credentials token error:", JSON.stringify(tokenJson));
      throw new Error("Failed to mint Shopify Admin token via client_credentials grant.");
    }

    cachedAdminToken = tokenJson.access_token as string;
    const expiresInSeconds = Number(tokenJson.expires_in ?? 86400);
    cachedAdminTokenExpiry = now + expiresInSeconds * 1000;
    return cachedAdminToken;
  }

  const fallback = Deno.env.get("SHOPIFY_ACCESS_TOKEN");
  if (fallback) return fallback;

  throw new Error(
    "Shopify admin credentials missing: set SHOPIFY_OAUTH_CLIENT_ID + SHOPIFY_OAUTH_CLIENT_SECRET (preferred), or SHOPIFY_ADMIN_ACCESS_TOKEN / SHOPIFY_ACCESS_TOKEN.",
  );
}

async function shopifyGraphql<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const shopDomain = getShopDomain();
  const apiVersion = Deno.env.get("SHOPIFY_ADMIN_API_VERSION") || "2026-01";

  if (!shopDomain) {
    throw new Error("Shopify domain must be configured (SHOPIFY_SHOP_DOMAIN or SHOPIFY_STORE_DOMAIN).");
  }

  const adminToken = await getAdminAccessToken();

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

// Find a Shopify customer by email, creating one when none exists. Used by
// pilot enrollment so no-card members still get a taggable customer record
// (the 100%-off discount is customer-segment based).
export async function findOrCreateCustomerByEmail(
  email: string,
  firstName?: string | null,
  lastName?: string | null,
): Promise<{ id: string | null; created: boolean; error: string | null }> {
  try {
    const searchResult = await shopifyGraphql<{
      data?: { customers?: { nodes?: Array<{ id: string }> } };
    }>(
      `query FindCustomer($q: String!) { customers(first: 1, query: $q) { nodes { id } } }`,
      { q: `email:${email}` },
    );
    const existing = searchResult.data?.customers?.nodes?.[0]?.id;
    if (existing) {
      return { id: existing.split("/").pop() ?? null, created: false, error: null };
    }

    const createResult = await shopifyGraphql<{
      data?: {
        customerCreate?: {
          customer?: { id: string } | null;
          userErrors?: Array<{ message: string }>;
        };
      };
    }>(
      `mutation CreateCustomer($input: CustomerInput!) {
        customerCreate(input: $input) { customer { id } userErrors { field message } }
      }`,
      {
        input: {
          email,
          ...(firstName ? { firstName } : {}),
          ...(lastName ? { lastName } : {}),
        },
      },
    );
    const userErrors = createResult.data?.customerCreate?.userErrors || [];
    const createdId = createResult.data?.customerCreate?.customer?.id;
    if (!createdId) {
      return { id: null, created: false, error: userErrors.map((e) => e.message).join(", ") || "customerCreate failed" };
    }
    return { id: createdId.split("/").pop() ?? null, created: true, error: null };
  } catch (err) {
    return { id: null, created: false, error: err instanceof Error ? err.message : String(err) };
  }
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

// ---------------------------------------------------------------------------
// Shopify Returns: the warehouse works out of the Shopify admin, so a member's
// return declaration must exist there as a real Return object. A Return can
// only be created against FULFILLED line items (the warehouse marks orders
// fulfilled when it ships), so unfulfilled lines are reported back as skipped
// rather than failing the whole declaration.

export function getReturnGid(returnId: string) {
  return returnId.startsWith("gid://") ? returnId : `gid://shopify/Return/${returnId}`;
}

export async function createShopifyReturn(
  orderId: string,
  lineItemIds: string[],
): Promise<{ returnId: string | null; skippedLineItemIds: string[]; error: string | null }> {
  try {
    const wanted = new Set(lineItemIds.map(String));
    const query = `
      query ReturnableFulfillments($orderId: ID!) {
        returnableFulfillments(orderId: $orderId, first: 10) {
          nodes {
            returnableFulfillmentLineItems(first: 50) {
              nodes {
                quantity
                fulfillmentLineItem { id lineItem { id } }
              }
            }
          }
        }
      }
    `;
    const result = await shopifyGraphql<{
      data?: {
        returnableFulfillments?: {
          nodes?: Array<{
            returnableFulfillmentLineItems?: {
              nodes?: Array<{
                quantity: number;
                fulfillmentLineItem?: {
                  id: string;
                  lineItem?: { id?: string | null } | null;
                } | null;
              }>;
            };
          }>;
        } | null;
      };
    }>(query, { orderId: getOrderGid(orderId) });

    const returnLineItems: Array<{ fulfillmentLineItemId: string; quantity: number; returnReason: string }> = [];
    const matched = new Set<string>();
    for (const node of result.data?.returnableFulfillments?.nodes || []) {
      for (const line of node.returnableFulfillmentLineItems?.nodes || []) {
        const gid = line.fulfillmentLineItem?.lineItem?.id || "";
        const legacyId = gid.split("/").pop() || null;
        if (!legacyId || !line.fulfillmentLineItem?.id) continue;
        if (!wanted.has(String(legacyId)) || matched.has(String(legacyId))) continue;
        matched.add(String(legacyId));
        returnLineItems.push({
          fulfillmentLineItemId: line.fulfillmentLineItem.id,
          quantity: Math.max(1, line.quantity),
          returnReason: "OTHER",
          returnReasonNote: "Member portal return",
        });
      }
    }

    const skippedLineItemIds = [...wanted].filter((id) => !matched.has(id));
    if (returnLineItems.length === 0) {
      return {
        returnId: null,
        skippedLineItemIds,
        error: "No returnable (fulfilled) line items on this order yet",
      };
    }

    const mutation = `
      mutation ReturnCreate($returnInput: ReturnInput!) {
        returnCreate(returnInput: $returnInput) {
          return { id }
          userErrors { field message }
        }
      }
    `;
    const createResult = await shopifyGraphql<{
      data?: {
        returnCreate?: {
          return?: { id: string } | null;
          userErrors?: Array<{ message: string }>;
        };
      };
    }>(mutation, {
      returnInput: { orderId: getOrderGid(orderId), returnLineItems },
    });

    const userErrors = createResult.data?.returnCreate?.userErrors || [];
    const returnId = createResult.data?.returnCreate?.return?.id ?? null;
    if (userErrors.length > 0 || !returnId) {
      return {
        returnId: null,
        skippedLineItemIds,
        error: userErrors.map((e) => e.message).join(", ") || "returnCreate failed",
      };
    }
    return { returnId, skippedLineItemIds, error: null };
  } catch (err) {
    return {
      returnId: null,
      skippedLineItemIds: lineItemIds,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

// Resolve which order line items a Shopify Return covers (used by the
// returns/close webhook to auto-reconcile: received line items -> serials).
export async function getReturnLineItems(
  returnId: string,
): Promise<{ orderId: string | null; lineItemIds: string[]; error: string | null }> {
  try {
    const query = `
      query ReturnLineItems($id: ID!) {
        return(id: $id) {
          order { legacyResourceId }
          returnLineItems(first: 50) {
            nodes {
              ... on ReturnLineItem {
                quantity
                fulfillmentLineItem { lineItem { legacyResourceId } }
              }
            }
          }
        }
      }
    `;
    const result = await shopifyGraphql<{
      data?: {
        return?: {
          order?: { legacyResourceId?: string | null } | null;
          returnLineItems?: {
            nodes?: Array<{
              quantity?: number;
              fulfillmentLineItem?: { lineItem?: { legacyResourceId?: string | null } | null } | null;
            }>;
          };
        } | null;
      };
    }>(query, { id: getReturnGid(returnId) });

    const ret = result.data?.return;
    if (!ret) return { orderId: null, lineItemIds: [], error: "Return not found" };
    const lineItemIds = (ret.returnLineItems?.nodes || [])
      .map((n) => n.fulfillmentLineItem?.lineItem?.legacyResourceId)
      .filter((id): id is string => Boolean(id))
      .map(String);
    return {
      orderId: ret.order?.legacyResourceId ? String(ret.order.legacyResourceId) : null,
      lineItemIds,
      error: null,
    };
  } catch (err) {
    return { orderId: null, lineItemIds: [], error: err instanceof Error ? err.message : String(err) };
  }
}

// ---------------------------------------------------------------------------
// Membership auto-fulfillment: memberships are a service, nothing ships, so
// their order lines are marked fulfilled immediately (keeps the orders list
// clean for ops). Only the given variant ids are fulfilled — rental/gift lines
// are untouched. Requires the app to carry the merchant-managed fulfillment
// order scopes; failures are returned, never thrown.
export async function fulfillMembershipLines(
  orderId: string,
  membershipVariantIds: Set<string>,
): Promise<{ fulfilled: boolean; error: string | null }> {
  try {
    const query = `
      query FulfillmentOrders($id: ID!) {
        order(id: $id) {
          fulfillmentOrders(first: 10) {
            nodes {
              id
              status
              lineItems(first: 50) {
                nodes {
                  id
                  remainingQuantity
                  lineItem { variant { legacyResourceId } }
                }
              }
            }
          }
        }
      }
    `;
    const result = await shopifyGraphql<{
      data?: {
        order?: {
          fulfillmentOrders?: {
            nodes?: Array<{
              id: string;
              status: string;
              lineItems?: {
                nodes?: Array<{
                  id: string;
                  remainingQuantity: number;
                  lineItem?: { variant?: { legacyResourceId?: string | null } | null } | null;
                }>;
              };
            }>;
          } | null;
        } | null;
      };
      errors?: Array<{ message: string }>;
    }>(query, { id: getOrderGid(orderId) });

    if (result.errors?.length) {
      return { fulfilled: false, error: result.errors.map((e) => e.message).join(", ") };
    }

    const byFulfillmentOrder: Array<{
      fulfillmentOrderId: string;
      fulfillmentOrderLineItems: Array<{ id: string; quantity: number }>;
    }> = [];

    for (const fo of result.data?.order?.fulfillmentOrders?.nodes || []) {
      if (fo.status !== "OPEN" && fo.status !== "IN_PROGRESS") continue;
      const lines = (fo.lineItems?.nodes || [])
        .filter(
          (line) =>
            line.remainingQuantity > 0 &&
            line.lineItem?.variant?.legacyResourceId &&
            membershipVariantIds.has(String(line.lineItem.variant.legacyResourceId)),
        )
        .map((line) => ({ id: line.id, quantity: line.remainingQuantity }));
      if (lines.length > 0) {
        byFulfillmentOrder.push({ fulfillmentOrderId: fo.id, fulfillmentOrderLineItems: lines });
      }
    }

    if (byFulfillmentOrder.length === 0) {
      return { fulfilled: false, error: null }; // nothing to fulfill (already done or no membership lines)
    }

    const mutation = `
      mutation FulfillMembership($fulfillment: FulfillmentV2Input!) {
        fulfillmentCreateV2(fulfillment: $fulfillment) {
          fulfillment { id status }
          userErrors { field message }
        }
      }
    `;
    const fulfillResult = await shopifyGraphql<{
      data?: {
        fulfillmentCreateV2?: {
          fulfillment?: { id: string; status: string } | null;
          userErrors?: Array<{ message: string }>;
        };
      };
      errors?: Array<{ message: string }>;
    }>(mutation, {
      fulfillment: {
        lineItemsByFulfillmentOrder: byFulfillmentOrder,
        notifyCustomer: false,
      },
    });

    const userErrors = fulfillResult.data?.fulfillmentCreateV2?.userErrors || [];
    if (fulfillResult.errors?.length || userErrors.length) {
      return {
        fulfilled: false,
        error: [...(fulfillResult.errors || []), ...userErrors].map((e) => e.message).join(", "),
      };
    }

    return { fulfilled: Boolean(fulfillResult.data?.fulfillmentCreateV2?.fulfillment?.id), error: null };
  } catch (err) {
    return { fulfilled: false, error: err instanceof Error ? err.message : String(err) };
  }
}
