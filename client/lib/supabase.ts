import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if environment variables are set and not placeholder values
const isPlaceholderUrl = !supabaseUrl || supabaseUrl === 'your_supabase_project_url' || supabaseUrl.includes('your_project');
const isPlaceholderKey = !supabaseAnonKey || supabaseAnonKey === 'your_supabase_anon_key' || supabaseAnonKey.includes('your_');

// Create supabase client or dummy client based on configuration
let supabaseClient;

if (isPlaceholderUrl || isPlaceholderKey) {
  console.warn('⚠️ Supabase configuration is incomplete. Using placeholder values.');
  console.group('Configuration Status:');
  console.log('VITE_SUPABASE_URL:', supabaseUrl || 'Missing');
  console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? (supabaseAnonKey.length > 20 ? 'Set' : 'Invalid') : 'Missing');
  console.log('isPlaceholderUrl:', isPlaceholderUrl);
  console.log('isPlaceholderKey:', isPlaceholderKey);
  console.groupEnd();
  
  console.warn('To fix this:');
  console.warn('1. Create a Supabase project at https://supabase.com');
  console.warn('2. Update your .env file with the correct values');
  console.warn('3. Restart the development server');

  // Create a dummy client that will fail gracefully instead of throwing immediately
  supabaseClient = {
    auth: {
      signUp: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      signOut: () => Promise.resolve({ error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: { message: 'Supabase not configured' } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    },
    from: () => ({
      select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured', code: 'CONFIGURATION_ERROR' } }) }) }),
      insert: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured', code: 'CONFIGURATION_ERROR' } }),
      update: () => ({ eq: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured', code: 'CONFIGURATION_ERROR' } }) }) }) }),
      upsert: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured', code: 'CONFIGURATION_ERROR' } }),
      delete: () => ({ eq: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured', code: 'CONFIGURATION_ERROR' } }) })
    })
  };
} else {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
}

// @ts-ignore - Supabase client type compatibility
export const supabase = supabaseClient;
