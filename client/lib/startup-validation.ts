import { validateEnvironment, getDatabaseInfo } from './environment';

export class StartupValidationError extends Error {
  constructor(message: string, public details?: any) {
    super(message);
    this.name = 'StartupValidationError';
  }
}

export interface ValidationResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  info: {
    database: string;
    dualEnabled: boolean;
    supabaseConfigured: boolean;
    neonConfigured: boolean;
  };
}

export async function validateStartup(): Promise<ValidationResult> {
  const result: ValidationResult = {
    success: true,
    errors: [],
    warnings: [],
    info: {
      database: 'Unknown',
      dualEnabled: false,
      supabaseConfigured: false,
      neonConfigured: false,
    }
  };

  try {
    // Validate environment variables
    validateEnvironment();
    
    // Get database info
    const dbInfo = getDatabaseInfo();
    result.info = {
      database: dbInfo.active,
      dualEnabled: dbInfo.dualEnabled,
      supabaseConfigured: dbInfo.supabaseConfigured,
      neonConfigured: dbInfo.neonConfigured,
    };

    // Check database configuration
    if (!dbInfo.supabaseConfigured && !dbInfo.neonConfigured) {
      result.errors.push('No database is properly configured');
      result.success = false;
    }

    if (dbInfo.active === 'Neon' && !dbInfo.neonConfigured) {
      result.errors.push('Neon is selected as primary database but not properly configured (check connection string)');
      result.success = false;
    }

    if (dbInfo.active === 'Supabase' && !dbInfo.supabaseConfigured) {
      result.errors.push('Supabase is selected as primary database but not configured');
      result.success = false;
    }

    // Check for placeholder values
    const neonUrl = import.meta.env.VITE_NEON_DATABASE_URL;
    if (neonUrl === 'your_neon_database_connection_string') {
      result.warnings.push('Neon database URL is using placeholder value - please configure with actual connection string');
    }

    // Warnings for partial configuration
    if (dbInfo.dualEnabled) {
      if (!dbInfo.supabaseConfigured) {
        result.warnings.push('Dual database mode enabled but Supabase not configured');
      }
      if (!dbInfo.neonConfigured) {
        result.warnings.push('Dual database mode enabled but Neon not configured');
      }
    }

    // Check for required dependencies
    try {
      // Test if bcryptjs is available (for Neon authentication)
      await import('bcryptjs');
    } catch (error) {
      result.errors.push('bcryptjs dependency not found (required for Neon authentication)');
      result.success = false;
    }

    try {
      // Test if Neon client is available
      await import('@neondatabase/serverless');
    } catch (error) {
      if (dbInfo.neonConfigured || dbInfo.active === 'Neon') {
        result.errors.push('@neondatabase/serverless dependency not found');
        result.success = false;
      } else {
        result.warnings.push('@neondatabase/serverless not installed (Neon features disabled)');
      }
    }

  } catch (error) {
    result.errors.push(error instanceof Error ? error.message : 'Unknown validation error');
    result.success = false;
  }

  return result;
}

export function logValidationResult(result: ValidationResult) {
  console.group('🚀 Startup Validation');
  
  console.log(`✅ Primary Database: ${result.info.database}`);
  console.log(`🔄 Dual Mode: ${result.info.dualEnabled ? 'Enabled' : 'Disabled'}`);
  console.log(`📦 Supabase: ${result.info.supabaseConfigured ? 'Configured' : 'Not Configured'}`);
  console.log(`🐘 Neon: ${result.info.neonConfigured ? 'Configured' : 'Not Configured'}`);

  if (result.errors.length > 0) {
    console.group('❌ Errors');
    result.errors.forEach(error => console.error(`  • ${error}`));
    console.groupEnd();
  }

  if (result.warnings.length > 0) {
    console.group('⚠️ Warnings');
    result.warnings.forEach(warning => console.warn(`  • ${warning}`));
    console.groupEnd();
  }

  if (result.success) {
    console.log('✅ All validations passed');
  } else {
    console.error('❌ Validation failed - check errors above');
  }

  console.groupEnd();
}

// Auto-validate on module load in development
if (import.meta.env.DEV) {
  validateStartup().then(result => {
    logValidationResult(result);
    
    if (!result.success) {
      console.error(
        'Startup validation failed. The application may not work correctly. ' +
        'Please check your environment configuration.'
      );
    }
  }).catch(error => {
    console.error('Failed to run startup validation:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
  });
}
