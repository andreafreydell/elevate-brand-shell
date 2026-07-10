import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { serviceClient, verifySecret, verifyStaff } from "../_shared/auth.ts";
import { emitReturnDueEvents, openCycleForMember } from "../_shared/cycles.ts";

// Daily cron (or admin trigger): for every active membership whose new 30-day
// cycle is due, open the cycle, tag the customer `gea_cycle_open` (enters the
// segment the automatic discount applies to), and fire the Klaviyo `GEA Cycle
// Opened` event that drives the "pick your pieces" email. Also fires the
// day-31 `GEA Return Due` reminder for cycles past their end with pieces
// still out. Idempotent via cycle_tag_applied / return_reminder_sent_at.
// NOTE: first cycles now open instantly at purchase (shopify-order-paid);
// this job is the renewal engine for month 2+.
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const supabase = serviceClient();

  const secretOk = verifySecret(req, "x-gea-cron-secret", "GEA_CRON_SECRET");
  const staff = secretOk ? { ok: true } : await verifyStaff(req, supabase);
  if (!secretOk && !staff.ok) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  const { data: members, error: membershipError } = await supabase
    .from("profiles")
    .select("id, shopify_customer_id, membership_tier, tier_source")
    .eq("membership_status", "active");

  if (membershipError) {
    return jsonResponse({ error: membershipError.message }, 500);
  }

  const opened: Array<{ account_id: string; cycle_number: number }> = [];
  const errors: Array<{ account_id: string; error: string }> = [];
  let skippedPilots = 0;

  for (const m of members || []) {
    // Pilots (GEAPILOT code or dashboard enrollment) get exactly one month —
    // no automatic renewal, no month-2 "pick your pieces" email. Converting
    // by buying a real membership rewrites tier_source via the two-in-one
    // path, which re-enables renewals. Their day-31 return reminder still
    // fires below (emitReturnDueEvents is cycle-based, member-agnostic).
    const source = (m.tier_source as { source?: string } | null)?.source;
    if (source === "pilot-code" || source === "pilot-enrollment") {
      skippedPilots += 1;
      continue;
    }

    const result = await openCycleForMember(supabase, {
      account_id: m.id,
      shopify_customer_id: m.shopify_customer_id,
      tier: m.membership_tier,
    });
    if (result.opened && result.cycle_number != null) {
      opened.push({ account_id: m.id, cycle_number: result.cycle_number });
    } else if (result.error) {
      errors.push({ account_id: m.id, error: result.error });
    }
  }

  // Day-31 "It's Time To Return Your Items" reminders.
  const returnDue = await emitReturnDueEvents(supabase);

  return jsonResponse(
    {
      ok: errors.length === 0 && returnDue.errors.length === 0,
      opened_count: opened.length,
      opened,
      skipped_pilots: skippedPilots,
      return_reminders_sent: returnDue.reminded,
      errors: [...errors, ...returnDue.errors],
    },
    errors.length > 0 || returnDue.errors.length > 0 ? 207 : 200,
  );
});
