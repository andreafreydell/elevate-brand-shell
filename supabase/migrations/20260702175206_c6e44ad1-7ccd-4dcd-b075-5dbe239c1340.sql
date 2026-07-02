-- Staff-check helper must be executable by signed-in users for it to be usable
-- inside RLS policies (a prior broad revoke removed this, breaking staff_read_*).
GRANT EXECUTE ON FUNCTION public.is_staff() TO authenticated;

-- Staff can read all profiles (members) for the admin Members tab.
DROP POLICY IF EXISTS staff_read_all_profiles ON public.profiles;
CREATE POLICY staff_read_all_profiles ON public.profiles
  FOR SELECT TO authenticated
  USING (public.is_staff());