# Neon Database Integration Setup Guide

This guide will help you set up the Neon database integration for the forex trading platform.

## Prerequisites

1. A Neon account (sign up at https://neon.tech)
2. Access to the Neon console
3. The project already configured with Supabase

## Step 1: Create a Neon Project

1. Log in to your Neon console
2. Click "Create Project"
3. Name your project "forex-trading-platform"
4. Select your preferred region
5. Copy the connection string provided

## Step 2: Configure Environment Variables

Set the following environment variables (use DevServerControl tool for secrets):

```bash
VITE_NEON_DATABASE_URL=postgresql://username:password@ep-xxx.region.aws.neon.tech/database_name?sslmode=require
VITE_USE_NEON=false  # Set to true to use Neon as primary
VITE_ENABLE_DUAL_DATABASE=true
```

## Step 3: Run the Database Schema

Execute the `neon-schema.sql` file against your Neon database:

1. Copy the contents of `neon-schema.sql`
2. Go to your Neon console
3. Navigate to the SQL Editor
4. Paste and execute the schema

## Step 4: Initialize Demo Data

Use the Database Initializer component in the Admin Login page:

1. Visit `/admin-login`
2. Go to the "Database Setup" tab
3. Click "Test Connections" to verify both databases work
4. Click "Setup Demo Accounts" to create admin credentials

## Step 5: Test the Integration

1. Try registering a new user account
2. Test the admin login with demo credentials:
   - Email: admin@forextraderssignals.com
   - Password: Demo@2024!
3. Switch between databases using the Database Initializer

## Environment Configuration Options

### Primary Database Selection
- `VITE_USE_NEON=true` - Use Neon as primary database
- `VITE_USE_NEON=false` - Use Supabase as primary database

### Dual Database Mode
- `VITE_ENABLE_DUAL_DATABASE=true` - Enable switching between databases
- `VITE_ENABLE_DUAL_DATABASE=false` - Disable database switching

## Demo Admin Credentials

The system automatically creates these demo admin accounts:

1. **Primary Admin**
   - Email: admin@forextraderssignals.com
   - Password: Demo@2024!

2. **Demo Admin**
   - Email: demo@forextraderssignals.com
   - Password: Demo@2024!

## Database Schema Features

The Neon database includes all features from Supabase plus:

- Enhanced user profiles with additional fields
- Admin user management
- Dual authentication system
- Complete financial transaction tracking
- Forex signals management
- Referral system
- Support ticket system

## Switching Between Databases

You can switch between Supabase and Neon databases:

1. Via environment variables (requires restart)
2. Via the Database Initializer component (runtime switching)
3. Programmatically using the dual database service

## Troubleshooting

### Connection Issues
- Verify your Neon connection string format
- Check that SSL mode is enabled
- Ensure your Neon database is not paused

### Schema Issues
- Make sure the schema was executed completely
- Check for any foreign key constraint errors
- Verify all tables were created successfully

### Authentication Issues
- Ensure demo credentials were set up properly
- Check that both auth systems are configured
- Verify user profiles are created in both databases

## Migration Strategy

To migrate from Supabase to Neon:

1. Set up Neon database with schema
2. Test connections to both databases
3. Enable dual database mode
4. Gradually migrate users (optional)
5. Switch primary database when ready

## Production Considerations

- Use connection pooling for Neon in production
- Set up proper backup strategies
- Monitor both database connections
- Implement proper error handling and fallbacks
- Consider database-specific optimizations

## Support

For issues with this setup:
1. Check the Database Initializer for connection status
2. Review browser console for detailed error messages
3. Verify all environment variables are set correctly
4. Test database connections independently
