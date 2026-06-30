import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { serviceClient, verifySecret, verifyStaff } from "../_shared/auth.ts";
import { addCustomerTags, getCustomerEmail } from "../_shared/shopify.ts";
import { trackKlaviyoEvent } from "../_shared/klaviyo.ts";

// Daily cron (or admin trigger): for every active membership whose new 30-day
// cycle is due, open the cycle, tag the customer `gea_cycle_open` (enters the
// segment the automatic discount applies to), and fire the Klaviyo `cycle_opened`
// event that drives the "pick your pieces" email. Idempotent via cycle_tag_applied.
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
    .select("id, shopify_customer_id, membership_tier")
    .eq("membership_status", "active");

  if (membershipError) {
    return jsonResponse({ error: membershipError.message }, 500);
  }

  const opened: Array<{ account_id: string; cycle_number: number }> = [];
  const errors: Array<{ account_id: string; error: string }> = [];

  for (const m of members || []) {
    try {
      const { data: cycle, error: cycleError } = await supabase.rpc("get_or_create_current_cycle", {
        p_account_id: m.id,
      });
      if (cycleError || !cycle) {
        errors.push({ account_id: m.id, error: cycleError?.message || "cycle creation failed" });
        continue;
      }

      // Already opened/tagged this cycle: skip (idempotent).
      if (cycle.cycle_tag_applied) continue;

      await addCustomerTags(m.shopify_customer_id, ["gea_cycle_open"]);

      const email = await getCustomerEmail(m.shopify_customer_id);
      if (email) {
        await trackKlaviyoEvent({
          metric: "GEA Cycle Opened",
          email,
          properties: {
            tier: m.membership_tier,
            cycle_number: cycle.cycle_number,
            free_items: cycle.free_items_allowance,
            keep_allowance: cycle.keep_allowance,
          },
        });
      } else {
        console.warn("No email for customer", m.shopify_customer_id, "- skipped Klaviyo event");
      }

      await supabase
        .from("rental_cycles")
        .update({ cycle_tag_applied: true, tag_applied_at: new Date().toISOString() })
        .eq("id", cycle.id);

      opened.push({ account_id: m.id, cycle_number: cycle.cycle_number });
    } catch (err) {
      errors.push({ account_id: m.id, error: err instanceof Error ? err.message : String(err) });
    }
  }

  return jsonResponse(
    { ok: errors.length === 0, opened_count: opened.length, opened, errors },
    errors.length > 0 ? 207 : 200,
  );
});
