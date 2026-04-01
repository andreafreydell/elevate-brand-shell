import { toast } from "sonner";

const SHOPIFY_API_VERSION = '2025-07';
const SHOPIFY_STORE_PERMANENT_DOMAIN = '1iggem-wc.myshopify.com';
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
const SHOPIFY_STOREFRONT_TOKEN = 'ebe6a5e238f974f053cdf25df7daeebf';

export interface ShopifyLineAttribute {
  key: string;
  value: string;
}

export interface ShopifyCartLineInput {
  variantId: string;
  quantity: number;
  attributes?: ShopifyLineAttribute[];
  sellingPlanId?: string | null;
}

export interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    handle: string;
    productType?: string;
    tags?: string[];
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    images: {
      edges: Array<{
        node: {
          url: string;
          altText: string | null;
        };
      }>;
    };
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          price: {
            amount: string;
            currencyCode: string;
          };
          availableForSale: boolean;
          selectedOptions: Array<{
            name: string;
            value: string;
          }>;
        };
      }>;
    };
    options: Array<{
      name: string;
      values: string[];
    }>;
    metafields?: Array<{
      key: string;
      value: string | null;
    } | null>;
  };
}

function normalizeShopifyLineAttributes(attributes: ShopifyLineAttribute[] = []): ShopifyLineAttribute[] {
  return [...attributes]
    .filter(attribute => attribute.key.length > 0)
    .sort((left, right) => left.key.localeCompare(right.key) || left.value.localeCompare(right.value));
}

function getShopifyCartLineSignature(item: ShopifyCartLineInput): string {
  return JSON.stringify({
    variantId: item.variantId,
    sellingPlanId: item.sellingPlanId ?? null,
    attributes: normalizeShopifyLineAttributes(item.attributes),
  });
}

export async function storefrontApiRequest(query: string, variables: Record<string, unknown> = {}) {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (response.status === 402) {
    toast.error("Shopify: Payment required", {
      description: "Your store needs to be upgraded to a paid plan. Visit https://admin.shopify.com to upgrade.",
    });
    return;
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  if (data.errors) {
    throw new Error(`Error calling Shopify: ${data.errors.map((e: { message: string }) => e.message).join(', ')}`);
  }

  return data;
}

export const PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $query: String, $after: String) {
    products(first: $first, query: $query, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          title
          description
          handle
          productType
          tags
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          options {
            name
            values
          }
          metafields(identifiers: [
            { namespace: "custom", key: "hero_descriptor_phrase" }
            { namespace: "custom", key: "plating_color_primary" }
            { namespace: "custom", key: "silhouette_category" }
            { namespace: "custom", key: "stacking_role" }
            { namespace: "custom", key: "material_category" }
            { namespace: "custom", key: "occasions_possible" }
            { namespace: "custom", key: "outfit_style" }
            { namespace: "custom", key: "item_type" }
            { namespace: "supercycle", key: "supercycle_enabled" }
            { namespace: "supercycle", key: "methods" }
          ]) {
            key
            value
          }
        }
      }
    }
  }
`;

export const OCCASIONS_QUERY = `
  query GetOccasions($first: Int!) {
    products(first: $first) {
      edges {
        node {
          metafields(identifiers: [
            { namespace: "custom", key: "occasions_possible" }
          ]) {
            key
            value
          }
        }
      }
    }
  }
`;

export const PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      description
      handle
      productType
      tags
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 20) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            availableForSale
            selectedOptions {
              name
              value
            }
          }
        }
      }
      options {
        name
        values
      }
      metafields(identifiers: [
        { namespace: "custom", key: "hero_descriptor_phrase" }
        { namespace: "custom", key: "differentiating_description" }
        { namespace: "custom", key: "silhouette_category" }
        { namespace: "custom", key: "stacking_role" }
        { namespace: "custom", key: "plating_color_primary" }
        { namespace: "custom", key: "other_predominant_color" }
        { namespace: "custom", key: "material_category" }
        { namespace: "custom", key: "size_and_fit" }
        { namespace: "custom", key: "weight_and_comfort" }
        { namespace: "custom", key: "closure_and_security" }
        { namespace: "custom", key: "whats_included" }
        { namespace: "custom", key: "occasions_possible" }
        { namespace: "custom", key: "outfit_style" }
        { namespace: "custom", key: "item_type" }
        { namespace: "supercycle", key: "supercycle_enabled" }
        { namespace: "supercycle", key: "methods" }
        { namespace: "supercycle", key: "calendar_configuration" }
        { namespace: "supercycle", key: "membership_configuration" }
        { namespace: "supercycle", key: "subscription_configuration" }
        { namespace: "supercycle", key: "resale_configuration" }
      ]) {
        key
        value
      }
    }
  }
`;

// Cart mutations
export const CART_QUERY = `
  query cart($id: ID!) {
    cart(id: $id) { id totalQuantity }
  }
`;

export const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        lines(first: 100) {
          edges {
            node {
              id
              attributes {
                key
                value
              }
              merchandise {
                ... on ProductVariant {
                  id
                }
              }
              sellingPlanAllocation {
                sellingPlan {
                  id
                }
              }
            }
          }
        }
      }
      userErrors { field message }
    }
  }
`;

export const CART_LINES_ADD_MUTATION = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        lines(first: 100) {
          edges {
            node {
              id
              attributes {
                key
                value
              }
              merchandise {
                ... on ProductVariant {
                  id
                }
              }
              sellingPlanAllocation {
                sellingPlan {
                  id
                }
              }
            }
          }
        }
      }
      userErrors { field message }
    }
  }
`;

export const CART_LINES_UPDATE_MUTATION = `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
      }
      userErrors { field message }
    }
  }
`;

export const CART_LINES_REMOVE_MUTATION = `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { id }
      userErrors { field message }
    }
  }
`;

function formatCheckoutUrl(checkoutUrl: string): string {
  try {
    const url = new URL(checkoutUrl);
    url.searchParams.set('channel', 'online_store');
    return url.toString();
  } catch {
    return checkoutUrl;
  }
}

function isCartNotFoundError(userErrors: Array<{ field: string[] | null; message: string }>): boolean {
  return userErrors.some(e => e.message.toLowerCase().includes('cart not found') || e.message.toLowerCase().includes('does not exist'));
}

export async function createShopifyCart(item: ShopifyCartLineInput): Promise<{ cartId: string; checkoutUrl: string; lineId: string } | null> {
  const data = await storefrontApiRequest(CART_CREATE_MUTATION, {
    input: {
      lines: [{
        quantity: item.quantity,
        merchandiseId: item.variantId,
        attributes: item.attributes,
        sellingPlanId: item.sellingPlanId ?? undefined,
      }],
    },
  });

  if (data?.data?.cartCreate?.userErrors?.length > 0) {
    console.error('Cart creation failed:', data.data.cartCreate.userErrors);
    return null;
  }

  const cart = data?.data?.cartCreate?.cart;
  if (!cart?.checkoutUrl) return null;

  const lineId = cart.lines.edges[0]?.node?.id;
  if (!lineId) return null;

  return { cartId: cart.id, checkoutUrl: formatCheckoutUrl(cart.checkoutUrl), lineId };
}

export async function addLineToShopifyCart(cartId: string, item: ShopifyCartLineInput): Promise<{ success: boolean; lineId?: string; cartNotFound?: boolean }> {
  const data = await storefrontApiRequest(CART_LINES_ADD_MUTATION, {
    cartId,
    lines: [{
      quantity: item.quantity,
      merchandiseId: item.variantId,
      attributes: item.attributes,
      sellingPlanId: item.sellingPlanId ?? undefined,
    }],
  });

  const userErrors = data?.data?.cartLinesAdd?.userErrors || [];
  if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
  if (userErrors.length > 0) return { success: false };

  const lines = data?.data?.cartLinesAdd?.cart?.lines?.edges || [];
  const targetSignature = getShopifyCartLineSignature(item);
  const newLine = lines.find((line: {
    node: {
      id: string;
      attributes: ShopifyLineAttribute[];
      merchandise: { id: string };
      sellingPlanAllocation?: { sellingPlan?: { id: string | null } | null } | null;
    };
  }) => {
    const candidate = line.node;
    return getShopifyCartLineSignature({
      variantId: candidate.merchandise.id,
      quantity: 1,
      attributes: candidate.attributes,
      sellingPlanId: candidate.sellingPlanAllocation?.sellingPlan?.id ?? null,
    }) === targetSignature;
  });
  return { success: true, lineId: newLine?.node?.id };
}

export async function updateShopifyCartLine(
  cartId: string,
  lineId: string,
  quantity: number,
  options: Pick<ShopifyCartLineInput, 'attributes' | 'sellingPlanId'> = {}
): Promise<{ success: boolean; cartNotFound?: boolean }> {
  const data = await storefrontApiRequest(CART_LINES_UPDATE_MUTATION, {
    cartId,
    lines: [{
      id: lineId,
      quantity,
      attributes: options.attributes,
      sellingPlanId: options.sellingPlanId ?? undefined,
    }],
  });

  const userErrors = data?.data?.cartLinesUpdate?.userErrors || [];
  if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
  if (userErrors.length > 0) return { success: false };
  return { success: true };
}

export async function removeLineFromShopifyCart(cartId: string, lineId: string): Promise<{ success: boolean; cartNotFound?: boolean }> {
  const data = await storefrontApiRequest(CART_LINES_REMOVE_MUTATION, {
    cartId,
    lineIds: [lineId],
  });

  const userErrors = data?.data?.cartLinesRemove?.userErrors || [];
  if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
  if (userErrors.length > 0) return { success: false };
  return { success: true };
}
