import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

// Service-role client (bypasses RLS) for edge functions.
export function serviceClient(): SupabaseClient {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
}

// Server-to-server secret check (cron / WMS callers). Returns false if the env
// secret is unset so a misconfigured function fails closed.
export function verifySecret(req: Request, headerName: string, envName: string): boolean {
  const expected = Deno.env.get(envName);
  if (!expected) {
    console.warn(`${envName} not set; rejecting request.`);
    return false;
  }
  return req.headers.get(headerName) === expected;
}

// Staff-JWT check for dashboard-triggered actions. Validates the bearer token and
// confirms the user is in the staff allowlist. Returns the user id when staff.
export async function verifyStaff(
  req: Request,
  supabase: SupabaseClient,
): Promise<{ ok: boolean; userId: string | null }> {
  const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
  const token = authHeader?.replace(/^Bearer\s+/i, "").trim();
  if (!token) return { ok: false, userId: null };

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) return { ok: false, userId: null };

  const { data: staffRow } = await supabase
    .from("staff")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();

  return { ok: Boolean(staffRow), userId: data.user.id };
}
