import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { serviceClient, verifyStaff } from "../_shared/auth.ts";
import { findOrCreateCustomerByEmail } from "../_shared/shopify.ts";
import { openCycleForMember } from "../_shared/cycles.ts";

// Staff-only pilot enrollment: give someone a full membership WITHOUT a
// checkout or card. Creates (or finds) the auth user + Shopify customer,
// links them, activates the tier on the profile, then runs the same
// instant-activation path as a real purchase (cycle 1 + gea_cycle_open tag +
// "pick your pieces" Klaviyo email). The member's rental checkout then rings
// $0 exactly like a paying member's.
const TIER_ALLOWANCES: Record<string, { free: number; keep: number }> = {
  seed: { free: 3, keep: 1 },
  blossom: { free: 6, keep: 2 },
  garden: { free: 10, keep: 3 },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const supabase = serviceClient();
  const staff = await verifyStaff(req, supabase);
  if (!staff.ok) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  let body: { email?: string; first_name?: string; last_name?: string; tier?: string };
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const email = body.email?.trim().toLowerCase();
  const tier = body.tier?.trim().toLowerCase();
  if (!email || !tier || !TIER_ALLOWANCES[tier]) {
    return jsonResponse({ error: "email and tier (seed|blossom|garden) are required" }, 400);
  }

  const fullName = [body.first_name, body.last_name].filter(Boolean).join(" ").trim() || null;

  // 1. Shopify customer (create if new) — required for the tag-based discount.
  const customer = await findOrCreateCustomerByEmail(email, body.first_name, body.last_name);
  if (!customer.id) {
    return jsonResponse({ error: `shopify_customer_failed: ${customer.error}` }, 502);
  }

  // 2. Auth user + profile (create if new; trigger builds the profile row).
  let accountId: string | null = null;
  let createdUser = false;
  {
    const { data } = await supabase.from("profiles").select("id").eq("email", email).maybeSingle();
    if (data?.id) accountId = data.id;
  }
  if (!accountId) {
    const { data: created, error: createError } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: fullName ? { full_name: fullName } : {},
    });
    if (createError) {
      const { data: existing } = await supabase.from("profiles").select("id").eq("email", email).maybeSingle();
      if (existing?.id) accountId = existing.id;
      else return jsonResponse({ error: `create_user_failed: ${createError.message}` }, 502);
    } else if (created?.user?.id) {
      accountId = created.user.id;
      createdUser = true;
    }
  }
  if (!accountId) {
    return jsonResponse({ error: "account_resolution_failed" }, 500);
  }

  // 3. Link + activate the membership directly on the profile (no Shopify
  //    contract exists for pilot members).
  const allowances = TIER_ALLOWANCES[tier];
  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      shopify_customer_id: customer.id,
      membership_tier: tier,
      membership_status: "active",
      free_items_per_cycle: allowances.free,
      keep_allowance_per_cycle: allowances.keep,
      membership_started_at: new Date().toISOString(),
      tier_source: { source: "pilot-enrollment", enrolled_by: "staff", tier },
    })
    .eq("id", accountId);

  if (updateError) {
    return jsonResponse({ error: `profile_update_failed: ${updateError.message}` }, 500);
  }

  // 4. Instant activation: cycle 1 + tag + "pick your pieces" email.
  const activation = await openCycleForMember(supabase, {
    account_id: accountId,
    shopify_customer_id: customer.id,
    tier,
    email,
  });

  return jsonResponse({
    ok: !activation.error,
    account_id: accountId,
    shopify_customer_id: customer.id,
    created_user: createdUser,
    created_shopify_customer: customer.created,
    tier,
    activation,
  });
});
