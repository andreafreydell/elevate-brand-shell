-- Remove main's experimental "Theolia" rental prototype, superseded by this platform.
-- Only the experiment's test objects are dropped (confirmed safe). Runs AFTER our migrations.
-- NOTE: drops main's 3-arg mark_unit_shipped specifically — ours is the 4-arg version and is kept.

DROP FUNCTION IF EXISTS public.claim_theolia_serial(text, text, text, text);
DROP FUNCTION IF EXISTS public.mark_unit_reserved(text, text, text);
DROP FUNCTION IF EXISTS public.mark_unit_shipped(text, text, text);
DROP FUNCTION IF EXISTS public.mark_unit_returned(text, text, text);
DROP FUNCTION IF EXISTS public.mark_unit_ready(text, text);
DROP FUNCTION IF EXISTS public.mark_unit_damaged(text, text);
DROP TABLE IF EXISTS public.unit_lifecycle_events CASCADE;
DROP TABLE IF EXISTS public.theolia_test_serials CASCADE;
DROP FUNCTION IF EXISTS public.validate_unit_status() CASCADE;
