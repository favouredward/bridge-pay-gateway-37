-- Update the profiles table RLS policy to allow admins to promote users to admin
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

CREATE POLICY "Admins can update all profiles" 
ON public.profiles 
FOR UPDATE 
USING (is_admin(auth.uid()))
WITH CHECK (
  is_admin(auth.uid()) OR 
  (auth.uid() = user_id AND role = (SELECT profiles_1.role FROM profiles profiles_1 WHERE profiles_1.user_id = auth.uid()))
);