-- 1. Remove public read access to internal inventory/order data.
DROP POLICY IF EXISTS "Public read of theolia test serials" ON public.theolia_test_serials;
DROP POLICY IF EXISTS "Public read of unit lifecycle events" ON public.unit_lifecycle_events;

-- Revoke any direct Data API read access from anon/authenticated.
-- service_role (used by edge functions) bypasses RLS and retains access.
REVOKE SELECT ON public.theolia_test_serials FROM anon, authenticated;
REVOKE SELECT ON public.unit_lifecycle_events FROM anon, authenticated;

-- 2. Lock down SECURITY DEFINER functions so they can only be called
--    server-side by edge functions (service_role), not by anon/authenticated.
REVOKE EXECUTE ON FUNCTION public.mark_unit_ready(text, text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.mark_unit_reserved(text, text, text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.mark_unit_shipped(text, text, text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.mark_unit_damaged(text, text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.mark_unit_returned(text, text, text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.claim_theolia_serial(text, text, text, text) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.mark_unit_ready(text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.mark_unit_reserved(text, text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.mark_unit_shipped(text, text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.mark_unit_damaged(text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.mark_unit_returned(text, text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.claim_theolia_serial(text, text, text, text) TO service_role;