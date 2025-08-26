-- Create profiles table with proper structure
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text,
  kyc_status text NOT NULL DEFAULT 'pending',
  role text NOT NULL DEFAULT 'user',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  last_login timestamp with time zone,
  
  PRIMARY KEY (id),
  CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE row level security;

-- Create RLS policies for profiles table
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id AND role = (SELECT role FROM public.profiles WHERE user_id = auth.uid()));

-- Create security definer function to check admin role (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = user_uuid AND role = 'admin'
  );
$$;

-- Admin policies for profiles
CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update all profiles" 
ON public.profiles FOR UPDATE 
USING (public.is_admin(auth.uid()));

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY definer
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name, phone, kyc_status, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'firstName', ''),
    COALESCE(new.raw_user_meta_data ->> 'lastName', ''),
    new.raw_user_meta_data ->> 'phone',
    'pending',
    'user'
  );
  RETURN new;
END;
$$;

-- Create trigger for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  gbp_amount numeric NOT NULL,
  usdt_amount numeric NOT NULL,
  exchange_rate numeric NOT NULL,
  wallet_address text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  payment_reference text NOT NULL,
  transaction_hash text,
  admin_notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  completed_at timestamp with time zone,
  payment_deadline timestamp with time zone NOT NULL,
  bridge_pay_fee numeric NOT NULL DEFAULT 0,
  network_fee numeric NOT NULL DEFAULT 0,
  total_fees numeric NOT NULL DEFAULT 0,
  
  PRIMARY KEY (id)
);

-- Enable RLS on transactions
ALTER TABLE public.transactions ENABLE row level security;

-- RLS policies for transactions
CREATE POLICY "Users can view their own transactions" 
ON public.transactions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transactions" 
ON public.transactions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all transactions" 
ON public.transactions FOR SELECT 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update all transactions" 
ON public.transactions FOR UPDATE 
USING (public.is_admin(auth.uid()));

-- Create KYC documents table
CREATE TABLE IF NOT EXISTS public.kyc_documents (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  document_type text NOT NULL,
  document_url text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  admin_notes text,
  submitted_at timestamp with time zone NOT NULL DEFAULT now(),
  reviewed_at timestamp with time zone,
  
  PRIMARY KEY (id)
);

-- Enable RLS on kyc_documents
ALTER TABLE public.kyc_documents ENABLE row level security;

-- RLS policies for KYC documents
CREATE POLICY "Users can view their own KYC documents" 
ON public.kyc_documents FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own KYC documents" 
ON public.kyc_documents FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all KYC documents" 
ON public.kyc_documents FOR SELECT 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update all KYC documents" 
ON public.kyc_documents FOR UPDATE 
USING (public.is_admin(auth.uid()));

-- Create exchange rates table
CREATE TABLE IF NOT EXISTS public.exchange_rates (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  from_currency text NOT NULL DEFAULT 'GBP',
  to_currency text NOT NULL DEFAULT 'USDT',
  rate numeric NOT NULL,
  timestamp timestamp with time zone NOT NULL DEFAULT now(),
  source text NOT NULL DEFAULT 'binance',
  
  PRIMARY KEY (id)
);

-- Enable RLS on exchange_rates
ALTER TABLE public.exchange_rates ENABLE row level security;

-- RLS policies for exchange rates
CREATE POLICY "Everyone can view exchange rates" 
ON public.exchange_rates FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage exchange rates" 
ON public.exchange_rates FOR ALL 
USING (public.is_admin(auth.uid()));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add updated_at triggers
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_transactions_updated_at ON public.transactions;
CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample exchange rate
INSERT INTO public.exchange_rates (rate) VALUES (1.25) 
ON CONFLICT DO NOTHING;