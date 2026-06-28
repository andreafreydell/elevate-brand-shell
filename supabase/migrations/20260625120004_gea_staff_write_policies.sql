-- Step 9 support: let staff toggle a unit's retired flag directly from the
-- dashboard. All other mutations (reconcile, charge) go through service-role
-- edge functions, so this is the only staff-facing write policy needed.

CREATE POLICY staff_update_inventory ON public.inventory_units
  FOR UPDATE USING (public.is_staff()) WITH CHECK (public.is_staff());
