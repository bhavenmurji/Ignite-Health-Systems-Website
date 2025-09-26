# Cloudflare Deployment Scripts

This directory contains Python scripts for managing Cloudflare Pages deployments securely using environment variables.

## Security Update

**⚠️ IMPORTANT:** These scripts have been updated to use environment variables instead of hardcoded credentials for better security practices.

## Scripts

1. **`fix_cloudflare_deployment.py`** - Comprehensive deployment fixer with monitoring
2. **`fix_cloudflare_simple.py`** - Simplified deployment script
3. **`fix_cloudflare.py`** - Basic configuration and deployment trigger

## Setup

### 1. Environment Variables

Copy the template and fill in your values:

```bash
cp .env.template .env
# Edit .env with your actual credentials
```

Or export environment variables directly:

```bash
export CLOUDFLARE_API_TOKEN="your_actual_token_here"
export GEMINI_API_KEY="your_gemini_key"
export MAILCHIMP_API_KEY="your_mailchimp_key"
# ... other variables as needed
```

### 2. Required Dependencies

```bash
pip install requests python-dotenv
```

### 3. Required Environment Variables

**Essential:**
- `CLOUDFLARE_API_TOKEN` - Your Cloudflare API token (required)

**Optional (with sensible defaults):**
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_PROJECT_ID`
- `CLOUDFLARE_ZONE_ID`
- `CLOUDFLARE_PROJECT_NAME`

**Application-specific (optional):**
- `NEXT_PUBLIC_N8N_WEBHOOK_URL`
- `GEMINI_API_KEY`
- `MAILCHIMP_API_KEY`
- `MAILCHIMP_AUDIENCE_ID`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `N8N_API_KEY`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

## Usage

### Quick Fix
```bash
python3 fix_cloudflare.py
```

### Simple Deployment
```bash
python3 fix_cloudflare_simple.py
```

### Complete Deployment with Monitoring
```bash
python3 fix_cloudflare_deployment.py
```

## Security Features

✅ **No hardcoded credentials** - All sensitive data comes from environment variables
✅ **Graceful degradation** - Scripts skip empty/missing optional environment variables
✅ **Clear error messages** - Scripts explain what environment variables are missing
✅ **Optional .env support** - Uses python-dotenv if available for local development

## Error Handling

The scripts will:
- Exit with clear error messages if required environment variables are missing
- Skip optional environment variables that aren't set (instead of using empty values)
- Show which variables are being skipped during execution

## Getting Your Cloudflare API Token

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
2. Click "Create Token"
3. Use "Edit Cloudflare Workers" template or create custom token with:
   - Zone: Zone Settings:Read, Zone:Read
   - Account: Cloudflare Pages:Edit
   - Include: All accounts and zones (or specify your account/zone)

## Best Practices

1. **Never commit .env files** - Add `.env` to your `.gitignore`
2. **Use different tokens** for different environments (dev, staging, prod)
3. **Regularly rotate** your API tokens
4. **Use minimal permissions** when creating API tokens
5. **Store production secrets** in your CI/CD system's secret management

## Troubleshooting

**"CLOUDFLARE_API_TOKEN environment variable is required"**
- Set the environment variable or add it to your .env file

**"Skipping [VARIABLE] - no environment variable set"**
- This is normal - the script skips optional variables that aren't configured

**API errors (401, 403)**
- Check that your API token has the correct permissions
- Verify the token hasn't expired

**Deployment failures**
- Check the Cloudflare Pages dashboard for detailed error logs
- Ensure your build configuration is correct for your project