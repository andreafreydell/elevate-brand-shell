// Protected admin data endpoint for the Rental Operations console.
//
// The internal inventory (`theolia_test_serials`) and lifecycle history
// (`unit_lifecycle_events`) tables are no longer publicly readable. The admin
// console reads them through this function using the service role, gated by a
// shared admin passcode that is validated server-side.
//
// Required runtime secrets:
//   ADMIN_OPS_PASSCODE          shared internal passcode for the ops console
//   SUPABASE_URL                (auto-provided)
//   SUPABASE_SERVICE_ROLE_KEY   (auto-provided)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Prefer a server-side secret; fall back to the legacy shared passcode so the
  // console keeps working out of the box. Set ADMIN_OPS_PASSCODE to rotate it.
  const expected = Deno.env.get("ADMIN_OPS_PASSCODE") ?? "GEA2026";

  let body: { passcode?: unknown };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const passcode = typeof body.passcode === "string" ? body.passcode : "";
  if (passcode.length === 0 || passcode.length > 200 || passcode !== expected) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const [unitsRes, eventsRes] = await Promise.all([
    supabase
      .from("theolia_test_serials")
      .select("*")
      .order("serial", { ascending: true }),
    supabase
      .from("unit_lifecycle_events")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  if (unitsRes.error || eventsRes.error) {
    console.error("Ops data load failed", {
      unitsErr: unitsRes.error,
      eventsErr: eventsRes.error,
    });
    return new Response(JSON.stringify({ error: "Failed to load data" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(
    JSON.stringify({ units: unitsRes.data ?? [], events: eventsRes.data ?? [] }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
