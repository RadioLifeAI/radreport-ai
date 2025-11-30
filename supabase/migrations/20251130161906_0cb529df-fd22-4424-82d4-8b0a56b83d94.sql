-- Create profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  avatar_url text,
  specialty text,
  crm text,
  institution text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Trigger to create profile automatically on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'full_name');
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create user_ai_balance table
CREATE TABLE public.user_ai_balance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  balance integer NOT NULL DEFAULT 20,
  monthly_limit integer DEFAULT 500,
  plan_type text DEFAULT 'free',
  plan_expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_ai_balance ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_ai_balance
CREATE POLICY "Users can view own AI balance" 
ON public.user_ai_balance FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage AI balance" 
ON public.user_ai_balance FOR ALL 
USING (true)
WITH CHECK (true);

-- Create ai_credits_ledger table
CREATE TABLE public.ai_credits_ledger (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  transaction_type text NOT NULL,
  amount integer NOT NULL,
  balance_before integer NOT NULL,
  balance_after integer NOT NULL,
  description text,
  feature_used text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_credits_ledger ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ai_credits_ledger
CREATE POLICY "Users can view own transaction history" 
ON public.ai_credits_ledger FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert transactions" 
ON public.ai_credits_ledger FOR INSERT 
WITH CHECK (true);

-- Trigger to create AI balance for existing users
INSERT INTO public.user_ai_balance (user_id, balance, monthly_limit, plan_type)
SELECT id, 20, 500, 'free'
FROM auth.users
ON CONFLICT (user_id) DO NOTHING;