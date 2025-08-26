-- Fix authentication trigger and profile creation issues

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create improved handle_new_user function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert profile with error handling
  INSERT INTO public.profiles (
    user_id, 
    first_name, 
    last_name, 
    phone, 
    kyc_status, 
    role
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'firstName', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'lastName', ''),
    NEW.raw_user_meta_data ->> 'phone',
    'pending',
    'user'
  );
  
  -- Log successful profile creation
  RAISE LOG 'Profile created for user: %', NEW.id;
  
  RETURN NEW;
EXCEPTION 
  WHEN OTHERS THEN
    -- Log error but don't fail the signup
    RAISE LOG 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Ensure RLS policies are correctly applied
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Add policy for the trigger to insert profiles
DROP POLICY IF EXISTS "System can insert profiles" ON public.profiles;
CREATE POLICY "System can insert profiles"
  ON public.profiles
  FOR INSERT
  WITH CHECK (true);

-- Make sure the profiles table allows the system to insert
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;