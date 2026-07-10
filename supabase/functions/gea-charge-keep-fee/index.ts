import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { serviceClient, verifyStaff } from "../_shared/auth.ts";
import { chargeKeepFeesForCycle } from "../_shared/fees.ts";

// Staff-triggered retry/backstop: charge the 40%-of-retail extra-keep fee for
// every keep beyond the cycle's allowance. The normal path is automatic (the
// returns/close webhook charges as soon as the warehouse closes the return);
// this endpoint re-runs the same idempotent logic for failed/edge cases.
// Body: { cycle_id: uuid }
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

  const { cycle_id } = (await req.json()) as { cycle_id?: string };
  if (!cycle_id) {
    return jsonResponse({ error: "cycle_id required" }, 400);
  }

  const outcome = await chargeKeepFeesForCycle(supabase, cycle_id);
  if (outcome.error && outcome.charges.length === 0) {
    return jsonResponse({ error: outcome.error }, 500);
  }
  return jsonResponse(outcome, outcome.ok ? 200 : 207);
});
