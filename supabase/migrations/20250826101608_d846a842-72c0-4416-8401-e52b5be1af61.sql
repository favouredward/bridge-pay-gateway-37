-- Fix RLS policy conflicts for profile creation

-- Drop conflicting policies
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "System can insert profiles" ON public.profiles;

-- Create a single comprehensive policy for profile insertion
CREATE POLICY "Allow profile creation for authenticated users and system"
  ON public.profiles
  FOR INSERT
  WITH CHECK (
    -- Allow if the user is authenticated and creating their own profile
    (auth.uid() = user_id) OR
    -- Allow system/trigger operations (when auth.uid() is null during trigger execution)
    (auth.uid() IS NULL)
  );