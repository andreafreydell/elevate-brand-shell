-- 1. Revoke EXECUTE on all SECURITY DEFINER functions in public from anon/authenticated/PUBLIC.
-- These are only invoked by edge functions using the service role (which bypasses grants),
-- or used internally within RLS policies / triggers (which do not require caller EXECUTE).
DO $$
DECLARE
  fn record;
BEGIN
  FOR fn IN
    SELECT n.nspname AS schema_name,
           p.proname AS func_name,
           pg_get_function_identity_arguments(p.oid) AS args
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.prosecdef = true
  LOOP
    EXECUTE format(
      'REVOKE ALL ON FUNCTION %I.%I(%s) FROM PUBLIC, anon, authenticated;',
      fn.schema_name, fn.func_name, fn.args
    );
    EXECUTE format(
      'GRANT EXECUTE ON FUNCTION %I.%I(%s) TO service_role;',
      fn.schema_name, fn.func_name, fn.args
    );
  END LOOP;
END $$;

-- 2. Allow members to read their own return records.
CREATE POLICY "Members can read their own returns"
ON public.member_returns
FOR SELECT
TO authenticated
USING (account_id = auth.uid());
