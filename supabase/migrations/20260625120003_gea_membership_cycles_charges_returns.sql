-- Step 3: Membership tiers, rolling 30-day cycles, kept/return reconciliation,
-- extra-keep charges, plus RLS. Supabase owns cycle + keep accounting; Shopify
-- subscription contracts are the source of truth for tier (mirrored here).

-- ============================================================================
-- TABLES
-- ============================================================================

CREATE TABLE public.memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shopify_customer_id text NOT NULL,
  shopify_subscription_contract_id text,
  auth_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  tier text NOT NULL CHECK (tier IN ('three_piece', 'six_piece', 'ten_piece')),
  free_items_per_cycle integer NOT NULL CHECK (free_items_per_cycle > 0),
  keep_allowance_per_cycle integer NOT NULL DEFAULT 1 CHECK (keep_allowance_per_cycle >= 0),
  status text NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'paused', 'cancelled', 'expired')),
  started_at timestamptz NOT NULL DEFAULT now(),
  cancelled_at timestamptz,
  tier_source jsonb NOT NULL DEFAULT '{}'::jsonb,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- One active membership per customer.
CREATE UNIQUE INDEX memberships_active_customer_unique_idx
  ON public.memberships (shopify_customer_id)
  WHERE status = 'active';
-- One row per subscription contract (for idempotent upserts from webhooks).
CREATE UNIQUE INDEX memberships_subscription_contract_unique_idx
  ON public.memberships (shopify_subscription_contract_id)
  WHERE shopify_subscription_contract_id IS NOT NULL;
CREATE INDEX memberships_auth_user_idx ON public.memberships (auth_user_id);
CREATE INDEX memberships_customer_idx ON public.memberships (shopify_customer_id);

CREATE TABLE public.rental_cycles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  membership_id uuid NOT NULL REFERENCES public.memberships(id) ON DELETE CASCADE,
  cycle_number integer NOT NULL CHECK (cycle_number >= 1),
  cycle_start timestamptz NOT NULL,
  cycle_end timestamptz NOT NULL,
  free_items_allowance integer NOT NULL,
  keep_allowance integer NOT NULL,
  checkout_count integer NOT NULL DEFAULT 0,
  free_used integer NOT NULL DEFAULT 0,
  extra_items integer NOT NULL DEFAULT 0,
  keep_count integer NOT NULL DEFAULT 0,
  extra_keeps integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  cycle_tag_applied boolean NOT NULL DEFAULT false,
  tag_applied_at timestamptz,
  tag_removed_at timestamptz,
  reconciled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (membership_id, cycle_number)
);
CREATE INDEX rental_cycles_membership_idx ON public.rental_cycles (membership_id);

CREATE TABLE public.charges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  membership_id uuid REFERENCES public.memberships(id) ON DELETE SET NULL,
  rental_cycle_id uuid REFERENCES public.rental_cycles(id) ON DELETE SET NULL,
  rental_reservation_id uuid REFERENCES public.rental_reservations(id) ON DELETE SET NULL,
  charge_type text NOT NULL CHECK (charge_type IN ('extra_keep_fee')),
  amount numeric(10,2) NOT NULL CHECK (amount >= 0),
  currency text NOT NULL DEFAULT 'USD',
  quantity integer NOT NULL DEFAULT 1,
  basis jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'charged', 'failed', 'void')),
  shopify_charge_ref text,
  idempotency_key text NOT NULL UNIQUE,
  error text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX charges_membership_idx ON public.charges (membership_id);
CREATE INDEX charges_cycle_idx ON public.charges (rental_cycle_id);
CREATE INDEX charges_status_idx ON public.charges (status);

CREATE TABLE public.member_returns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  membership_id uuid REFERENCES public.memberships(id) ON DELETE SET NULL,
  rental_cycle_id uuid REFERENCES public.rental_cycles(id) ON DELETE SET NULL,
  shopify_order_id text,
  shopify_return_id text,
  source text NOT NULL DEFAULT 'manual'
    CHECK (source IN ('manual', 'shopify_return', 'wms')),
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'reconciled')),
  expected_serials text[] NOT NULL DEFAULT '{}',
  returned_serials text[] NOT NULL DEFAULT '{}',
  kept_serials text[] NOT NULL DEFAULT '{}',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  reconciled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX member_returns_membership_idx ON public.member_returns (membership_id);
CREATE INDEX member_returns_order_idx ON public.member_returns (shopify_order_id);
CREATE INDEX member_returns_status_idx ON public.member_returns (status);

-- ============================================================================
-- rental_reservations: membership/cycle linkage + kept/lost states
-- ============================================================================

ALTER TABLE public.rental_reservations
  ADD COLUMN IF NOT EXISTS membership_id uuid REFERENCES public.memberships(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS rental_cycle_id uuid REFERENCES public.rental_cycles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS is_free_item boolean,
  ADD COLUMN IF NOT EXISTS keep_requested boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS kept_at timestamptz,
  -- Retail value snapshot at rental time; basis for the 40% keep fee (NOT the
  -- $0/$6 rental line price).
  ADD COLUMN IF NOT EXISTS item_price_cache numeric(10,2);

ALTER TABLE public.rental_reservations
  DROP CONSTRAINT IF EXISTS rental_reservations_internal_status_check;
ALTER TABLE public.rental_reservations
  ADD CONSTRAINT rental_reservations_internal_status_check
  CHECK (internal_status IN (
    'assigned', 'released_to_wms', 'shipped', 'return_open',
    'closed', 'damage_review', 'cancelled', 'kept', 'lost'
  ));

CREATE INDEX rental_reservations_membership_idx ON public.rental_reservations (membership_id);
CREATE INDEX rental_reservations_cycle_idx ON public.rental_reservations (rental_cycle_id);

-- wms_events: log kept/lost outcomes too.
ALTER TABLE public.wms_events
  DROP CONSTRAINT IF EXISTS wms_events_event_type_check;
ALTER TABLE public.wms_events
  ADD CONSTRAINT wms_events_event_type_check
  CHECK (event_type IN (
    'order_accepted', 'serial_picked', 'shipment_created', 'return_opened',
    'return_received', 'return_processed_restocked', 'return_processed_not_restocked',
    'condition_result', 'missing_lost', 'item_kept', 'item_lost'
  ));

-- updated_at triggers (reuse public.set_updated_at from the MVP migration).
CREATE TRIGGER memberships_set_updated_at
  BEFORE UPDATE ON public.memberships
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER rental_cycles_set_updated_at
  BEFORE UPDATE ON public.rental_cycles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER charges_set_updated_at
  BEFORE UPDATE ON public.charges
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER member_returns_set_updated_at
  BEFORE UPDATE ON public.member_returns
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Rolling 30-day cycle number from the membership anchor. Cycle 1 starts at
-- started_at; cycle N covers [started_at + (N-1)*30d, started_at + N*30d).
CREATE OR REPLACE FUNCTION public.current_cycle_number(
  p_started_at timestamptz,
  p_at timestamptz DEFAULT now()
)
RETURNS integer
LANGUAGE sql
STABLE
AS $$
  SELECT GREATEST(
    1,
    floor(extract(epoch FROM (p_at - p_started_at)) / (30 * 86400))::int + 1
  );
$$;

-- Tier -> (free_items_per_cycle, keep_allowance_per_cycle).
CREATE OR REPLACE FUNCTION public.tier_allowances(p_tier text)
RETURNS TABLE (free_items integer, keep_allowance integer)
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT
    CASE p_tier WHEN 'three_piece' THEN 3 WHEN 'six_piece' THEN 6 WHEN 'ten_piece' THEN 10 END,
    CASE p_tier WHEN 'three_piece' THEN 1 WHEN 'six_piece' THEN 2 WHEN 'ten_piece' THEN 3 END;
$$;

-- ============================================================================
-- CYCLE ACCOUNTING
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_or_create_current_cycle(p_membership_id uuid)
RETURNS public.rental_cycles
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_membership public.memberships;
  v_n integer;
  v_start timestamptz;
  v_end timestamptz;
  v_cycle public.rental_cycles;
BEGIN
  SELECT * INTO v_membership FROM public.memberships WHERE id = p_membership_id;
  IF v_membership.id IS NULL THEN
    RAISE EXCEPTION 'Membership % not found', p_membership_id;
  END IF;

  v_n := public.current_cycle_number(v_membership.started_at, now());
  v_start := v_membership.started_at + ((v_n - 1) * interval '30 days');
  v_end := v_membership.started_at + (v_n * interval '30 days');

  INSERT INTO public.rental_cycles (
    membership_id, cycle_number, cycle_start, cycle_end,
    free_items_allowance, keep_allowance
  )
  VALUES (
    p_membership_id, v_n, v_start, v_end,
    v_membership.free_items_per_cycle, v_membership.keep_allowance_per_cycle
  )
  ON CONFLICT (membership_id, cycle_number) DO NOTHING;

  -- Close any earlier still-open cycles for this membership.
  UPDATE public.rental_cycles
  SET status = 'closed'
  WHERE membership_id = p_membership_id
    AND cycle_number < v_n
    AND status = 'open';

  SELECT * INTO v_cycle
  FROM public.rental_cycles
  WHERE membership_id = p_membership_id AND cycle_number = v_n;

  RETURN v_cycle;
END;
$$;

-- Count one checkout (one rental line) against the member's current cycle and
-- stamp the reservation. Idempotent: no-op if the reservation already has a cycle.
CREATE OR REPLACE FUNCTION public.count_checkout_for_reservation(p_reservation_id uuid)
RETURNS public.rental_reservations
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_res public.rental_reservations;
  v_membership public.memberships;
  v_cycle public.rental_cycles;
  v_count integer;
  v_allowance integer;
  v_unit_retail numeric(10,2);
BEGIN
  SELECT * INTO v_res FROM public.rental_reservations WHERE id = p_reservation_id;
  IF v_res.id IS NULL THEN
    RAISE EXCEPTION 'Reservation % not found', p_reservation_id;
  END IF;

  -- Already counted into a cycle: idempotent no-op.
  IF v_res.rental_cycle_id IS NOT NULL THEN
    RETURN v_res;
  END IF;

  -- Resolve the active membership for this order's customer.
  IF v_res.shopify_customer_id IS NOT NULL THEN
    SELECT * INTO v_membership
    FROM public.memberships
    WHERE shopify_customer_id = v_res.shopify_customer_id AND status = 'active'
    LIMIT 1;
  END IF;

  -- Non-member rental: snapshot retail value (for any future lost charge) and return.
  IF v_membership.id IS NULL THEN
    SELECT retail_price_cache INTO v_unit_retail
    FROM public.inventory_units WHERE id = v_res.inventory_unit_id;
    UPDATE public.rental_reservations
    SET item_price_cache = COALESCE(item_price_cache, v_unit_retail)
    WHERE id = p_reservation_id
    RETURNING * INTO v_res;
    RETURN v_res;
  END IF;

  v_cycle := public.get_or_create_current_cycle(v_membership.id);

  UPDATE public.rental_cycles
  SET checkout_count = checkout_count + 1,
      free_used = LEAST(checkout_count + 1, free_items_allowance),
      extra_items = GREATEST(0, (checkout_count + 1) - free_items_allowance)
  WHERE id = v_cycle.id
  RETURNING checkout_count, free_items_allowance INTO v_count, v_allowance;

  SELECT retail_price_cache INTO v_unit_retail
  FROM public.inventory_units WHERE id = v_res.inventory_unit_id;

  UPDATE public.rental_reservations
  SET membership_id = v_membership.id,
      rental_cycle_id = v_cycle.id,
      is_free_item = (v_count <= v_allowance),
      item_price_cache = COALESCE(item_price_cache, v_unit_retail)
  WHERE id = p_reservation_id
  RETURNING * INTO v_res;

  RETURN v_res;
END;
$$;

-- ============================================================================
-- MEMBERSHIP SYNC (from Shopify subscription contract)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.upsert_membership_from_contract(
  p_shopify_customer_id text,
  p_shopify_subscription_contract_id text,
  p_tier text,
  p_status text DEFAULT 'active',
  p_started_at timestamptz DEFAULT now(),
  p_tier_source jsonb DEFAULT '{}'::jsonb
)
RETURNS public.memberships
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_free integer;
  v_keep integer;
  v_membership public.memberships;
BEGIN
  SELECT free_items, keep_allowance INTO v_free, v_keep
  FROM public.tier_allowances(p_tier);

  IF v_free IS NULL THEN
    RAISE EXCEPTION 'Unknown tier %', p_tier;
  END IF;

  INSERT INTO public.memberships (
    shopify_customer_id, shopify_subscription_contract_id, tier,
    free_items_per_cycle, keep_allowance_per_cycle, status, started_at, tier_source
  )
  VALUES (
    p_shopify_customer_id, p_shopify_subscription_contract_id, p_tier,
    v_free, v_keep, p_status, p_started_at, COALESCE(p_tier_source, '{}'::jsonb)
  )
  ON CONFLICT (shopify_subscription_contract_id) DO UPDATE
  SET tier = EXCLUDED.tier,
      free_items_per_cycle = EXCLUDED.free_items_per_cycle,
      keep_allowance_per_cycle = EXCLUDED.keep_allowance_per_cycle,
      status = EXCLUDED.status,
      tier_source = EXCLUDED.tier_source,
      cancelled_at = CASE WHEN EXCLUDED.status IN ('cancelled', 'expired') THEN now() ELSE NULL END
  RETURNING * INTO v_membership;

  RETURN v_membership;
END;
$$;

-- ============================================================================
-- KEEP + RETURN RECONCILIATION
-- ============================================================================

-- Mark a serial as kept by the member: unit leaves the fleet, reservation -> kept,
-- and the reservation's cycle keep counters bump.
CREATE OR REPLACE FUNCTION public.mark_unit_kept(
  p_serial_number text,
  p_shopify_order_id text DEFAULT NULL,
  p_shopify_line_item_id text DEFAULT NULL
)
RETURNS public.inventory_units
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_unit public.inventory_units;
  v_res public.rental_reservations;
BEGIN
  UPDATE public.inventory_units
  SET availability_status = 'kept',
      ready_since = NULL,
      last_returned_at = now()
  WHERE serial_number = p_serial_number
  RETURNING * INTO v_unit;

  IF v_unit.id IS NULL THEN
    RAISE EXCEPTION 'No inventory unit found for serial %', p_serial_number;
  END IF;

  UPDATE public.rental_reservations
  SET internal_status = 'kept',
      keep_requested = true,
      kept_at = now(),
      returned_at = COALESCE(returned_at, now())
  WHERE serial_number = p_serial_number
    AND (p_shopify_order_id IS NULL OR shopify_order_id = p_shopify_order_id)
    AND (p_shopify_line_item_id IS NULL OR shopify_line_item_id = p_shopify_line_item_id)
    AND internal_status NOT IN ('kept', 'closed', 'cancelled', 'lost')
  RETURNING * INTO v_res;

  IF v_res.rental_cycle_id IS NOT NULL THEN
    UPDATE public.rental_cycles
    SET keep_count = keep_count + 1,
        extra_keeps = GREATEST(0, (keep_count + 1) - keep_allowance)
    WHERE id = v_res.rental_cycle_id;
  END IF;

  INSERT INTO public.wms_events (
    source, event_type, shopify_order_id, shopify_line_item_id,
    inventory_unit_id, unit_id, serial_number, sku, processed_at
  )
  VALUES (
    'backend', 'item_kept', p_shopify_order_id, p_shopify_line_item_id,
    v_unit.id, v_unit.unit_id, v_unit.serial_number, v_unit.sku, now()
  );

  RETURN v_unit;
END;
$$;

-- Reconcile a return: returned serials restock; not-returned (expected minus
-- returned) are kept. Kept finalization waits for a grace window unless forced.
CREATE OR REPLACE FUNCTION public.reconcile_member_return(
  p_return_id uuid,
  p_force boolean DEFAULT false
)
RETURNS public.member_returns
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_return public.member_returns;
  v_kept text[];
  v_serial text;
  v_grace_passed boolean;
BEGIN
  SELECT * INTO v_return FROM public.member_returns WHERE id = p_return_id;
  IF v_return.id IS NULL THEN
    RAISE EXCEPTION 'Member return % not found', p_return_id;
  END IF;

  -- Restock everything that came back.
  FOREACH v_serial IN ARRAY v_return.returned_serials LOOP
    PERFORM public.mark_unit_return_processed(v_serial, true, v_return.shopify_order_id, NULL);
  END LOOP;

  -- kept = expected - returned.
  v_kept := ARRAY(
    SELECT unnest(v_return.expected_serials)
    EXCEPT
    SELECT unnest(v_return.returned_serials)
  );

  v_grace_passed := (now() - v_return.created_at) > interval '3 days';

  IF p_force OR v_grace_passed THEN
    FOREACH v_serial IN ARRAY v_kept LOOP
      PERFORM public.mark_unit_kept(v_serial, v_return.shopify_order_id, NULL);
    END LOOP;

    UPDATE public.member_returns
    SET kept_serials = v_kept,
        status = 'reconciled',
        reconciled_at = now()
    WHERE id = p_return_id
    RETURNING * INTO v_return;
  ELSE
    -- Record the provisional kept set but stay open until grace passes / forced.
    UPDATE public.member_returns
    SET kept_serials = v_kept
    WHERE id = p_return_id
    RETURNING * INTO v_return;
  END IF;

  RETURN v_return;
END;
$$;

-- ============================================================================
-- FEES
-- ============================================================================

-- Identify the chargeable extra-keep reservations in a cycle (those kept beyond
-- the keep allowance), oldest-kept first, with the 40%-of-retail fee.
CREATE OR REPLACE FUNCTION public.compute_keep_fees(p_cycle_id uuid)
RETURNS TABLE (
  rental_reservation_id uuid,
  serial_number text,
  item_price numeric(10,2),
  fee_amount numeric(10,2)
)
LANGUAGE sql
STABLE
AS $$
  WITH cyc AS (
    SELECT keep_allowance FROM public.rental_cycles WHERE id = p_cycle_id
  ),
  kept AS (
    SELECT r.id, r.serial_number, COALESCE(r.item_price_cache, 0) AS price,
           row_number() OVER (ORDER BY r.kept_at ASC, r.id ASC) AS rn
    FROM public.rental_reservations r
    WHERE r.rental_cycle_id = p_cycle_id AND r.internal_status = 'kept'
  )
  SELECT kept.id, kept.serial_number, kept.price,
         round(kept.price * 0.40, 2) AS fee_amount
  FROM kept, cyc
  WHERE kept.rn > cyc.keep_allowance;
$$;

CREATE OR REPLACE FUNCTION public.create_charge(
  p_membership_id uuid,
  p_rental_cycle_id uuid,
  p_rental_reservation_id uuid,
  p_charge_type text,
  p_amount numeric,
  p_basis jsonb,
  p_idempotency_key text
)
RETURNS public.charges
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_charge public.charges;
BEGIN
  INSERT INTO public.charges (
    membership_id, rental_cycle_id, rental_reservation_id,
    charge_type, amount, basis, idempotency_key
  )
  VALUES (
    p_membership_id, p_rental_cycle_id, p_rental_reservation_id,
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

-- ============================================================================
-- RLS
-- ============================================================================

-- Staff allowlist (team members who use /admin/rental-ops).
CREATE TABLE public.staff (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.staff WHERE user_id = auth.uid());
$$;

ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.charges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_returns ENABLE ROW LEVEL SECURITY;

-- Staff: full read access across rental ops tables (writes go through service-role
-- edge functions / SECURITY DEFINER RPCs, which bypass RLS).
CREATE POLICY staff_read_inventory ON public.inventory_units FOR SELECT USING (public.is_staff());
CREATE POLICY staff_read_reservations ON public.rental_reservations FOR SELECT USING (public.is_staff());
CREATE POLICY staff_read_wms_events ON public.wms_events FOR SELECT USING (public.is_staff());
CREATE POLICY staff_read_memberships ON public.memberships FOR SELECT USING (public.is_staff());
CREATE POLICY staff_read_cycles ON public.rental_cycles FOR SELECT USING (public.is_staff());
CREATE POLICY staff_read_charges ON public.charges FOR SELECT USING (public.is_staff());
CREATE POLICY staff_read_returns ON public.member_returns FOR SELECT USING (public.is_staff());
CREATE POLICY staff_self ON public.staff FOR SELECT USING (user_id = auth.uid());

-- Members: read their own membership, cycles, reservations, charges.
CREATE POLICY member_read_own_membership ON public.memberships
  FOR SELECT USING (auth_user_id = auth.uid());
CREATE POLICY member_read_own_cycles ON public.rental_cycles
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.memberships m
    WHERE m.id = rental_cycles.membership_id AND m.auth_user_id = auth.uid()
  ));
CREATE POLICY member_read_own_reservations ON public.rental_reservations
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.memberships m
    WHERE m.id = rental_reservations.membership_id AND m.auth_user_id = auth.uid()
  ));
CREATE POLICY member_read_own_charges ON public.charges
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.memberships m
    WHERE m.id = charges.membership_id AND m.auth_user_id = auth.uid()
  ));
