import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { serviceClient } from "../_shared/auth.ts";
import { getSubscriptionContract, verifyShopifyWebhook } from "../_shared/shopify.ts";
import { normalizeStatus, resolveTier } from "../_shared/tiers.ts";

// Shopify subscription_contracts/create|update -> mirror tier into memberships.
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const rawBody = await req.text();
  if (!(await verifyShopifyWebhook(req, rawBody))) {
    return jsonResponse({ error: "Invalid Shopify webhook signature" }, 401);
  }

  const payload = JSON.parse(rawBody) as { id?: number | string; admin_graphql_api_id?: string };
  const contractRef = payload.admin_graphql_api_id || (payload.id != null ? String(payload.id) : null);
  if (!contractRef) {
    return jsonResponse({ error: "Missing subscription contract id" }, 400);
  }

  // Fetch authoritative details (customer, status, lines) from the Admin API so
  // we don't depend on the exact webhook payload shape.
  const contract = await getSubscriptionContract(contractRef);
  if (!contract) {
    return jsonResponse({ error: "Subscription contract not found", contractRef }, 404);
  }

  const tier = resolveTier(contract.lines);
  if (!tier) {
    console.warn("Could not resolve tier for contract", contract.id, contract.lines);
    return jsonResponse({ ok: false, skipped: true, reason: "tier_unresolved", contract_id: contract.id }, 200);
  }

  if (!contract.customerId) {
    return jsonResponse({ ok: false, skipped: true, reason: "missing_customer", contract_id: contract.id }, 200);
  }

  // Store numeric ids to match the orders/paid webhook's customer id format.
  const numericCustomerId = contract.customerId.replace(/^.*\/(\d+)$/, "$1");
  const numericContractId = contract.id.replace(/^.*\/(\d+)$/, "$1");

  const supabase = serviceClient();
  const { data, error } = await supabase.rpc("upsert_membership_from_contract", {
    p_shopify_customer_id: numericCustomerId,
    p_shopify_subscription_contract_id: numericContractId,
    p_tier: tier,
    p_status: normalizeStatus(contract.status),
    p_started_at: contract.createdAt || new Date().toISOString(),
    p_tier_source: {
      contract_gid: contract.id,
      shopify_status: contract.status,
      lines: contract.lines,
    },
  });

  if (error) {
    console.error("upsert_membership_from_contract failed:", error);
    return jsonResponse({ error: error.message }, 500);
  }

  // No matching profile means the customer hasn't created an account yet; the
  // tier will sync once they sign up and their profile is linked to this customer.
  if (!data) {
    return jsonResponse({
      ok: true,
      skipped: true,
      reason: "no_account_for_customer",
      shopify_customer_id: numericCustomerId,
      tier,
    });
  }

  return jsonResponse({ ok: true, tier, profile: data });
});
