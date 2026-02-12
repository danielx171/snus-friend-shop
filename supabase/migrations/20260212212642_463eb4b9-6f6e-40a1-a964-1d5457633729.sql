
-- Fix: Change all remaining RESTRICTIVE policies to PERMISSIVE

DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
CREATE POLICY "Admins can manage roles"
  ON public.user_roles
  AS PERMISSIVE
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Also fix the SELECT policies that are still RESTRICTIVE per the scan
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
CREATE POLICY "Users can view own roles"
  ON public.user_roles
  AS PERMISSIVE
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
CREATE POLICY "Admins can view all roles"
  ON public.user_roles
  AS PERMISSIVE
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
