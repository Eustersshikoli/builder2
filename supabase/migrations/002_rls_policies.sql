-- =====================================================
-- Row Level Security (RLS) Policies
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawal_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE forex_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- USER PROFILES POLICIES
-- =====================================================

-- Users can view and update their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- =====================================================
-- USER BALANCES POLICIES
-- =====================================================

-- Users can view their own balance
CREATE POLICY "Users can view own balance" ON user_balances
    FOR SELECT USING (auth.uid() = user_id);

-- Only system can insert/update balances
CREATE POLICY "System can manage balances" ON user_balances
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- =====================================================
-- INVESTMENT PLANS POLICIES
-- =====================================================

-- Anyone can view active investment plans
CREATE POLICY "Anyone can view active plans" ON investment_plans
    FOR SELECT USING (is_active = true);

-- Only admins can manage investment plans
CREATE POLICY "Admins can manage plans" ON investment_plans
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- =====================================================
-- USER INVESTMENTS POLICIES
-- =====================================================

-- Users can view their own investments
CREATE POLICY "Users can view own investments" ON user_investments
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own investments
CREATE POLICY "Users can create own investments" ON user_investments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- System can update investments
CREATE POLICY "System can update investments" ON user_investments
    FOR UPDATE USING (auth.jwt() ->> 'role' = 'service_role');

-- =====================================================
-- DEPOSITS POLICIES
-- =====================================================

-- Users can view their own deposits
CREATE POLICY "Users can view own deposits" ON deposits
    FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own deposits
CREATE POLICY "Users can create own deposits" ON deposits
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- System can update deposits
CREATE POLICY "System can update deposits" ON deposits
    FOR UPDATE USING (auth.jwt() ->> 'role' = 'service_role');

-- =====================================================
-- WITHDRAWAL REQUESTS POLICIES
-- =====================================================

-- Users can view their own withdrawal requests
CREATE POLICY "Users can view own withdrawals" ON withdrawal_requests
    FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own withdrawal requests
CREATE POLICY "Users can create own withdrawals" ON withdrawal_requests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Only system can update withdrawal requests
CREATE POLICY "System can update withdrawals" ON withdrawal_requests
    FOR UPDATE USING (auth.jwt() ->> 'role' = 'service_role');

-- =====================================================
-- TRANSACTIONS POLICIES
-- =====================================================

-- Users can view their own transactions
CREATE POLICY "Users can view own transactions" ON transactions
    FOR SELECT USING (auth.uid() = user_id);

-- Only system can manage transactions
CREATE POLICY "System can manage transactions" ON transactions
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- =====================================================
-- FOREX SIGNALS POLICIES
-- =====================================================

-- Anyone can view forex signals (public content)
CREATE POLICY "Anyone can view signals" ON forex_signals
    FOR SELECT USING (true);

-- Only system can manage signals
CREATE POLICY "System can manage signals" ON forex_signals
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- =====================================================
-- REFERRALS POLICIES
-- =====================================================

-- Users can view referrals where they are referrer or referred
CREATE POLICY "Users can view own referrals" ON referrals
    FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

-- System can manage referrals
CREATE POLICY "System can manage referrals" ON referrals
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- =====================================================
-- SUPPORT TICKETS POLICIES
-- =====================================================

-- Users can view their own support tickets
CREATE POLICY "Users can view own tickets" ON support_tickets
    FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own support tickets
CREATE POLICY "Users can create own tickets" ON support_tickets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Only system can update support tickets
CREATE POLICY "System can update tickets" ON support_tickets
    FOR UPDATE USING (auth.jwt() ->> 'role' = 'service_role');

-- =====================================================
-- WEBSITE SETTINGS POLICIES
-- =====================================================

-- Anyone can view website settings (public content)
CREATE POLICY "Anyone can view settings" ON website_settings
    FOR SELECT USING (true);

-- Only system can manage settings
CREATE POLICY "System can manage settings" ON website_settings
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- =====================================================
-- TESTIMONIALS POLICIES
-- =====================================================

-- Anyone can view approved testimonials
CREATE POLICY "Anyone can view approved testimonials" ON testimonials
    FOR SELECT USING (is_approved = true);

-- Only system can manage testimonials
CREATE POLICY "System can manage testimonials" ON testimonials
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- =====================================================
-- REVIEWS POLICIES
-- =====================================================

-- Anyone can view reviews (public content)
CREATE POLICY "Anyone can view reviews" ON reviews
    FOR SELECT USING (true);

-- Only system can manage reviews
CREATE POLICY "System can manage reviews" ON reviews
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO authenticated, anon;

-- Grant select on all tables to authenticated users
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;

-- Grant insert/update on specific tables to authenticated users
GRANT INSERT, UPDATE ON user_profiles TO authenticated;
GRANT INSERT ON user_investments TO authenticated;
GRANT INSERT ON deposits TO authenticated;
GRANT INSERT ON withdrawal_requests TO authenticated;
GRANT INSERT ON support_tickets TO authenticated;

-- Grant all permissions to service role
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
