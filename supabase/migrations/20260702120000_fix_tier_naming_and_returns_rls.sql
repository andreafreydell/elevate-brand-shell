-- ============================================================
-- Fix tier naming mismatch + member_returns RLS (dry-run readiness)
--
-- 1) The deployed shopify-subscription-sync resolves tiers to
--    three_piece/six_piece/ten_piece (_shared/tiers.ts), but the
--    2026-06-30 profiles consolidation redefined tier_allowances()
--    to only know seed/blossom/garden. Result: tier_allowances
--    returns NULLs and upsert_membership_from_contract raises
--    'Unknown tier three_piece' -> the subscription webhook 500s and
--    no membership is ever created. tier_allowances now accepts BOTH
--    naming sets, and upsert normalizes to the canonical
--    seed/blossom/garden before storing.
-- 2) The consolidation recreated member read policies for charges/
--    cycles/reservations but dropped member_returns' policy. Members
--    could no longer read their own returns. Recreated here.
-- 3) Hardening: the two pure helper functions were left executable by
--    anon/authenticated; lock them to service_role like the rest.
-- ============================================================

-- ------------------------------------------------------------
-- 1a. tier_allowances: accept canonical AND legacy tier names.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.tier_allowances(p_tier text)
RETURNS TABLE(free_items integer, keep_allowance integer)
LANGUAGE sql IMMUTABLE SET search_path TO 'public'
AS $$
  SELECT
    CASE p_tier
      WHEN 'seed' THEN 3 WHEN 'three_piece' THEN 3
      WHEN 'blossom' THEN 6 WHEN 'six_piece' THEN 6
      WHEN 'garden' THEN 10 WHEN 'ten_piece' THEN 10
    END,
    CASE p_tier
      WHEN 'seed' THEN 1 WHEN 'three_piece' THEN 1
      WHEN 'blossom' THEN 2 WHEN 'six_piece' THEN 2
      WHEN 'garden' THEN 3 WHEN 'ten_piece' THEN 3
    END;
$$;

-- ------------------------------------------------------------
-- 1b. Canonicalizer: legacy name -> canonical name (pass-through
--     for already-canonical values; NULL for unknown).
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.canonical_tier(p_tier text)
RETURNS text
LANGUAGE sql IMMUTABLE SET search_path TO 'public'
AS $$
  SELECT CASE p_tier
    WHEN 'three_piece' THEN 'seed'
    WHEN 'six_piece' THEN 'blossom'
    WHEN 'ten_piece' THEN 'garden'
    WHEN 'seed' THEN 'seed'
    WHEN 'blossom' THEN 'blossom'
    WHEN 'garden' THEN 'garden'
  END;
$$;

-- ------------------------------------------------------------
-- 1c. upsert_membership_from_contract: normalize the tier before
--     storing so profiles.membership_tier is always canonical.
--     (Body otherwise identical to 20260630180252.)
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.upsert_membership_from_contract(
  p_shopify_customer_id text, p_shopify_subscription_contract_id text, p_tier text,
  p_status text DEFAULT 'active', p_started_at timestamptz DEFAULT now(), p_tier_source jsonb DEFAULT '{}'::jsonb)
RETURNS profiles
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE
  v_tier text;
  v_free integer;
  v_keep integer;
  v_profile public.profiles;
BEGIN
  v_tier := public.canonical_tier(p_tier);
  IF v_tier IS NULL THEN
    RAISE EXCEPTION 'Unknown tier %', p_tier;
  END IF;

  SELECT free_items, keep_allowance INTO v_free, v_keep
  FROM public.tier_allowances(v_tier);

  IF v_free IS NULL THEN
    RAISE EXCEPTION 'Unknown tier %', p_tier;
  END IF;

  UPDATE public.profiles
  SET membership_tier = v_tier,
      membership_status = p_status,
      shopify_subscription_contract_id = p_shopify_subscription_contract_id,
      free_items_per_cycle = v_free,
      keep_allowance_per_cycle = v_keep,
      membership_started_at = COALESCE(membership_started_at, p_started_at),
      membership_cancelled_at = CASE WHEN p_status IN ('cancelled', 'expired') THEN now() ELSE NULL END,
      tier_source = COALESCE(p_tier_source, '{}'::jsonb)
  WHERE shopify_customer_id = p_shopify_customer_id
  RETURNING * INTO v_profile;

  RETURN v_profile;
END;
$$;

-- ------------------------------------------------------------
-- 1d. Backfill: canonicalize any profile rows that already carry a
--     legacy tier name (and repair their allowances).
-- ------------------------------------------------------------
UPDATE public.profiles p
SET membership_tier = public.canonical_tier(p.membership_tier),
    free_items_per_cycle = t.free_items,
    keep_allowance_per_cycle = t.keep_allowance
FROM public.tier_allowances(public.canonical_tier(p.membership_tier)) AS t
WHERE p.membership_tier IN ('three_piece', 'six_piece', 'ten_piece');

-- ------------------------------------------------------------
-- 2. member_returns: restore the member self-read policy (mirrors
--    member_read_own_charges / _cycles / _reservations).
-- ------------------------------------------------------------
DROP POLICY IF EXISTS member_read_own_returns ON public.member_returns;
CREATE POLICY member_read_own_returns ON public.member_returns
  FOR SELECT TO authenticated USING (account_id = auth.uid());

-- ------------------------------------------------------------
-- 3. Hardening: lock the helper functions to service_role (they are
--    only called from inside SECURITY DEFINER functions / the backend).
-- ------------------------------------------------------------
REVOKE EXECUTE ON FUNCTION public.tier_allowances(text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.canonical_tier(text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.current_cycle_number(timestamptz, timestamptz) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.tier_allowances(text) TO service_role;
GRANT EXECUTE ON FUNCTION public.canonical_tier(text) TO service_role;
GRANT EXECUTE ON FUNCTION public.current_cycle_number(timestamptz, timestamptz) TO service_role;
