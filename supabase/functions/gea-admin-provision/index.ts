import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, jsonResponse } from "../_shared/cors.ts";

// One-off admin: ensure a staff auth user exists, add them to public.staff, and
// mint a magic sign-in link. Secret-guarded.
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const expected = Deno.env.get("WEBHOOK_ADMIN_TMP");
  if (!expected || req.headers.get("x-admin-secret") !== expected) {
    return jsonResponse({ error: "unauthorized" }, 401);
  }

  const body = await req.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  const redirectTo = String(body.redirectTo || "");
  if (!email) return jsonResponse({ error: "email required" }, 400);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  let userId: string | null = null;
  let createdUser = false;

  // Create the auth user (email confirmed). If already present, resolve the id.
  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email,
    email_confirm: true,
  });
  if (createError) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    if (profile?.id) {
      userId = profile.id;
    } else {
      // Fall back to scanning auth users.
      const { data: list } = await supabase.auth.admin.listUsers({ page: 1, perPage: 200 });
      userId = list?.users.find((u) => (u.email || "").toLowerCase() === email)?.id ?? null;
    }
  } else if (created?.user?.id) {
    userId = created.user.id;
    createdUser = true;
  }

  if (!userId) return jsonResponse({ error: "could_not_resolve_user", detail: createError?.message }, 500);

  // Add to the staff allowlist (idempotent).
  const { error: staffError } = await supabase
    .from("staff")
    .upsert({ user_id: userId }, { onConflict: "user_id" });
  if (staffError) return jsonResponse({ error: `staff_insert_failed: ${staffError.message}` }, 500);

  // Mint a magic sign-in link.
  const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: redirectTo ? { redirectTo } : undefined,
  });
  if (linkError) return jsonResponse({ error: `link_failed: ${linkError.message}`, user_id: userId }, 500);

  return jsonResponse({
    ok: true,
    email,
    user_id: userId,
    created_user: createdUser,
    action_link: linkData.properties?.action_link ?? null,
  });
});
