-- Pin search_path on the helper/trigger functions that lacked it.
ALTER FUNCTION public.set_updated_at() SET search_path = public;
ALTER FUNCTION public.flag_unit_for_retirement() SET search_path = public;
ALTER FUNCTION public.current_cycle_number(timestamptz, timestamptz) SET search_path = public;
ALTER FUNCTION public.tier_allowances(text) SET search_path = public;
ALTER FUNCTION public.compute_keep_fees(uuid) SET search_path = public;

-- Lock the operational SECURITY DEFINER functions to backend (service_role) only.
DO $$
DECLARE
  fn text;
  fns text[] := ARRAY[
    'public.assign_least_used_inventory_unit(text, text)',
    'public.assign_most_used_inventory_unit(text, text)',
    'public.create_rental_reservation_for_order_line(text, text, text, text, text, text, text, date, date, jsonb)',
    'public.mark_unit_shipped(text, text, text, text)',
    'public.mark_unit_return_open(text, text, text)',
    'public.mark_unit_return_processed(text, boolean, text, text)',
    'public.get_or_create_current_cycle(uuid)',
    'public.count_checkout_for_reservation(uuid)',
    'public.upsert_membership_from_contract(text, text, text, text, timestamptz, jsonb)',
    'public.mark_unit_kept(text, text, text)',
    'public.reconcile_member_return(uuid, boolean)',
    'public.create_charge(uuid, uuid, uuid, text, numeric, jsonb, text)',
    'public.compute_keep_fees(uuid)'
  ];
BEGIN
  FOREACH fn IN ARRAY fns LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC, anon, authenticated;', fn);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO service_role;', fn);
  END LOOP;
END $$;

-- is_staff() must remain callable by signed-in users because the RLS policies
-- evaluate it as the authenticated role; just remove anonymous access.
REVOKE ALL ON FUNCTION public.is_staff() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_staff() TO authenticated, service_role;