SELECT public.mark_unit_ready(serial, 'manual_reset_after_cancel_bug')
FROM public.theolia_test_serials
WHERE availability_status IN ('reserved', 'out_of_stock', 'shipped');