import { neon } from '@neondatabase/serverless';

const neonUrl = import.meta.env.VITE_NEON_DATABASE_URL;

// Check if Neon URL is properly configured (not placeholder or missing)
const isValidNeonUrl = neonUrl &&
  neonUrl !== 'your_neon_database_connection_string' &&
  neonUrl.startsWith('postgresql://');

if (!isValidNeonUrl) {
  console.warn('Neon database not configured:', {
    VITE_NEON_DATABASE_URL: neonUrl ? 'Invalid/Placeholder' : 'Missing',
    message: 'Neon features will be disabled'
  });
}

// Only initialize Neon client if properly configured
export const sql = isValidNeonUrl ? neon(neonUrl) : null;

// Helper function to execute Neon queries
export async function executeNeonQuery<T = any>(
  query: string,
  params: any[] = []
): Promise<T[]> {
  if (!sql) {
    throw new Error('Neon database not configured. Please set VITE_NEON_DATABASE_URL.');
  }

  try {
    const result = await sql([query] as any, params);
    return result as T[];
  } catch (error) {
    console.error('Neon query error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      query: query.substring(0, 100) + '...',
      params
    });
    throw error;
  }
}

// Test Neon connection
export async function testNeonConnection(): Promise<boolean> {
  if (!sql) {
    console.warn('Neon connection test skipped: database not configured');
    return false;
  }

  try {
    const result = await sql`SELECT NOW() as timestamp`;
    console.log('Neon connection successful:', result[0]);
    return true;
  } catch (error) {
    console.error('Neon connection failed:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return false;
  }
}
