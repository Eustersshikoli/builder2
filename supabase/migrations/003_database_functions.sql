-- =====================================================
-- Database Functions for Business Logic
-- =====================================================

-- Function to add balance to user account
CREATE OR REPLACE FUNCTION add_to_balance(user_id UUID, amount DECIMAL)
RETURNS BOOLEAN AS $$
BEGIN
    -- Insert or update user balance
    INSERT INTO user_balances (user_id, balance, currency)
    VALUES (user_id, amount, 'USD')
    ON CONFLICT (user_id, currency)
    DO UPDATE SET 
        balance = user_balances.balance + amount,
        updated_at = NOW();
    
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to subtract balance from user account
CREATE OR REPLACE FUNCTION subtract_from_balance(user_id UUID, amount DECIMAL)
RETURNS BOOLEAN AS $$
DECLARE
    current_balance DECIMAL;
BEGIN
    -- Get current balance
    SELECT balance INTO current_balance
    FROM user_balances
    WHERE user_balances.user_id = subtract_from_balance.user_id
    AND currency = 'USD';
    
    -- Check if sufficient balance
    IF current_balance IS NULL OR current_balance < amount THEN
        RETURN FALSE;
    END IF;
    
    -- Update balance
    UPDATE user_balances
    SET balance = balance - amount,
        updated_at = NOW()
    WHERE user_balances.user_id = subtract_from_balance.user_id
    AND currency = 'USD';
    
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create investment
CREATE OR REPLACE FUNCTION create_investment(
    p_user_id UUID,
    p_plan_id UUID,
    p_amount DECIMAL
)
RETURNS UUID AS $$
DECLARE
    investment_id UUID;
    plan_roi DECIMAL;
    expected_return DECIMAL;
BEGIN
    -- Get plan ROI
    SELECT roi_percentage INTO plan_roi
    FROM investment_plans
    WHERE id = p_plan_id;
    
    IF plan_roi IS NULL THEN
        RAISE EXCEPTION 'Investment plan not found';
    END IF;
    
    -- Calculate expected return
    expected_return := p_amount * (1 + plan_roi / 100);
    
    -- Check if user has sufficient balance
    IF NOT subtract_from_balance(p_user_id, p_amount) THEN
        RAISE EXCEPTION 'Insufficient balance';
    END IF;
    
    -- Create investment record
    INSERT INTO user_investments (user_id, plan_id, amount, expected_return)
    VALUES (p_user_id, p_plan_id, p_amount, expected_return)
    RETURNING id INTO investment_id;
    
    -- Create transaction record
    INSERT INTO transactions (user_id, type, amount, reference_id, description)
    VALUES (p_user_id, 'investment', -p_amount, investment_id, 'Investment created');
    
    RETURN investment_id;
EXCEPTION
    WHEN OTHERS THEN
        RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to complete investment and add returns
CREATE OR REPLACE FUNCTION complete_investment(p_investment_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    investment_record RECORD;
BEGIN
    -- Get investment details
    SELECT * INTO investment_record
    FROM user_investments
    WHERE id = p_investment_id
    AND status = 'active';
    
    IF investment_record IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Update investment status
    UPDATE user_investments
    SET status = 'completed',
        actual_return = expected_return,
        end_date = NOW(),
        updated_at = NOW()
    WHERE id = p_investment_id;
    
    -- Add return to user balance
    IF add_to_balance(investment_record.user_id, investment_record.expected_return) THEN
        -- Create transaction record for return
        INSERT INTO transactions (user_id, type, amount, reference_id, description)
        VALUES (
            investment_record.user_id, 
            'return', 
            investment_record.expected_return, 
            p_investment_id, 
            'Investment return'
        );
        
        RETURN TRUE;
    END IF;
    
    RETURN FALSE;
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to process referral commission
CREATE OR REPLACE FUNCTION process_referral_commission(
    p_referred_user_id UUID,
    p_investment_amount DECIMAL
)
RETURNS BOOLEAN AS $$
DECLARE
    referrer_id UUID;
    commission_rate DECIMAL;
    commission_amount DECIMAL;
BEGIN
    -- Find referrer
    SELECT r.referrer_id, r.commission_rate
    INTO referrer_id, commission_rate
    FROM referrals r
    WHERE r.referred_id = p_referred_user_id
    AND r.status = 'active';
    
    IF referrer_id IS NULL THEN
        RETURN TRUE; -- No referrer, nothing to do
    END IF;
    
    -- Calculate commission
    commission_amount := p_investment_amount * (commission_rate / 100);
    
    -- Add commission to referrer balance
    IF add_to_balance(referrer_id, commission_amount) THEN
        -- Update total commission earned
        UPDATE referrals
        SET total_commission_earned = total_commission_earned + commission_amount
        WHERE referrer_id = process_referral_commission.referrer_id
        AND referred_id = p_referred_user_id;
        
        -- Create transaction record
        INSERT INTO transactions (user_id, type, amount, reference_id, description)
        VALUES (
            referrer_id,
            'referral_commission',
            commission_amount,
            p_referred_user_id,
            'Referral commission'
        );
        
        RETURN TRUE;
    END IF;
    
    RETURN FALSE;
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user statistics
CREATE OR REPLACE FUNCTION get_user_stats(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
    user_stats JSON;
BEGIN
    WITH stats AS (
        SELECT 
            COALESCE(ub.balance, 0) as balance,
            COALESCE(SUM(CASE WHEN ui.status = 'active' THEN ui.amount ELSE 0 END), 0) as total_invested,
            COALESCE(SUM(CASE WHEN ui.status = 'completed' THEN ui.actual_return - ui.amount ELSE 0 END), 0) as total_profit,
            COUNT(CASE WHEN ui.status = 'active' THEN 1 END) as active_investments,
            COUNT(CASE WHEN ui.status = 'completed' THEN 1 END) as completed_investments,
            COALESCE(r.total_commission_earned, 0) as referral_earnings
        FROM user_balances ub
        FULL OUTER JOIN user_investments ui ON ub.user_id = ui.user_id
        LEFT JOIN (
            SELECT referrer_id, SUM(total_commission_earned) as total_commission_earned
            FROM referrals
            WHERE referrer_id = p_user_id
            GROUP BY referrer_id
        ) r ON ub.user_id = r.referrer_id
        WHERE ub.user_id = p_user_id OR ui.user_id = p_user_id
        GROUP BY ub.balance, r.total_commission_earned
    )
    SELECT row_to_json(stats) INTO user_stats FROM stats;
    
    RETURN COALESCE(user_stats, '{"balance":0,"total_invested":0,"total_profit":0,"active_investments":0,"completed_investments":0,"referral_earnings":0}'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to auto-complete investments after 24 hours
CREATE OR REPLACE FUNCTION auto_complete_investments()
RETURNS INTEGER AS $$
DECLARE
    completed_count INTEGER := 0;
    investment_record RECORD;
BEGIN
    -- Find investments older than 24 hours
    FOR investment_record IN
        SELECT id
        FROM user_investments
        WHERE status = 'active'
        AND start_date < NOW() - INTERVAL '24 hours'
    LOOP
        IF complete_investment(investment_record.id) THEN
            completed_count := completed_count + 1;
        END IF;
    END LOOP;
    
    RETURN completed_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION add_to_balance(UUID, DECIMAL) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION subtract_from_balance(UUID, DECIMAL) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION create_investment(UUID, UUID, DECIMAL) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION complete_investment(UUID) TO service_role;
GRANT EXECUTE ON FUNCTION process_referral_commission(UUID, DECIMAL) TO service_role;
GRANT EXECUTE ON FUNCTION get_user_stats(UUID) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION auto_complete_investments() TO service_role;
