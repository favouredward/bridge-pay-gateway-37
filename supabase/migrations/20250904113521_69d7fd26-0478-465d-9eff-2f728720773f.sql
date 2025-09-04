-- Add terms_accepted column to profiles table to track terms acceptance
ALTER TABLE public.profiles ADD COLUMN terms_accepted BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN terms_accepted_at TIMESTAMP WITH TIME ZONE;