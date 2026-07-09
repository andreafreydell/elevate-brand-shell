import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { addCustomerTags, getCustomerEmail } from "./shopify.ts";
import { trackKlaviyoEvent } from "./klaviyo.ts";

// Shared cycle lifecycle used by BOTH the instant-activation path in
// shopify-order-paid (membership just purchased) and the daily gea-open-cycle
// job (renewals). Idempotent via rental_cycles.cycle_tag_applied, so the two
// entry points can never double-tag or double-email a member.

export interface OpenCycleResult {
  opened: boolean;
  cycle_number?: number;
  skipped?: string;
  error?: string;
}

export async function openCycleForMember(
  supabase: SupabaseClient,
  member: {
    account_id: string;
    shopify_customer_id: string | null;
    tier: string | null;
    /** Known email (e.g. pilot enrollment) — skips the Shopify lookup. */
    email?: string | null;
  },
): Promise<OpenCycleResult> {
  try {
    const { data: cycle, error: cycleError } = await supabase.rpc("get_or_create_current_cycle", {
      p_account_id: member.account_id,
    });
    if (cycleError || !cycle) {
      return { opened: false, error: cycleError?.message || "cycle creation failed" };
    }

    // Already opened/tagged this cycle: skip (idempotent).
    if (cycle.cycle_tag_applied) {
      return { opened: false, cycle_number: cycle.cycle_number, skipped: "already_tagged" };
    }

    if (member.shopify_customer_id) {
      await addCustomerTags(member.shopify_customer_id, ["gea_cycle_open"]);
    }

    const email =
      member.email ||
      (member.shopify_customer_id ? await getCustomerEmail(member.shopify_customer_id) : null);
    if (email) {
      await trackKlaviyoEvent({
        metric: "GEA Cycle Opened",
        email,
        properties: {
          tier: member.tier,
          cycle_number: cycle.cycle_number,
          free_items: cycle.free_items_allowance,
          keep_allowance: cycle.keep_allowance,
          selection_url: "https://geagems.com/welcome",
        },
      });
    } else {
      console.warn("No email for customer", member.shopify_customer_id, "- skipped Klaviyo event");
    }

    await supabase
      .from("rental_cycles")
      .update({ cycle_tag_applied: true, tag_applied_at: new Date().toISOString() })
      .eq("id", cycle.id);

    return { opened: true, cycle_number: cycle.cycle_number };
  } catch (err) {
    return { opened: false, error: err instanceof Error ? err.message : String(err) };
  }
}

// Day-31 reminder: for every open cycle past its end date whose member still
// has pieces out, fire the Klaviyo "GEA Return Due" event exactly once
// (stamped via rental_cycles.return_reminder_sent_at).
export async function emitReturnDueEvents(
  supabase: SupabaseClient,
): Promise<{ reminded: number; errors: Array<{ cycle_id: string; error: string }> }> {
  const errors: Array<{ cycle_id: string; error: string }> = [];
  let reminded = 0;

  const { data: dueCycles, error } = await supabase
    .from("rental_cycles")
    .select("id, account_id, cycle_number, cycle_end")
    .lte("cycle_end", new Date().toISOString())
    .is("return_reminder_sent_at", null)
    .not("account_id", "is", null);

  if (error) {
    return { reminded: 0, errors: [{ cycle_id: "query", error: error.message }] };
  }

  for (const cycle of dueCycles || []) {
    try {
      // Pieces still out for this cycle?
      const { data: out } = await supabase
        .from("rental_reservations")
        .select("id, metadata, serial_number")
        .eq("rental_cycle_id", cycle.id)
        .in("internal_status", ["assigned", "released_to_wms", "shipped", "return_open"]);

      if (!out || out.length === 0) {
        // Nothing outstanding — stamp so we never re-check this cycle.
        await supabase
          .from("rental_cycles")
          .update({ return_reminder_sent_at: new Date().toISOString() })
          .eq("id", cycle.id);
        continue;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("email, membership_tier")
        .eq("id", cycle.account_id)
        .maybeSingle();

      if (profile?.email) {
        await trackKlaviyoEvent({
          metric: "GEA Return Due",
          email: profile.email,
          properties: {
            tier: profile.membership_tier,
            cycle_number: cycle.cycle_number,
            pieces_out: out.length,
            return_url: "https://geagems.com/returns",
          },
        });
        reminded += 1;
      }

      await supabase
        .from("rental_cycles")
        .update({ return_reminder_sent_at: new Date().toISOString() })
        .eq("id", cycle.id);
    } catch (err) {
      errors.push({ cycle_id: cycle.id, error: err instanceof Error ? err.message : String(err) });
    }
  }

  return { reminded, errors };
}
