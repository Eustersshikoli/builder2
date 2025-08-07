-- Create a super admin user
-- First, create a role enum if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        CREATE TYPE public.app_role AS ENUM ('admin', 'user', 'super_admin');
    ELSE
        -- Add super_admin to existing enum if not present
        ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'super_admin';
    END IF;
END
$$;

-- Create user_roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role public.app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create RLS policies for user_roles
CREATE POLICY IF NOT EXISTS "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Super admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'));

-- Create admin_accounts table for super admin credentials
CREATE TABLE IF NOT EXISTS public.admin_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    is_super_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on admin_accounts
ALTER TABLE public.admin_accounts ENABLE ROW LEVEL SECURITY;

-- Create policy for admin accounts
CREATE POLICY IF NOT EXISTS "Only super admins can access admin accounts"
ON public.admin_accounts
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'));

-- Insert super admin account
INSERT INTO public.admin_accounts (email, password_hash, is_super_admin)
VALUES ('admin@forextraderssignals.com', crypt('Eusters@97', gen_salt('bf')), TRUE)
ON CONFLICT (email) DO UPDATE SET
    password_hash = crypt('Eusters@97', gen_salt('bf')),
    is_super_admin = TRUE,
    updated_at = NOW();