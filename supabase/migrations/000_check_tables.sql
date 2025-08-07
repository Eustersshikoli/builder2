-- Check if required tables exist and create them if missing

-- Check if user_profiles table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_profiles') THEN
        CREATE TABLE user_profiles (
            id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
            email TEXT NOT NULL,
            full_name TEXT,
            phone_number TEXT,
            country TEXT,
            username TEXT UNIQUE,
            telegram_id TEXT,
            is_verified BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Enable RLS
        ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
        
        -- Create policies
        CREATE POLICY "Users can view own profile" ON user_profiles
            FOR SELECT USING (auth.uid() = id);
        CREATE POLICY "Users can update own profile" ON user_profiles
            FOR UPDATE USING (auth.uid() = id);
        CREATE POLICY "Users can insert own profile" ON user_profiles
            FOR INSERT WITH CHECK (auth.uid() = id);
            
        RAISE NOTICE 'Created user_profiles table';
    ELSE
        RAISE NOTICE 'user_profiles table already exists';
    END IF;
END
$$;

-- Check if user_balances table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_balances') THEN
        CREATE TABLE user_balances (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
            balance DECIMAL(15,2) DEFAULT 0.00,
            currency TEXT DEFAULT 'USD',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(user_id, currency)
        );
        
        -- Enable RLS
        ALTER TABLE user_balances ENABLE ROW LEVEL SECURITY;
        
        -- Create policies
        CREATE POLICY "Users can view own balance" ON user_balances
            FOR SELECT USING (auth.uid() = user_id);
        CREATE POLICY "System can manage balances" ON user_balances
            FOR ALL USING (current_setting('role') = 'service_role');
            
        RAISE NOTICE 'Created user_balances table';
    ELSE
        RAISE NOTICE 'user_balances table already exists';
    END IF;
END
$$;

-- Check if user_investments table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_investments') THEN
        CREATE TABLE user_investments (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
            plan_name TEXT NOT NULL,
            amount DECIMAL(15,2) NOT NULL,
            expected_return DECIMAL(15,2) NOT NULL,
            actual_return DECIMAL(15,2),
            status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
            start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            end_date TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Enable RLS
        ALTER TABLE user_investments ENABLE ROW LEVEL SECURITY;
        
        -- Create policies
        CREATE POLICY "Users can view own investments" ON user_investments
            FOR SELECT USING (auth.uid() = user_id);
        CREATE POLICY "Users can create own investments" ON user_investments
            FOR INSERT WITH CHECK (auth.uid() = user_id);
        CREATE POLICY "System can update investments" ON user_investments
            FOR UPDATE USING (current_setting('role') = 'service_role');
            
        RAISE NOTICE 'Created user_investments table';
    ELSE
        RAISE NOTICE 'user_investments table already exists';
    END IF;
END
$$;

-- Check if transactions table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'transactions') THEN
        CREATE TABLE transactions (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
            type TEXT NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'investment', 'return', 'referral_commission')),
            amount DECIMAL(15,2) NOT NULL,
            currency TEXT DEFAULT 'USD',
            reference_id UUID,
            description TEXT,
            status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Enable RLS
        ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
        
        -- Create policies
        CREATE POLICY "Users can view own transactions" ON transactions
            FOR SELECT USING (auth.uid() = user_id);
        CREATE POLICY "System can manage transactions" ON transactions
            FOR ALL USING (current_setting('role') = 'service_role');
            
        RAISE NOTICE 'Created transactions table';
    ELSE
        RAISE NOTICE 'transactions table already exists';
    END IF;
END
$$;

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT INSERT, UPDATE ON user_profiles TO authenticated;
GRANT INSERT ON user_investments TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_balances_user_id ON user_balances(user_id);
CREATE INDEX IF NOT EXISTS idx_user_investments_user_id ON user_investments(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);

RAISE NOTICE 'Database setup completed successfully';
