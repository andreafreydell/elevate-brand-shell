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

interface EnsureAccountResult {
  account_id: string | null;
  created_user: boolean;
  linked_customer: boolean;
  skipped?: string;
  error?: string;
}

// Resolve-or-create the Supabase account for an order's buyer and link the
// Shopify customer id onto it. Shared by the membership two-in-one path and
// the GEAPILOT code path.
async function ensureAccountForOrder(
  supabase: SupabaseClient,
  order: ShopifyOrderPaidWebhook,
  customerId: string,
): Promise<EnsureAccountResult> {
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
    if (!email) {
      return { account_id: null, created_user: false, linked_customer: false, skipped: "no_email_to_create_account" };
    }

    const fullName =
      [order.customer?.first_name, order.customer?.last_name].filter(Boolean).join(" ").trim() || null;

    const { data: created, error: createError } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: fullName ? { full_name: fullName } : {},
    });

    if (createError) {
      // Race / already registered: look up the existing auth user by email and
      // ensure a profile row exists (the handle_new_user trigger may not have
      // been attached when the user was originally created, e.g. via magic link).
      const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email)
        .maybeSingle();
      if (existing?.id) {
        accountId = existing.id;
      } else {
        // Fetch existing auth user id by email via admin API.
        const { data: list } = await supabase.auth.admin.listUsers({ page: 1, perPage: 200 });
        const found = list?.users?.find((u) => (u.email || "").toLowerCase() === email);
        if (found?.id) {
          accountId = found.id;
          // Backfill missing profile row.
          await supabase
            .from("profiles")
            .upsert({ id: found.id, email, full_name: fullName }, { onConflict: "id" });
        } else {
          return {
            account_id: null,
            created_user: false,
            linked_customer: false,
            error: `create_user_failed: ${createError.message}`,
          };
        }
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

  return { account_id: accountId, created_user: createdUser, linked_customer: linkedCustomer };
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

  const account = await ensureAccountForOrder(supabase, order, customerId);
  if (account.skipped) return { handled: false, tier, skipped: account.skipped };
  if (account.error || !account.account_id) return { handled: false, tier, error: account.error };
  const accountId = account.account_id;
  const createdUser = account.created_user;
  const linkedCustomer = account.linked_customer;

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

// ---------------------------------------------------------------------------
// GEAPILOT: a checkout discount code that grants one Seed-style month with no
// subscription and no card. An order carrying the code (and no membership
// variant) enrolls the buyer exactly like a membership purchase — account,
// seed tier, 30-day cycle — but the cycle opens SILENTLY: the announce stamps
// are set immediately so neither the instant-activation path nor the daily
// cron ever tags the customer or sends the "pick your pieces" email (they
// already picked; their items are in this very order). tag_removed_at is also
// stamped so the on-site PromoBar shows the return state, not "pick now".
// Pilot accounts never auto-renew: the daily cron skips pilot tier_sources.

export const PILOT_DISCOUNT_CODE = "GEAPILOT";

export function orderPilotCode(order: ShopifyOrderPaidWebhook): string | null {
  for (const dc of order.discount_codes || []) {
    if ((dc.code || "").trim().toUpperCase() === PILOT_DISCOUNT_CODE) return PILOT_DISCOUNT_CODE;
  }
  return null;
}

export interface PilotCodeResult {
  handled: boolean;
  account_id?: string | null;
  created_user?: boolean;
  cycle_number?: number;
  skipped?: string;
  error?: string;
}

export async function handlePilotCodeOrder(
  supabase: SupabaseClient,
  order: ShopifyOrderPaidWebhook,
): Promise<PilotCodeResult> {
  const code = orderPilotCode(order);
  if (!code) return { handled: false, skipped: "no_pilot_code" };

  // A real membership purchase in the same order wins — the normal
  // two-in-one + instant activation path handles it.
  if (membershipTierForOrder(order)) return { handled: false, skipped: "membership_order" };

  const customerId = order.customer?.id != null ? String(order.customer.id) : null;
  if (!customerId) return { handled: false, skipped: "missing_customer_id" };

  const account = await ensureAccountForOrder(supabase, order, customerId);
  if (account.skipped) return { handled: false, skipped: account.skipped };
  if (account.error || !account.account_id) return { handled: false, error: account.error };

  // Existing ACTIVE members keep their real tier — never downgrade them to a
  // pilot seed because they typed a code.
  const { data: profile } = await supabase
    .from("profiles")
    .select("membership_status, membership_tier")
    .eq("id", account.account_id)
    .maybeSingle();
  if (profile?.membership_status === "active") {
    // Their items still count against their own cycle via the normal member
    // path; we must not touch their cycle stamps (it would silence their next
    // renewal email).
    return { handled: false, account_id: account.account_id, skipped: "already_active_member" };
  }

  const { error: upsertError } = await supabase.rpc("upsert_membership_from_contract", {
    p_shopify_customer_id: customerId,
    p_shopify_subscription_contract_id: `pilot-code:${String(order.id)}`,
    p_tier: "seed",
    p_status: "active",
    p_started_at: new Date().toISOString(),
    p_tier_source: {
      source: "pilot-code",
      code,
      order_id: String(order.id),
      order_name: order.name || null,
    },
  });
  if (upsertError) {
    return { handled: false, account_id: account.account_id, error: `upsert_failed: ${upsertError.message}` };
  }

  // Open the cycle SILENTLY: stamp it announced+consumed in the same breath.
  const { data: cycle, error: cycleError } = await supabase.rpc("get_or_create_current_cycle", {
    p_account_id: account.account_id,
  });
  if (cycleError || !cycle) {
    return { handled: false, account_id: account.account_id, error: cycleError?.message || "cycle creation failed" };
  }
  if (!cycle.cycle_tag_applied) {
    await supabase
      .from("rental_cycles")
      .update({
        cycle_tag_applied: true,
        tag_applied_at: new Date().toISOString(),
        tag_removed_at: new Date().toISOString(),
      })
      .eq("id", cycle.id);
  }

  return {
    handled: true,
    account_id: account.account_id,
    created_user: account.created_user,
    cycle_number: cycle.cycle_number,
  };
}
