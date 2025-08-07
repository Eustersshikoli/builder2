-- =====================================================
-- SEED DATA FOR FOREX SIGNALS PLATFORM
-- =====================================================

-- =====================================================
-- INVESTMENT PLANS
-- =====================================================

INSERT INTO investment_plans (id, name, description, min_amount, max_amount, roi_percentage, duration_hours, is_active) VALUES
(uuid_generate_v4(), 'Starter Plan', 'Perfect for beginners looking to start their forex investment journey', 100.00, 999.99, 2500.00, 24, true),
(uuid_generate_v4(), 'Standard Plan', 'Ideal for intermediate investors seeking higher returns', 1000.00, 4999.99, 400.00, 72, true),
(uuid_generate_v4(), 'Premium Plan', 'Advanced plan for experienced investors with maximum returns', 5000.00, 19999.99, 550.00, 168, true),
(uuid_generate_v4(), 'VIP Plan', 'Exclusive plan for high-value investors', 20000.00, NULL, 650.00, 336, true),
(uuid_generate_v4(), 'Flash Deal', 'Limited time offer with exceptional returns', 200.00, 500.00, 2500.00, 24, true),
(uuid_generate_v4(), 'Weekend Special', 'Weekend exclusive investment opportunity', 500.00, 2000.00, 2500.00, 48, true)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- FOREX SIGNALS (SAMPLE DATA)
-- =====================================================

INSERT INTO forex_signals (id, pair, action, entry_price, stop_loss, take_profit, confidence, status) VALUES
(uuid_generate_v4(), 'EUR/USD', 'BUY', 1.0845, 1.0825, 1.0885, 'High', 'active'),
(uuid_generate_v4(), 'GBP/JPY', 'SELL', 189.75, 190.25, 188.90, 'Very High', 'profit'),
(uuid_generate_v4(), 'USD/CAD', 'BUY', 1.3520, 1.3495, 1.3565, 'High', 'profit'),
(uuid_generate_v4(), 'AUD/USD', 'SELL', 0.6720, 0.6740, 0.6680, 'Medium', 'active'),
(uuid_generate_v4(), 'USD/JPY', 'BUY', 149.50, 149.00, 150.20, 'High', 'active')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- TESTIMONIALS
-- =====================================================

INSERT INTO testimonials (id, name, role, content, rating, avatar_url, is_verified, is_featured, status) VALUES
(uuid_generate_v4(), 'Sarah Mitchell', 'Verified Trader', 'I started with just $100 and couldn''t believe when I got $2,500 back in 24 hours! This platform changed my life. The signals are incredibly accurate and the support team is amazing.', 5, NULL, true, true, 'approved'),
(uuid_generate_v4(), 'David Chen', 'Professional Trader', 'Best forex signals channel on Telegram! 87% win rate is not a joke. I''ve been following for 6 months and my portfolio is up 340%. Highly recommended!', 5, NULL, true, true, 'approved'),
(uuid_generate_v4(), 'Maria Rodriguez', 'Investment Manager', 'Amazing platform! I''ve earned $12,500 from a $1,000 investment in just 3 days. Professional service and excellent customer support.', 5, NULL, true, true, 'approved'),
(uuid_generate_v4(), 'James Wilson', 'Forex Enthusiast', 'The Telegram signals are spot on. I''ve been trading for years but never seen such consistent results. The 24-hour returns are incredible!', 5, NULL, true, false, 'approved'),
(uuid_generate_v4(), 'Emma Thompson', 'New Investor', 'As a beginner, I was nervous about investing. But the support team guided me through everything and I made my first profit of $2,500 in just one day!', 5, NULL, true, false, 'approved'),
(uuid_generate_v4(), 'Robert Kim', 'Day Trader', 'Professional setup, transparent processes, and amazing returns. The investment plans are well structured and the platform is user-friendly.', 4, NULL, true, false, 'approved')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- BLOG POSTS
-- =====================================================

INSERT INTO blog_posts (id, title, slug, content, excerpt, status, tags, published_at) VALUES
(uuid_generate_v4(), 'Getting Started with Forex Trading', 'getting-started-forex-trading', 
'<h2>Introduction to Forex Trading</h2>
<p>Forex trading, also known as foreign exchange trading, is the process of buying and selling currencies to profit from changes in their exchange rates. With our platform, you can start your forex journey with expert signals and guidance.</p>

<h3>Why Choose Our Forex Signals?</h3>
<ul>
<li>87% win rate backed by professional analysis</li>
<li>Real-time signals delivered via Telegram</li>
<li>Expert risk management included</li>
<li>24/7 customer support</li>
</ul>

<h3>How to Get Started</h3>
<ol>
<li>Join our free Telegram channel</li>
<li>Create your account on our platform</li>
<li>Start with our Starter Plan ($100 minimum)</li>
<li>Follow our expert signals</li>
<li>Watch your profits grow!</li>
</ol>

<p>Our proven track record speaks for itself. Join thousands of successful traders who trust our signals for consistent profits.</p>',
'Learn how to start your forex trading journey with our expert signals and achieve consistent profits.',
'published',
'["forex", "trading", "beginners", "signals"]',
NOW() - INTERVAL ''7 days''),

(uuid_generate_v4(), 'Understanding Risk Management in Forex', 'risk-management-forex',
'<h2>The Importance of Risk Management</h2>
<p>Risk management is crucial for successful forex trading. Our signals always include stop loss and take profit levels to protect your capital.</p>

<h3>Key Risk Management Principles</h3>
<ul>
<li>Never risk more than you can afford to lose</li>
<li>Always set stop loss orders</li>
<li>Diversify your trading portfolio</li>
<li>Follow professional signals with proven track records</li>
</ul>

<h3>Our Risk Management Features</h3>
<p>Every signal we provide includes:</p>
<ul>
<li>Clear entry points</li>
<li>Stop loss levels</li>
<li>Take profit targets</li>
<li>Risk assessment</li>
</ul>',
'Master the art of risk management in forex trading with our comprehensive guide and expert signals.',
'published',
'["risk management", "forex", "trading tips"]',
NOW() - INTERVAL ''5 days''),

(uuid_generate_v4(), 'Top 5 Currency Pairs for Beginners', 'top-currency-pairs-beginners',
'<h2>Best Currency Pairs for New Traders</h2>
<p>Starting with the right currency pairs can make a significant difference in your trading success. Here are our top recommendations for beginners.</p>

<h3>1. EUR/USD (Euro/US Dollar)</h3>
<p>The most liquid and widely traded currency pair in the world. Known for its predictable movements and tight spreads.</p>

<h3>2. GBP/USD (British Pound/US Dollar)</h3>
<p>Offers good volatility and numerous trading opportunities throughout the day.</p>

<h3>3. USD/JPY (US Dollar/Japanese Yen)</h3>
<p>Popular Asian session pair with consistent trends and reliable technical analysis patterns.</p>

<h3>4. AUD/USD (Australian Dollar/US Dollar)</h3>
<p>Commodity-linked currency that responds well to market sentiment and economic news.</p>

<h3>5. USD/CAD (US Dollar/Canadian Dollar)</h3>
<p>Stable pair with good correlation to oil prices and North American economic data.</p>',
'Discover the best currency pairs for beginners and start trading with confidence using our expert signals.',
'published',
'["currency pairs", "beginners", "forex basics"]',
NOW() - INTERVAL ''3 days'')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- NEWS ARTICLES
-- =====================================================

INSERT INTO news_articles (id, title, slug, content, excerpt, status, category, tags, published_at) VALUES
(uuid_generate_v4(), 'Federal Reserve Signals Potential Rate Cuts', 'fed-signals-rate-cuts',
'<h2>Fed Chair Hints at Dovish Policy Shift</h2>
<p>In recent statements, Federal Reserve Chair Jerome Powell has indicated that the central bank may consider interest rate cuts in the coming months, citing concerns about global economic slowdown and inflation targets.</p>

<h3>Market Impact</h3>
<p>This announcement has significant implications for forex markets:</p>
<ul>
<li>USD may weaken against major currencies</li>
<li>Increased volatility expected in USD pairs</li>
<li>Opportunity for strategic positioning</li>
</ul>

<h3>Trading Opportunities</h3>
<p>Our signals will help you navigate this changing landscape with precision entries and exits. Join our Telegram channel for real-time updates on how to capitalize on these market movements.</p>',
'Federal Reserve hints at dovish policy shift, creating new opportunities in forex markets.',
'published',
'Market News',
'["federal reserve", "interest rates", "USD", "market analysis"]',
NOW() - INTERVAL ''2 days''),

(uuid_generate_v4(), 'European Central Bank Maintains Aggressive Stance', 'ecb-aggressive-stance',
'<h2>ECB Holds Rates Steady Amid Inflation Concerns</h2>
<p>The European Central Bank has decided to maintain its current interest rate policy, signaling continued commitment to fighting inflation despite economic headwinds.</p>

<h3>Key Takeaways</h3>
<ul>
<li>Interest rates remain unchanged at current levels</li>
<li>ECB emphasizes inflation-fighting mandate</li>
<li>EUR strength expected to continue</li>
</ul>

<h3>Trading Strategy</h3>
<p>This hawkish stance from the ECB creates excellent opportunities for EUR-based pairs. Our expert analysis and signals will help you capitalize on these movements.</p>',
'ECB maintains hawkish policy stance, supporting EUR strength across major pairs.',
'published',
'Central Banks',
'["ECB", "interest rates", "EUR", "inflation"]',
NOW() - INTERVAL ''1 day''),

(uuid_generate_v4(), 'Asian Markets Rally on China Economic Data', 'asian-markets-rally-china',
'<h2>Strong Chinese Manufacturing Data Boosts Asian Currencies</h2>
<p>Positive manufacturing PMI data from China has sparked a rally across Asian currencies, with particular strength seen in AUD, NZD, and JPY pairs.</p>

<h3>Market Reaction</h3>
<p>The stronger-than-expected data has led to:</p>
<ul>
<li>AUD/USD breaking key resistance levels</li>
<li>USD/JPY showing bearish momentum</li>
<li>Commodity currencies gaining strength</li>
</ul>

<h3>Trading Focus</h3>
<p>Our signals are actively tracking these developments, providing precise entry and exit points for maximum profit potential.</p>',
'Chinese economic data drives Asian currency rally, creating new trading opportunities.',
'published',
'Market Analysis',
'["China", "Asian markets", "AUD", "JPY", "economic data"]',
NOW())
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- DEFAULT ADMIN USER (will be created via enhanced auth)
-- =====================================================

-- Note: Admin users will be created through the enhanced auth system
-- This ensures proper password hashing and dual database support
