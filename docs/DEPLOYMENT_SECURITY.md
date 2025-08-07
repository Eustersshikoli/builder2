# Deployment Security Guide

This guide covers security best practices and environment configuration for production deployment.

## 🔒 Required Environment Variables

### Database Configuration

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Neon Database Configuration
VITE_NEON_DATABASE_URL=postgresql://username:password@ep-xxx.neon.tech/database_name?sslmode=require

# Database Selection
VITE_USE_NEON=false # Set to 'true' to use Neon as primary database
VITE_ENABLE_DUAL_DATABASE=false # Disable in production for security
```

### Application Configuration

```bash
# Application URL (Use your production domain)
VITE_APP_URL=https://your-domain.com
```

### Admin Credentials

**⚠️ CRITICAL: Change these default credentials in production!**

```bash
# Admin Account
VITE_ADMIN_USERNAME=your_admin_username
VITE_ADMIN_EMAIL=admin@yourdomain.com
VITE_ADMIN_PASSWORD=your_secure_password
VITE_ADMIN_FULL_NAME="Your Admin Name"

# Demo Account (Optional - can be disabled)
VITE_DEMO_USERNAME=demo
VITE_DEMO_EMAIL=demo@yourdomain.com
VITE_DEMO_PASSWORD=your_demo_password
VITE_DEMO_FULL_NAME="Demo User"
```

### Service Keys (Server-side only)

```bash
# Supabase Service Key (Server-side only - never expose to client)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Alpha Vantage API (for forex data)
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key

# Telegram Bot (if using Telegram features)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token

# Payment Processing
NOWPAYMENTS_API_KEY=your_nowpayments_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

## 🛡️ Security Best Practices

### 1. Environment Variables Security

- **Never commit** sensitive environment variables to version control
- Use your hosting platform's environment variable management (Netlify, Vercel, etc.)
- Rotate API keys and passwords regularly
- Use different credentials for staging and production

### 2. Password Requirements

- Minimum 12 characters for admin accounts
- Include uppercase, lowercase, numbers, and special characters
- Avoid common passwords or dictionary words
- Use a password manager for generating secure passwords

### 3. Database Security

- Enable Row Level Security (RLS) policies in Supabase
- Use connection pooling and SSL connections
- Regularly update database schemas and apply security patches
- Monitor database access logs

### 4. API Security

- Implement rate limiting on all API endpoints
- Use HTTPS only in production
- Validate all input data on both client and server
- Implement proper CORS policies

### 5. File Upload Security

- Validate file types and sizes
- Scan uploaded files for malware
- Use secure storage with proper access controls
- Implement virus scanning for user uploads

## 🚀 Deployment Checklist

### Pre-Deployment

- [ ] Change all default passwords and API keys
- [ ] Configure production database with proper backup
- [ ] Set up SSL certificates (HTTPS)
- [ ] Configure proper CORS settings
- [ ] Enable security headers (CSP, HSTS, etc.)
- [ ] Set up monitoring and logging
- [ ] Configure rate limiting
- [ ] Test all authentication flows

### Environment Configuration

- [ ] Set all required environment variables
- [ ] Verify database connections
- [ ] Test API integrations
- [ ] Configure email service (if applicable)
- [ ] Set up payment gateway (if applicable)
- [ ] Configure Telegram bot (if applicable)

### Post-Deployment

- [ ] Verify all features work correctly
- [ ] Test admin panel functionality
- [ ] Monitor error rates and performance
- [ ] Set up backup schedules
- [ ] Configure security monitoring
- [ ] Document admin procedures

## 🔧 Platform-Specific Instructions

### Netlify Deployment

1. Connect your repository to Netlify
2. Configure environment variables in Site Settings > Environment Variables
3. Add build command: `npm run build`
4. Set publish directory: `dist`
5. Configure redirects for SPA routing in `netlify.toml`

### Vercel Deployment

1. Connect your repository to Vercel
2. Configure environment variables in Project Settings
3. Vercel auto-detects build settings for Vite projects
4. Configure redirects in `vercel.json` if needed

### Manual Server Deployment

1. Build the project: `npm run build`
2. Serve the `dist` folder with a web server (nginx, Apache)
3. Configure environment variables on the server
4. Set up SSL certificates
5. Configure proper firewall rules

## ⚠️ Security Warnings

### Critical Security Issues to Avoid

1. **Never expose service role keys** to the client-side code
2. **Don't use default passwords** in production
3. **Avoid storing sensitive data** in local storage
4. **Don't disable CORS** without understanding the implications
5. **Never commit .env files** with real credentials

### Common Vulnerabilities

- SQL Injection: Use parameterized queries
- XSS: Sanitize all user input
- CSRF: Implement proper token validation
- Session Hijacking: Use secure session management
- Insecure File Uploads: Validate and scan all uploads

## 📊 Monitoring and Maintenance

### Required Monitoring

- Error tracking (Sentry, LogRocket, etc.)
- Performance monitoring (New Relic, DataDog)
- Security scanning (Snyk, OWASP ZAP)
- Uptime monitoring (Pingdom, UptimeRobot)

### Regular Maintenance

- Update dependencies monthly
- Review and rotate API keys quarterly
- Audit user permissions regularly
- Monitor database performance
- Review error logs weekly

## 🆘 Emergency Procedures

### Security Incident Response

1. **Immediately** rotate all compromised credentials
2. Review access logs for unauthorized activity
3. Notify affected users if data was compromised
4. Implement additional security measures
5. Document the incident and lessons learned

### Recovery Procedures

- Database backup restoration
- Application rollback procedures
- Emergency contact information
- Incident escalation protocols

## 📞 Support and Resources

### Documentation

- [Supabase Security Guide](https://supabase.com/docs/guides/auth/security)
- [Netlify Security Headers](https://docs.netlify.com/routing/headers/)
- [OWASP Security Guidelines](https://owasp.org/www-project-top-ten/)

### Security Tools

- [SSL Labs Test](https://www.ssllabs.com/ssltest/)
- [Security Headers Check](https://securityheaders.com/)
- [Mozilla Observatory](https://observatory.mozilla.org/)

---

**Remember: Security is an ongoing process, not a one-time setup. Regularly review and update your security measures.**
