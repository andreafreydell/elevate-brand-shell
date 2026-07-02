import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCustomerEmail, ShopifyOrderPaidWebhook } from "./shopify.ts";

// GEA "two-in-one" membership: buying a membership variant IS the sign-up.
// Because the subscription_contracts webhooks are scope-blocked, we drive
// membership creation off the orders/paid webhook instead.
//
// Membership variant id -> canonical tier.
export const MEMBERSHIP_VARIANT_TIERS: Record<string, "seed" | "blossom" | "garden"> = {
  "48545833943140": "seed",    // Seed  ($35, 3 items / keep 1)
  "48630640345188": "blossom", // Blossom ($65, 6 items / keep 2)
  "48545842724964": "garden",  // Garden ($85, 10 items / keep 3)
};

export interface MembershipResult {
  handled: boolean;
  tier?: string;
  account_id?: string | null;
  created_user?: boolean;
  linked_customer?: boolean;
  skipped?: string;
  error?: string;
}

// Detect the membership tier for an order (first membership line wins). Returns
// null when the order contains no membership variant.
export function membershipTierForOrder(order: ShopifyOrderPaidWebhook): "seed" | "blossom" | "garden" | null {
  for (const line of order.line_items || []) {
    const vid = line.variant_id != null ? String(line.variant_id) : null;
    if (vid && MEMBERSHIP_VARIANT_TIERS[vid]) return MEMBERSHIP_VARIANT_TIERS[vid];
  }
  return null;
}

// Ensure an account exists for the buyer, link the Shopify customer id, and
// activate/refresh the membership. Idempotent: renewal orders for the same
// variant just keep the membership active (never duplicated).
export async function handleMembershipOrder(
  supabase: SupabaseClient,
  order: ShopifyOrderPaidWebhook,
): Promise<MembershipResult> {
  const tier = membershipTierForOrder(order);
  if (!tier) return { handled: false, skipped: "no_membership_variant" };

  const customerId = order.customer?.id != null ? String(order.customer.id) : null;
  if (!customerId) return { handled: false, skipped: "missing_customer_id" };

  let email: string | null =
    order.customer?.email || order.email || (await getCustomerEmail(customerId));
  email = email ? email.trim().toLowerCase() : null;

  let accountId: string | null = null;
  let createdUser = false;
  let linkedCustomer = false;

  // 1. Existing profile already linked to this Shopify customer.
  {
    const { data } = await supabase
      .from("profiles")
      .select("id")
      .eq("shopify_customer_id", customerId)
      .maybeSingle();
    if (data?.id) accountId = data.id;
  }

  // 2. Profile matched by email -> link the customer id onto it.
  if (!accountId && email) {
    const { data } = await supabase
      .from("profiles")
      .select("id, shopify_customer_id")
      .eq("email", email)
      .maybeSingle();
    if (data?.id) {
      accountId = data.id;
      if (!data.shopify_customer_id) {
        await supabase.from("profiles").update({ shopify_customer_id: customerId }).eq("id", data.id);
        linkedCustomer = true;
      }
    }
  }

  // 3. No account yet -> create the auth user (email confirmed). The
  //    handle_new_user trigger creates the profile; then link the customer id.
  if (!accountId) {
    if (!email) return { handled: false, tier, skipped: "no_email_to_create_account" };

    const fullName =
      [order.customer?.first_name, order.customer?.last_name].filter(Boolean).join(" ").trim() || null;

    const { data: created, error: createError } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: fullName ? { full_name: fullName } : {},
    });

    if (createError) {
      // Race / already registered: fall back to looking the profile up by email.
      const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email)
        .maybeSingle();
      if (existing?.id) {
        accountId = existing.id;
      } else {
        return { handled: false, tier, error: `create_user_failed: ${createError.message}` };
      }
    } else if (created?.user?.id) {
      accountId = created.user.id;
      createdUser = true;
    }

    if (accountId) {
      await supabase.from("profiles").update({ shopify_customer_id: customerId }).eq("id", accountId);
      linkedCustomer = true;
    }
  }

  // 4. Activate / refresh the membership (uses order id as the contract ref).
  const { data: profile, error: upsertError } = await supabase.rpc("upsert_membership_from_contract", {
    p_shopify_customer_id: customerId,
    p_shopify_subscription_contract_id: String(order.id),
    p_tier: tier,
    p_status: "active",
    p_started_at: new Date().toISOString(),
    p_tier_source: {
      source: "orders-paid-membership",
      order_id: String(order.id),
      order_name: order.name || null,
      variant_tier: tier,
    },
  });

  if (upsertError) {
    return { handled: false, tier, account_id: accountId, error: `upsert_failed: ${upsertError.message}` };
  }

  return {
    handled: true,
    tier,
    account_id: (profile as { id?: string } | null)?.id ?? accountId,
    created_user: createdUser,
    linked_customer: linkedCustomer,
  };
}
