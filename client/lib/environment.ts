// Environment configuration for dual database setup
export const ENV = {
  // Supabase Configuration
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  
  // Neon Configuration
  NEON_DATABASE_URL: import.meta.env.VITE_NEON_DATABASE_URL,
  
  // Database Selection
  USE_NEON: import.meta.env.VITE_USE_NEON === 'true',
  
  // Application Settings
  APP_URL: import.meta.env.VITE_APP_URL || window.location.origin,
  
  // Features
  ENABLE_DUAL_DATABASE: import.meta.env.VITE_ENABLE_DUAL_DATABASE === 'true',
  
  // Development
  DEV_MODE: import.meta.env.DEV,
} as const;

// Validate required environment variables
export function validateEnvironment() {
  const errors: string[] = [];
  
  if (!ENV.SUPABASE_URL) {
    errors.push('VITE_SUPABASE_URL is required');
  }
  
  if (!ENV.SUPABASE_ANON_KEY) {
    errors.push('VITE_SUPABASE_ANON_KEY is required');
  }
  
  // Check for valid Neon URL (not placeholder)
  const isValidNeonUrl = ENV.NEON_DATABASE_URL &&
    ENV.NEON_DATABASE_URL !== 'your_neon_database_connection_string' &&
    ENV.NEON_DATABASE_URL.startsWith('postgresql://');

  if (ENV.USE_NEON && !isValidNeonUrl) {
    errors.push('VITE_NEON_DATABASE_URL must be a valid PostgreSQL connection string when USE_NEON is true');
  }
  
  if (errors.length > 0) {
    console.error('Environment validation failed:', errors);
    throw new Error(`Missing required environment variables: ${errors.join(', ')}`);
  }
  
  return true;
}

// Get current database info
export function getDatabaseInfo() {
  const isValidNeonUrl = ENV.NEON_DATABASE_URL &&
    ENV.NEON_DATABASE_URL !== 'your_neon_database_connection_string' &&
    ENV.NEON_DATABASE_URL.startsWith('postgresql://');

  const neonConfigured = !!isValidNeonUrl;
  const supabaseConfigured = !!(ENV.SUPABASE_URL && ENV.SUPABASE_ANON_KEY);

  // Use Neon only if properly configured and requested
  const actuallyUseNeon = ENV.USE_NEON && neonConfigured;

  return {
    active: actuallyUseNeon ? 'Neon' : 'Supabase',
    dualEnabled: ENV.ENABLE_DUAL_DATABASE,
    supabaseConfigured,
    neonConfigured,
  };
}
