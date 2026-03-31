export type SupercycleMethodName = "Calendar" | "Membership" | "Subscription" | "Resale";

export interface SupercycleIntentRequest {
  variantId: number;
  optionGlobalId: string;
  params: {
    [key: string]: string | undefined;
  };
}

export interface SupercycleIntentResponse {
  attributes: Record<string, string | number>;
  add_ons: Array<Record<string, string | number>>;
  available_item_count?: number;
}

export interface SupercycleProductAvailabilityRequest {
  productIds: number[];
  rentalStart: string;
  rentalEnd?: string;
}

export interface SupercycleProductAvailabilityResponse {
  products: Array<{
    shopify_id: number;
    title: string;
    available_variants: Array<{
      shopify_id: number;
      title: string;
    }>;
  }>;
}

declare global {
  interface Window {
    supercycleAppEmbed?: {
      context?: {
        proxyPathPrefix?: string;
      };
    };
  }
}

function getSupercycleProxyPathPrefix(): string {
  const envValue = import.meta.env.VITE_SUPERCYCLE_PROXY_PATH_PREFIX?.trim();
  const appEmbedValue = window.supercycleAppEmbed?.context?.proxyPathPrefix?.trim();
  const proxyPathPrefix = envValue || appEmbedValue;

  if (!proxyPathPrefix) {
    throw new Error("Supercycle proxy path prefix is not configured.");
  }

  return proxyPathPrefix.startsWith("/") ? proxyPathPrefix : `/${proxyPathPrefix}`;
}

function toSnakeCaseKey(value: string): string {
  return value.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
}

function toSnakeCaseParams(params: Record<string, string | undefined>): Record<string, string> {
  return Object.entries(params).reduce<Record<string, string>>((result, [key, value]) => {
    if (value === undefined) return result;
    result[toSnakeCaseKey(key)] = value;
    return result;
  }, {});
}

async function supercycleProxyRequest<TResponse>(path: string, body: Record<string, unknown>): Promise<TResponse> {
  const proxyPathPrefix = getSupercycleProxyPathPrefix();
  const response = await fetch(`${proxyPathPrefix}${path.startsWith("/") ? path : `/${path}`}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Supercycle request failed with status ${response.status}`);
  }

  return response.json() as Promise<TResponse>;
}

export async function createSupercycleIntent(request: SupercycleIntentRequest): Promise<SupercycleIntentResponse> {
  return supercycleProxyRequest<SupercycleIntentResponse>("/intents", {
    variant_id: request.variantId,
    option: {
      global_id: request.optionGlobalId,
      params: toSnakeCaseParams(request.params),
    },
  });
}

export async function checkSupercycleProductAvailability(
  request: SupercycleProductAvailabilityRequest
): Promise<SupercycleProductAvailabilityResponse> {
  return supercycleProxyRequest<SupercycleProductAvailabilityResponse>("/product_availability_checks", {
    product_ids: request.productIds,
    rental_start: request.rentalStart,
    rental_end: request.rentalEnd,
  });
}
