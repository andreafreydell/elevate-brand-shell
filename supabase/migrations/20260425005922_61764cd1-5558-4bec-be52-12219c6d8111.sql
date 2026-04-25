-- Read-only access for the admin dashboard (gated by passcode in the UI).
CREATE POLICY "Public read of theolia test serials"
  ON public.theolia_test_serials
  FOR SELECT
  USING (true);

CREATE POLICY "Public read of unit lifecycle events"
  ON public.unit_lifecycle_events
  FOR SELECT
  USING (true);