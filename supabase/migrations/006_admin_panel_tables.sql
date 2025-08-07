-- Admin Panel Comprehensive Tables Migration
-- This migration ensures all tables needed for the admin panel exist

-- News posts table
CREATE TABLE IF NOT EXISTS news_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image_url TEXT,
    is_published BOOLEAN DEFAULT false,
    is_breaking BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Blog posts table (enhanced)
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image_url TEXT,
    category TEXT DEFAULT 'general',
    is_published BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Ebooks table (enhanced)
CREATE TABLE IF NOT EXISTS ebooks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    author TEXT NOT NULL,
    file_url TEXT NOT NULL,
    cover_image_url TEXT,
    category TEXT DEFAULT 'general',
    is_free BOOLEAN DEFAULT false,
    required_investment_amount DECIMAL(10,2) DEFAULT 0,
    download_count INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Testimonials table (enhanced)
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    content TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    avatar_url TEXT,
    location TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    payment_method TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    transaction_hash TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Site errors table
CREATE TABLE IF NOT EXISTS site_errors (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    error_message TEXT NOT NULL,
    error_code TEXT,
    page_url TEXT,
    user_agent TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    resolved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enhanced support tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'replied', 'resolved', 'closed')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    admin_reply TEXT,
    replied_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    reference_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enhanced investment plans table with plan_type
CREATE TABLE IF NOT EXISTS investment_plans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    min_amount DECIMAL(10,2) NOT NULL,
    max_amount DECIMAL(10,2) NOT NULL,
    roi_percentage DECIMAL(5,2) NOT NULL,
    duration_days INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    plan_type TEXT DEFAULT 'dashboard' CHECK (plan_type IN ('frontend', 'dashboard')),
    features JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add missing columns to user_profiles if not exists
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS kyc_status TEXT DEFAULT 'pending';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_news_posts_published ON news_posts(is_published, created_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published, created_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_ebooks_published ON ebooks(is_published, created_at);
CREATE INDEX IF NOT EXISTS idx_testimonials_approved ON testimonials(is_approved, is_featured);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status, created_at);
CREATE INDEX IF NOT EXISTS idx_site_errors_resolved ON site_errors(resolved, created_at);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON support_tickets(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status, created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_investment_plans_type ON investment_plans(plan_type, is_active);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers for new tables
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_news_posts_updated_at') THEN
        CREATE TRIGGER update_news_posts_updated_at BEFORE UPDATE ON news_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_blog_posts_updated_at') THEN
        CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_ebooks_updated_at') THEN
        CREATE TRIGGER update_ebooks_updated_at BEFORE UPDATE ON ebooks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_testimonials_updated_at') THEN
        CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_payments_updated_at') THEN
        CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_support_tickets_updated_at') THEN
        CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support_tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_investment_plans_updated_at') THEN
        CREATE TRIGGER update_investment_plans_updated_at BEFORE UPDATE ON investment_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Enable RLS on all tables
ALTER TABLE news_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_errors ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_plans ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access
CREATE POLICY "Public can view published news" ON news_posts FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view published blog posts" ON blog_posts FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view published ebooks" ON ebooks FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view approved testimonials" ON testimonials FOR SELECT USING (is_approved = true);
CREATE POLICY "Public can view active investment plans" ON investment_plans FOR SELECT USING (is_active = true);

-- RLS Policies for authenticated users
CREATE POLICY "Users can view their own payments" ON payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own support tickets" ON support_tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create support tickets" ON support_tickets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);

-- Admin policies (assuming admin users have a specific role or table)
CREATE POLICY "Admins can manage all content" ON news_posts FOR ALL USING (
    auth.jwt() ->> 'email' IN (
        SELECT email FROM user_profiles WHERE id = auth.uid() AND (email ILIKE '%admin%' OR email = 'admin@forexsignals.com')
    )
);

CREATE POLICY "Admins can manage all blog posts" ON blog_posts FOR ALL USING (
    auth.jwt() ->> 'email' IN (
        SELECT email FROM user_profiles WHERE id = auth.uid() AND (email ILIKE '%admin%' OR email = 'admin@forexsignals.com')
    )
);

CREATE POLICY "Admins can manage all ebooks" ON ebooks FOR ALL USING (
    auth.jwt() ->> 'email' IN (
        SELECT email FROM user_profiles WHERE id = auth.uid() AND (email ILIKE '%admin%' OR email = 'admin@forexsignals.com')
    )
);

CREATE POLICY "Admins can manage all testimonials" ON testimonials FOR ALL USING (
    auth.jwt() ->> 'email' IN (
        SELECT email FROM user_profiles WHERE id = auth.uid() AND (email ILIKE '%admin%' OR email = 'admin@forexsignals.com')
    )
);

CREATE POLICY "Admins can view all payments" ON payments FOR SELECT USING (
    auth.jwt() ->> 'email' IN (
        SELECT email FROM user_profiles WHERE id = auth.uid() AND (email ILIKE '%admin%' OR email = 'admin@forexsignals.com')
    )
);

CREATE POLICY "Admins can manage all support tickets" ON support_tickets FOR ALL USING (
    auth.jwt() ->> 'email' IN (
        SELECT email FROM user_profiles WHERE id = auth.uid() AND (email ILIKE '%admin%' OR email = 'admin@forexsignals.com')
    )
);

CREATE POLICY "Admins can manage investment plans" ON investment_plans FOR ALL USING (
    auth.jwt() ->> 'email' IN (
        SELECT email FROM user_profiles WHERE id = auth.uid() AND (email ILIKE '%admin%' OR email = 'admin@forexsignals.com')
    )
);

-- Insert default investment plans if none exist
INSERT INTO investment_plans (id, name, description, min_amount, max_amount, roi_percentage, duration_days, plan_type, features)
SELECT 
    'frontend-starter'::uuid,
    'Starter Plan',
    'Perfect for beginners looking to get started with forex trading',
    100,
    999,
    1000,
    1,
    'frontend',
    '["10x return in 24 hours", "Basic trading signals", "Email support", "Mobile app access", "Instant withdrawals"]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM investment_plans WHERE plan_type = 'frontend' AND name = 'Starter Plan');

INSERT INTO investment_plans (id, name, description, min_amount, max_amount, roi_percentage, duration_days, plan_type, features)
SELECT 
    'frontend-professional'::uuid,
    'Professional Plan',
    'For serious investors who want higher returns',
    1000,
    4999,
    1200,
    1,
    'frontend',
    '["12x return in 26 hours", "Premium trading signals", "24/7 support", "Personal account manager", "Risk management tools", "Priority processing"]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM investment_plans WHERE plan_type = 'frontend' AND name = 'Professional Plan');

INSERT INTO investment_plans (id, name, description, min_amount, max_amount, roi_percentage, duration_days, plan_type, features)
SELECT 
    'frontend-premium'::uuid,
    'Premium Plan',
    'Maximum returns for high-volume investors',
    5000,
    50000,
    1500,
    1,
    'frontend',
    '["15x return in 32 hours", "VIP trading signals", "Priority support", "Real-time market alerts", "Dedicated analyst", "Advanced portfolio tools", "Exclusive webinars", "VIP withdrawal service"]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM investment_plans WHERE plan_type = 'frontend' AND name = 'Premium Plan');

-- Dashboard plans
INSERT INTO investment_plans (id, name, description, min_amount, max_amount, roi_percentage, duration_days, plan_type, features, is_featured)
SELECT 
    'dashboard-vip'::uuid,
    'VIP Dashboard Plan',
    'Exclusive plan available only in dashboard',
    2000,
    25000,
    1300,
    1,
    'dashboard',
    '["13x return in 28 hours", "Dashboard exclusive", "VIP signals", "Premium support", "Exclusive analysis", "Higher limits"]'::jsonb,
    true
WHERE NOT EXISTS (SELECT 1 FROM investment_plans WHERE plan_type = 'dashboard' AND name = 'VIP Dashboard Plan');

INSERT INTO investment_plans (id, name, description, min_amount, max_amount, roi_percentage, duration_days, plan_type, features)
SELECT 
    'dashboard-elite'::uuid,
    'Elite Dashboard Plan',
    'Ultimate plan for dashboard users',
    10000,
    100000,
    1400,
    1,
    'dashboard',
    '["14x return in 30 hours", "Elite exclusive", "Custom strategies", "Dedicated manager", "Maximum returns", "Elite support"]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM investment_plans WHERE plan_type = 'dashboard' AND name = 'Elite Dashboard Plan');

-- Create some sample data for testing
INSERT INTO news_posts (title, content, excerpt, is_published, created_at)
SELECT 
    'Welcome to Our New Platform',
    'We are excited to announce the launch of our enhanced forex trading platform with new features and improved user experience.',
    'Announcing the launch of our enhanced forex trading platform',
    true,
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM news_posts WHERE title = 'Welcome to Our New Platform');

INSERT INTO blog_posts (title, slug, content, excerpt, category, is_published, created_at)
SELECT 
    'Getting Started with Forex Trading',
    'getting-started-forex-trading',
    'This comprehensive guide will help you understand the basics of forex trading and how to get started with our platform.',
    'Learn the basics of forex trading and start your journey',
    'education',
    true,
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM blog_posts WHERE slug = 'getting-started-forex-trading');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
