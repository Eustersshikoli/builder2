import { supabase } from "@/integrations/supabase/client";

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'super_admin';
}

class AdminAuthService {
  /**
   * Admin login with email and password
   */
  async adminLogin(email: string, password: string): Promise<{ user: AdminUser | null; error: string | null }> {
    try {
      // First try regular Supabase auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        return { user: null, error: authError.message };
      }

      if (!authData.user) {
        return { user: null, error: "Authentication failed" };
      }

      // Check if user has admin role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', authData.user.id)
        .in('role', ['admin', 'super_admin'])
        .single();

      if (roleError || !roleData) {
        // Sign out the user if they're not an admin
        await supabase.auth.signOut();
        return { user: null, error: "Access denied. Admin privileges required." };
      }

      const adminUser: AdminUser = {
        id: authData.user.id,
        email: authData.user.email || email,
        role: roleData.role as 'admin' | 'super_admin'
      };

      return { user: adminUser, error: null };
    } catch (error) {
      return { 
        user: null, 
        error: error instanceof Error ? error.message : "Login failed" 
      };
    }
  }

  /**
   * Create a regular user account
   */
  async createUser(email: string, password: string, userData: any = {}): Promise<{ user: any | null; error: string | null }> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: userData
        }
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (data.user) {
        // Assign default user role
        await supabase.from('user_roles').insert({
          user_id: data.user.id,
          role: 'user'
        });
      }

      return { user: data.user, error: null };
    } catch (error) {
      return { 
        user: null, 
        error: error instanceof Error ? error.message : "Signup failed" 
      };
    }
  }

  /**
   * Sign out admin
   */
  async signOut(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      return { error: error ? error.message : null };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Signout failed" };
    }
  }
}

export const adminAuth = new AdminAuthService();