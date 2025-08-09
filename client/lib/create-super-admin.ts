import { supabase } from "@/integrations/supabase/client";

export const createSuperAdmin = async (userId: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('user-management', {
      body: {
        action: 'create_super_admin',
        userId: userId
      }
    });

    if (error) {
      console.error('Error creating super admin:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error creating super admin:', error);
    return { success: false, error: 'Failed to create super admin' };
  }
};

export const assignUserRole = async (userId: string, role: 'admin' | 'super_admin' | 'user') => {
  try {
    const { data, error } = await supabase.functions.invoke('user-management', {
      body: {
        action: 'assign_role',
        userId: userId,
        role: role
      }
    });

    if (error) {
      console.error('Error assigning role:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error assigning role:', error);
    return { success: false, error: 'Failed to assign role' };
  }
};