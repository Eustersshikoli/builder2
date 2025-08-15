import { supabase } from '@/integrations/supabase/client';
import { executeNeonQuery, sql } from './neon';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  username?: string;
  phone_number?: string;
  country?: string;
  country_code?: string;
  date_of_birth?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  occupation?: string;
  experience_level?: string;
  is_verified?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface UserBalance {
  id: string;
  user_id: string;
  balance: number;
  currency: string;
  created_at?: string;
  updated_at?: string;
}

export interface Investment {
  id: string;
  user_id: string;
  plan_id: string;
  amount: number;
  expected_return: number;
  actual_return?: number;
  status: 'active' | 'completed' | 'cancelled';
  start_date: string;
  end_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'deposit' | 'withdrawal' | 'investment' | 'return' | 'referral_commission';
  amount: number;
  currency: string;
  reference_id?: string;
  description?: string;
  status: 'pending' | 'completed' | 'failed';
  created_at?: string;
}

class DualDatabaseService {
  private useNeon: boolean = false;

  constructor() {
    // Check if Neon should be used and is available
    const shouldUseNeon = import.meta.env.VITE_USE_NEON === 'true';
    const neonAvailable = sql !== null;

    if (shouldUseNeon && !neonAvailable) {
      console.warn('Neon database requested but not available, falling back to Supabase');
      this.useNeon = false;
    } else {
      this.useNeon = shouldUseNeon && neonAvailable;
    }
  }

  // Toggle between databases
  setUseNeon(useNeon: boolean) {
    if (useNeon && !sql) {
      console.warn('Cannot switch to Neon: database not configured');
      return false;
    }
    this.useNeon = useNeon;
    return true;
  }

  getActiveDatabase() {
    return this.useNeon ? 'Neon' : 'Supabase';
  }

  // =====================================================
  // USER PROFILE OPERATIONS
  // =====================================================

  async createUserProfile(profile: Omit<UserProfile, 'created_at' | 'updated_at'>): Promise<UserProfile | null> {
    try {
      if (this.useNeon) {
        const result = await sql`
          INSERT INTO user_profiles (
            id, email, full_name, username, phone_number, country, 
            country_code, date_of_birth, address, city, postal_code, 
            occupation, experience_level, is_verified
          ) VALUES (
            ${profile.id}, ${profile.email}, ${profile.full_name || null}, 
            ${profile.username || null}, ${profile.phone_number || null}, 
            ${profile.country || null}, ${profile.country_code || null}, 
            ${profile.date_of_birth || null}, ${profile.address || null}, 
            ${profile.city || null}, ${profile.postal_code || null}, 
            ${profile.occupation || null}, ${profile.experience_level || null}, 
            ${profile.is_verified || false}
          ) RETURNING *
        `;
        return result[0] as UserProfile;
      } else {
        const { data, error } = await supabase
          .from('user_profiles')
          .insert(profile)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    } catch (error) {
      console.error('Error creating user profile:', {
        database: this.getActiveDatabase(),
        message: error instanceof Error ? error.message : 'Unknown error',
        profile: { ...profile, id: profile.id.substring(0, 8) + '...' }
      });
      throw error;
    }
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      if (this.useNeon) {
        const result = await sql`
          SELECT * FROM user_profiles WHERE id = ${userId}
        `;
        return result[0] as UserProfile || null;
      } else {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        return data;
      }
    } catch (error) {
      console.error('Error getting user profile:', {
        database: this.getActiveDatabase(),
        message: error instanceof Error ? error.message : 'Unknown error',
        userId: userId.substring(0, 8) + '...'
      });
      throw error;
    }
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      if (this.useNeon) {
        const updateFields = Object.keys(updates)
          .filter(key => key !== 'id' && updates[key as keyof UserProfile] !== undefined)
          .map(key => `${key} = $${Object.keys(updates).indexOf(key) + 2}`)
          .join(', ');
        
        const values = [userId, ...Object.values(updates).filter(val => val !== undefined)];
        const result = await executeNeonQuery(
          `UPDATE user_profiles SET ${updateFields}, updated_at = NOW() WHERE id = $1 RETURNING *`,
          values
        );
        return result[0] as UserProfile || null;
      } else {
        const { data, error } = await supabase
          .from('user_profiles')
          .update(updates)
          .eq('id', userId)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    } catch (error) {
      console.error('Error updating user profile:', {
        database: this.getActiveDatabase(),
        message: error instanceof Error ? error.message : 'Unknown error',
        userId: userId.substring(0, 8) + '...',
        updates
      });
      throw error;
    }
  }

  // =====================================================
  // USER BALANCE OPERATIONS
  // =====================================================

  async createUserBalance(balance: Omit<UserBalance, 'id' | 'created_at' | 'updated_at'>): Promise<UserBalance | null> {
    try {
      if (this.useNeon) {
        const result = await sql`
          INSERT INTO user_balances (user_id, balance, currency)
          VALUES (${balance.user_id}, ${balance.balance}, ${balance.currency})
          ON CONFLICT (user_id, currency) 
          DO UPDATE SET balance = user_balances.balance + ${balance.balance}
          RETURNING *
        `;
        return result[0] as UserBalance;
      } else {
        const { data, error } = await supabase
          .from('user_balances')
          .insert(balance)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    } catch (error) {
      console.error('Error creating user balance:', {
        database: this.getActiveDatabase(),
        message: error instanceof Error ? error.message : 'Unknown error',
        balance
      });
      throw error;
    }
  }

  async getUserBalance(userId: string, currency: string = 'USD'): Promise<UserBalance | null> {
    try {
      if (this.useNeon) {
        const result = await sql`
          SELECT * FROM user_balances WHERE user_id = ${userId} AND currency = ${currency}
        `;
        return result[0] as UserBalance || null;
      } else {
        const { data, error } = await supabase
          .from('user_balances')
          .select('*')
          .eq('user_id', userId)
          .eq('currency', currency)
          .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        return data;
      }
    } catch (error) {
      console.error('Error getting user balance:', {
        database: this.getActiveDatabase(),
        message: error instanceof Error ? error.message : 'Unknown error',
        userId: userId.substring(0, 8) + '...',
        currency
      });
      throw error;
    }
  }

  async updateUserBalance(userId: string, amount: number, currency: string = 'USD'): Promise<UserBalance | null> {
    try {
      if (this.useNeon) {
        const result = await sql`
          UPDATE user_balances 
          SET balance = balance + ${amount}, updated_at = NOW()
          WHERE user_id = ${userId} AND currency = ${currency}
          RETURNING *
        `;
        return result[0] as UserBalance || null;
      } else {
        // First get current balance
        const current = await this.getUserBalance(userId, currency);
        if (!current) {
          return await this.createUserBalance({ user_id: userId, balance: amount, currency });
        }
        
        const { data, error } = await supabase
          .from('user_balances')
          .update({ balance: current.balance + amount })
          .eq('user_id', userId)
          .eq('currency', currency)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    } catch (error) {
      console.error('Error updating user balance:', {
        database: this.getActiveDatabase(),
        message: error instanceof Error ? error.message : 'Unknown error',
        userId: userId.substring(0, 8) + '...',
        amount,
        currency
      });
      throw error;
    }
  }

  // =====================================================
  // TRANSACTION OPERATIONS
  // =====================================================

  async createTransaction(transaction: Omit<Transaction, 'id' | 'created_at'>): Promise<Transaction | null> {
    try {
      if (this.useNeon) {
        const result = await sql`
          INSERT INTO transactions (
            user_id, type, amount, currency, reference_id, description, status
          ) VALUES (
            ${transaction.user_id}, ${transaction.type}, ${transaction.amount},
            ${transaction.currency}, ${transaction.reference_id || null},
            ${transaction.description || null}, ${transaction.status}
          ) RETURNING *
        `;
        return result[0] as Transaction;
      } else {
        const { data, error } = await supabase
          .from('transactions')
          .insert(transaction)
          .select()
          .single();
        
        if (error) throw error;
        return {
          ...data,
          type: data.type as "deposit" | "withdrawal" | "investment" | "return" | "referral_commission"
        } as Transaction;
      }
    } catch (error) {
      console.error('Error creating transaction:', {
        database: this.getActiveDatabase(),
        message: error instanceof Error ? error.message : 'Unknown error',
        transaction
      });
      throw error;
    }
  }

  async getUserTransactions(userId: string, limit: number = 50): Promise<Transaction[]> {
    try {
      if (this.useNeon) {
        const result = await sql`
          SELECT * FROM transactions 
          WHERE user_id = ${userId}
          ORDER BY created_at DESC
          LIMIT ${limit}
        `;
        return result as Transaction[];
      } else {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(limit);
        
        if (error) throw error;
        return (data || []).map((transaction: any) => ({
          ...transaction,
          type: transaction.type as "deposit" | "withdrawal" | "investment" | "return" | "referral_commission"
        })) as Transaction[];
      }
    } catch (error) {
      console.error('Error getting user transactions:', {
        database: this.getActiveDatabase(),
        message: error instanceof Error ? error.message : 'Unknown error',
        userId: userId.substring(0, 8) + '...',
        limit
      });
      throw error;
    }
  }

  // =====================================================
  // INVESTMENT OPERATIONS
  // =====================================================

  async createInvestment(investment: Omit<Investment, 'id' | 'created_at' | 'updated_at'>): Promise<Investment | null> {
    try {
      if (this.useNeon) {
        const result = await sql`
          INSERT INTO user_investments (
            user_id, plan_id, amount, expected_return, actual_return, 
            status, start_date, end_date
          ) VALUES (
            ${investment.user_id}, ${investment.plan_id}, ${investment.amount},
            ${investment.expected_return}, ${investment.actual_return || null},
            ${investment.status}, ${investment.start_date}, ${investment.end_date || null}
          ) RETURNING *
        `;
        return result[0] as Investment;
      } else {
        const { data, error } = await supabase
          .from('user_investments')
          .insert(investment)
          .select()
          .single();
        
        if (error) throw error;
        return {
          ...data,
          status: data.status as "active" | "completed" | "cancelled"
        } as Investment;
      }
    } catch (error) {
      console.error('Error creating investment:', {
        database: this.getActiveDatabase(),
        message: error instanceof Error ? error.message : 'Unknown error',
        investment
      });
      throw error;
    }
  }

  async getUserInvestments(userId: string): Promise<Investment[]> {
    try {
      if (this.useNeon) {
        const result = await sql`
          SELECT ui.*, ip.name as plan_name, ip.roi_percentage, ip.duration_days
          FROM user_investments ui
          JOIN investment_plans ip ON ui.plan_id = ip.id
          WHERE ui.user_id = ${userId}
          ORDER BY ui.created_at DESC
        `;
        return result as Investment[];
      } else {
        const { data, error } = await supabase
          .from('user_investments')
          .select(`
            *,
            investment_plans (
              name,
              roi_percentage,
              duration_days
            )
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return (data || []).map((investment: any) => ({
          ...investment,
          status: investment.status as "active" | "completed" | "cancelled",
          plan_name: investment.investment_plans?.name || 'Unknown Plan'
        })) as Investment[];
      }
    } catch (error) {
      console.error('Error getting user investments:', {
        database: this.getActiveDatabase(),
        message: error instanceof Error ? error.message : 'Unknown error',
        userId: userId.substring(0, 8) + '...'
      });
      throw error;
    }
  }

  // =====================================================
  // AUTHENTICATION HELPERS
  // =====================================================

  async getUserByUsername(username: string): Promise<UserProfile | null> {
    try {
      if (this.useNeon) {
        const result = await sql`
          SELECT * FROM user_profiles WHERE username = ${username}
        `;
        return result[0] as UserProfile || null;
      } else {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('username', username)
          .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        return data;
      }
    } catch (error) {
      console.error('Error getting user by username:', {
        database: this.getActiveDatabase(),
        message: error instanceof Error ? error.message : 'Unknown error',
        username
      });
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<UserProfile | null> {
    try {
      if (this.useNeon) {
        const result = await sql`
          SELECT * FROM user_profiles WHERE email = ${email}
        `;
        return result[0] as UserProfile || null;
      } else {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('email', email)
          .maybeSingle();
        
        if (error) throw error;
        return data;
      }
    } catch (error) {
      console.error('Error getting user by email:', {
        database: this.getActiveDatabase(),
        message: error instanceof Error ? error.message : 'Unknown error',
        email
      });
      return null; // Return null instead of throwing, so validation can proceed
    }
  }

  // =====================================================
  // DATABASE STATUS & SETUP
  // =====================================================

  async testConnection(): Promise<boolean> {
    try {
      if (this.useNeon) {
        if (!sql) {
          console.warn('Neon connection test failed: database not configured');
          return false;
        }
        const result = await sql`SELECT NOW() as timestamp`;
        return !!result[0];
      } else {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('count')
          .limit(1);

        return !error;
      }
    } catch (error) {
      console.error('Database connection test failed:', {
        database: this.getActiveDatabase(),
        message: error instanceof Error ? error.message : 'Unknown error'
      });
      return false;
    }
  }

  async initializeMissingUserData(userId: string, email: string): Promise<{ profile: UserProfile | null; balance: UserBalance | null }> {
    try {
      // Check if profile exists
      let profile = await this.getUserProfile(userId);
      
      // Create profile if missing
      if (!profile) {
        profile = await this.createUserProfile({
          id: userId,
          email: email,
          is_verified: false
        });
      }

      // Check if balance exists
      let balance = await this.getUserBalance(userId);
      
      // Create balance if missing
      if (!balance) {
        balance = await this.createUserBalance({
          user_id: userId,
          balance: 0,
          currency: 'USD'
        });
      }

      return { profile, balance };
    } catch (error) {
      console.error('Error initializing user data:', {
        database: this.getActiveDatabase(),
        message: error instanceof Error ? error.message : 'Unknown error',
        userId: userId.substring(0, 8) + '...',
        email
      });
      throw error;
    }
  }
}

// Export singleton instance
export const dualDb = new DualDatabaseService();
