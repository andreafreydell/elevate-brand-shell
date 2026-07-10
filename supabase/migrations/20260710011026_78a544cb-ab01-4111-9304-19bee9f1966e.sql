
ALTER POLICY staff_read_charges ON public.charges TO authenticated;
ALTER POLICY staff_read_inventory ON public.inventory_units TO authenticated;
ALTER POLICY staff_update_inventory ON public.inventory_units TO authenticated;
ALTER POLICY staff_read_returns ON public.member_returns TO authenticated;
ALTER POLICY staff_read_cycles ON public.rental_cycles TO authenticated;
ALTER POLICY staff_read_reservations ON public.rental_reservations TO authenticated;
ALTER POLICY staff_read_wms_events ON public.wms_events TO authenticated;

REVOKE EXECUTE ON FUNCTION public.is_staff() FROM anon;
GRANT EXECUTE ON FUNCTION public.is_staff() TO authenticated;
