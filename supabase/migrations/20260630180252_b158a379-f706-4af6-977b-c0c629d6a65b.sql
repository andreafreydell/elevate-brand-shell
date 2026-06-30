-- ============================================================
-- 1. PROFILES: single account surface (one row per auth user)
-- ============================================================
CREATE TABLE public.profiles (
  id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  shopify_customer_id text UNIQUE,
  -- membership (folded in from memberships)
  membership_tier text NOT NULL DEFAULT 'none',
  membership_status text NOT NULL DEFAULT 'none',
  membership_started_at timestamptz,
  membership_cancelled_at timestamptz,
  shopify_subscription_contract_id text,
  free_items_per_cycle integer NOT NULL DEFAULT 0,
  keep_allowance_per_cycle integer NOT NULL DEFAULT 0,
  tier_source jsonb NOT NULL DEFAULT '{}'::jsonb,
  -- lifecycle flags
  next_chapter_completed boolean NOT NULL DEFAULT false,
  next_chapter_completed_at timestamptz,
  is_founding_member boolean NOT NULL DEFAULT false,
  founding_source text,
  -- wishlist
  wishlist jsonb NOT NULL DEFAULT '{"occasions": []}'::jsonb,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Each person can read and update only their own profile.
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
-- No INSERT policy: rows are created only by the signup trigger (security definer).

CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-create a profile row whenever a new auth user signs up.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 2. CLEAR DISPOSABLE OPERATIONAL DATA + REPOINT TO profiles
-- ============================================================
TRUNCATE TABLE public.charges, public.member_returns,
              public.rental_reservations, public.rental_cycles CASCADE;

-- Replace member-scoped RLS that referenced memberships (drop before table drop).
DROP POLICY IF EXISTS member_read_own_charges ON public.charges;
DROP POLICY IF EXISTS member_read_own_cycles ON public.rental_cycles;
DROP POLICY IF EXISTS member_read_own_reservations ON public.rental_reservations;

-- charges: membership_id -> account_id (ON DELETE SET NULL)
ALTER TABLE public.charges DROP CONSTRAINT charges_membership_id_fkey;
ALTER TABLE public.charges RENAME COLUMN membership_id TO account_id;
ALTER TABLE public.charges ADD CONSTRAINT charges_account_id_fkey
  FOREIGN KEY (account_id) REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER INDEX charges_membership_idx RENAME TO charges_account_idx;

-- rental_cycles: membership_id -> account_id (ON DELETE CASCADE)
ALTER TABLE public.rental_cycles DROP CONSTRAINT rental_cycles_membership_id_fkey;
ALTER TABLE public.rental_cycles RENAME COLUMN membership_id TO account_id;
ALTER TABLE public.rental_cycles ADD CONSTRAINT rental_cycles_account_id_fkey
  FOREIGN KEY (account_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER INDEX rental_cycles_membership_idx RENAME TO rental_cycles_account_idx;
ALTER INDEX rental_cycles_membership_id_cycle_number_key
  RENAME TO rental_cycles_account_id_cycle_number_key;

-- rental_reservations: membership_id -> account_id (ON DELETE SET NULL)
ALTER TABLE public.rental_reservations DROP CONSTRAINT rental_reservations_membership_id_fkey;
ALTER TABLE public.rental_reservations RENAME COLUMN membership_id TO account_id;
ALTER TABLE public.rental_reservations ADD CONSTRAINT rental_reservations_account_id_fkey
  FOREIGN KEY (account_id) REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER INDEX rental_reservations_membership_idx RENAME TO rental_reservations_account_idx;

-- member_returns: membership_id -> account_id (ON DELETE SET NULL)
ALTER TABLE public.member_returns DROP CONSTRAINT member_returns_membership_id_fkey;
ALTER TABLE public.member_returns RENAME COLUMN membership_id TO account_id;
ALTER TABLE public.member_returns ADD CONSTRAINT member_returns_account_id_fkey
  FOREIGN KEY (account_id) REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER INDEX member_returns_membership_idx RENAME TO member_returns_account_idx;

-- Recreate member-scoped read policies against the account.
CREATE POLICY member_read_own_charges ON public.charges
  FOR SELECT TO authenticated USING (account_id = auth.uid());
CREATE POLICY member_read_own_cycles ON public.rental_cycles
  FOR SELECT TO authenticated USING (account_id = auth.uid());
CREATE POLICY member_read_own_reservations ON public.rental_reservations
  FOR SELECT TO authenticated USING (account_id = auth.uid());

-- ============================================================
-- 3. REPOINT DATABASE FUNCTIONS (memberships -> profiles, *_membership_id -> *_account_id)
-- ============================================================

-- Tier -> allowances, keyed by the canonical tier names (seed/blossom/garden).
CREATE OR REPLACE FUNCTION public.tier_allowances(p_tier text)
RETURNS TABLE(free_items integer, keep_allowance integer)
LANGUAGE sql IMMUTABLE SET search_path TO 'public'
AS $$
  SELECT
    CASE p_tier WHEN 'seed' THEN 3 WHEN 'blossom' THEN 6 WHEN 'garden' THEN 10 END,
    CASE p_tier WHEN 'seed' THEN 1 WHEN 'blossom' THEN 2 WHEN 'garden' THEN 3 END;
$$;

DROP FUNCTION IF EXISTS public.get_or_create_current_cycle(uuid);
CREATE FUNCTION public.get_or_create_current_cycle(p_account_id uuid)
RETURNS rental_cycles
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE
  v_profile public.profiles;
  v_n integer;
  v_start timestamptz;
  v_end timestamptz;
  v_cycle public.rental_cycles;
BEGIN
  SELECT * INTO v_profile FROM public.profiles WHERE id = p_account_id;
  IF v_profile.id IS NULL THEN
    RAISE EXCEPTION 'Profile % not found', p_account_id;
  END IF;

  v_n := public.current_cycle_number(v_profile.membership_started_at, now());
  v_start := v_profile.membership_started_at + ((v_n - 1) * interval '30 days');
  v_end := v_profile.membership_started_at + (v_n * interval '30 days');

  INSERT INTO public.rental_cycles (
    account_id, cycle_number, cycle_start, cycle_end,
    free_items_allowance, keep_allowance
  )
  VALUES (
    p_account_id, v_n, v_start, v_end,
    v_profile.free_items_per_cycle, v_profile.keep_allowance_per_cycle
  )
  ON CONFLICT (account_id, cycle_number) DO NOTHING;

  UPDATE public.rental_cycles
  SET status = 'closed'
  WHERE account_id = p_account_id AND cycle_number < v_n AND status = 'open';

  SELECT * INTO v_cycle
  FROM public.rental_cycles
  WHERE account_id = p_account_id AND cycle_number = v_n;

  RETURN v_cycle;
END;
$$;

CREATE OR REPLACE FUNCTION public.count_checkout_for_reservation(p_reservation_id uuid)
RETURNS rental_reservations
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE
  v_res public.rental_reservations;
  v_profile public.profiles;
  v_cycle public.rental_cycles;
  v_count integer;
  v_allowance integer;
  v_unit_retail numeric(10,2);
BEGIN
  SELECT * INTO v_res FROM public.rental_reservations WHERE id = p_reservation_id;
  IF v_res.id IS NULL THEN
    RAISE EXCEPTION 'Reservation % not found', p_reservation_id;
  END IF;

  IF v_res.rental_cycle_id IS NOT NULL THEN
    RETURN v_res;
  END IF;

  IF v_res.shopify_customer_id IS NOT NULL THEN
    SELECT * INTO v_profile
    FROM public.profiles
    WHERE shopify_customer_id = v_res.shopify_customer_id
      AND membership_status = 'active'
    LIMIT 1;
  END IF;

  IF v_profile.id IS NULL THEN
    SELECT retail_price_cache INTO v_unit_retail
    FROM public.inventory_units WHERE id = v_res.inventory_unit_id;
    UPDATE public.rental_reservations
    SET item_price_cache = COALESCE(item_price_cache, v_unit_retail)
    WHERE id = p_reservation_id
    RETURNING * INTO v_res;
    RETURN v_res;
  END IF;

  v_cycle := public.get_or_create_current_cycle(v_profile.id);

  UPDATE public.rental_cycles
  SET checkout_count = checkout_count + 1,
      free_used = LEAST(checkout_count + 1, free_items_allowance),
      extra_items = GREATEST(0, (checkout_count + 1) - free_items_allowance)
  WHERE id = v_cycle.id
  RETURNING checkout_count, free_items_allowance INTO v_count, v_allowance;

  SELECT retail_price_cache INTO v_unit_retail
  FROM public.inventory_units WHERE id = v_res.inventory_unit_id;

  UPDATE public.rental_reservations
  SET account_id = v_profile.id,
      rental_cycle_id = v_cycle.id,
      is_free_item = (v_count <= v_allowance),
      item_price_cache = COALESCE(item_price_cache, v_unit_retail)
  WHERE id = p_reservation_id
  RETURNING * INTO v_res;

  RETURN v_res;
END;
$$;

DROP FUNCTION IF EXISTS public.create_charge(uuid, uuid, uuid, text, numeric, jsonb, text);
CREATE FUNCTION public.create_charge(
  p_account_id uuid, p_rental_cycle_id uuid, p_rental_reservation_id uuid,
  p_charge_type text, p_amount numeric, p_basis jsonb, p_idempotency_key text)
RETURNS charges
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE
  v_charge public.charges;
BEGIN
  INSERT INTO public.charges (
    account_id, rental_cycle_id, rental_reservation_id,
    charge_type, amount, basis, idempotency_key
  )
  VALUES (
    p_account_id, p_rental_cycle_id, p_rental_reservation_id,
    p_charge_type, p_amount, COALESCE(p_basis, '{}'::jsonb), p_idempotency_key
  )
  ON CONFLICT (idempotency_key) DO NOTHING
  RETURNING * INTO v_charge;

  IF v_charge.id IS NULL THEN
    SELECT * INTO v_charge FROM public.charges WHERE idempotency_key = p_idempotency_key;
  END IF;

  RETURN v_charge;
END;
$$;

-- Mirror a Shopify subscription contract onto an existing profile (matched by
-- shopify_customer_id). Returns NULL if no account exists yet for that customer.
DROP FUNCTION IF EXISTS public.upsert_membership_from_contract(text, text, text, text, timestamptz, jsonb);
CREATE FUNCTION public.upsert_membership_from_contract(
  p_shopify_customer_id text, p_shopify_subscription_contract_id text, p_tier text,
  p_status text DEFAULT 'active', p_started_at timestamptz DEFAULT now(), p_tier_source jsonb DEFAULT '{}'::jsonb)
RETURNS profiles
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE
  v_free integer;
  v_keep integer;
  v_profile public.profiles;
BEGIN
  SELECT free_items, keep_allowance INTO v_free, v_keep
  FROM public.tier_allowances(p_tier);

  IF v_free IS NULL THEN
    RAISE EXCEPTION 'Unknown tier %', p_tier;
  END IF;

  UPDATE public.profiles
  SET membership_tier = p_tier,
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

-- ============================================================
-- 4. DROP REDUNDANT TABLES (data now lives on profiles)
-- ============================================================
DROP TABLE IF EXISTS public.memberships CASCADE;
DROP TABLE IF EXISTS public.founding_members CASCADE;