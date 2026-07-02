-- ============================================================
-- Fix tier naming mismatch + member_returns RLS (dry-run readiness)
-- ============================================================

-- 1a. tier_allowances: accept canonical AND legacy tier names.
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

-- 1b. Canonicalizer: legacy name -> canonical name.
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

-- 1c. upsert_membership_from_contract: normalize the tier before storing.
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

-- 1d. Backfill: canonicalize any profile rows that carry a legacy tier name.
--     Scalar subqueries (unlike a FROM/LATERAL item) may reference the
--     UPDATE target table, avoiding the 42P10 error.
UPDATE public.profiles p
SET membership_tier = public.canonical_tier(p.membership_tier),
    free_items_per_cycle =
      (SELECT free_items FROM public.tier_allowances(public.canonical_tier(p.membership_tier))),
    keep_allowance_per_cycle =
      (SELECT keep_allowance FROM public.tier_allowances(public.canonical_tier(p.membership_tier)))
WHERE p.membership_tier IN ('three_piece', 'six_piece', 'ten_piece');

-- 2. member_returns: restore the member self-read policy.
DROP POLICY IF EXISTS member_read_own_returns ON public.member_returns;
CREATE POLICY member_read_own_returns ON public.member_returns
  FOR SELECT TO authenticated USING (account_id = auth.uid());

-- 3. Hardening: lock the helper functions to service_role.
REVOKE EXECUTE ON FUNCTION public.tier_allowances(text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.canonical_tier(text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.current_cycle_number(timestamptz, timestamptz) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.tier_allowances(text) TO service_role;
GRANT EXECUTE ON FUNCTION public.canonical_tier(text) TO service_role;
GRANT EXECUTE ON FUNCTION public.current_cycle_number(timestamptz, timestamptz) TO service_role;