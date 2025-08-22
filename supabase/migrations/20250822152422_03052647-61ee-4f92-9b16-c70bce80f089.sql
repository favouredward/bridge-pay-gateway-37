-- Create a default admin user for testing
-- Password will be 'admin123' (hashed)
-- This is temporary for demo purposes
INSERT INTO auth.users (id, email, email_confirmed_at, created_at, updated_at, encrypted_password, role)
VALUES (
  gen_random_uuid(),
  'admin@bridgepay.com',
  now(),
  now(),
  now(),
  crypt('admin123', gen_salt('bf')),
  'authenticated'
) ON CONFLICT (email) DO NOTHING;

-- Insert corresponding profile
INSERT INTO public.profiles (user_id, first_name, last_name, role, kyc_status)
SELECT 
  id,
  'Admin',
  'User',
  'admin',
  'verified'
FROM auth.users 
WHERE email = 'admin@bridgepay.com'
ON CONFLICT (user_id) DO NOTHING;