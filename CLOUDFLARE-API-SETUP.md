# 🔐 Cloudflare API Token Setup

## Create API Token (2 minutes)

### Step 1: Go to Cloudflare API Tokens
1. Go to https://dash.cloudflare.com/profile/api-tokens
2. Click **"Create Token"**

### Step 2: Use Custom Token Template
Click **"Create Custom Token"** and configure:

**Token Name:** `Ignite Health Systems Automation`

**Permissions needed:**
- **Account** → Cloudflare Pages:Edit
- **Zone** → DNS:Edit
- **Zone** → Page Rules:Edit
- **Zone** → SSL and Certificates:Read
- **Zone** → Zone Settings:Read

**Zone Resources:**
- Include → Specific zone → `ignitehealthsystems.com`

**IP Address Filtering (optional):**
- Leave blank for now

### Step 3: Create and Copy Token
1. Click **"Continue to summary"**
2. Click **"Create Token"**
3. **COPY THE TOKEN** (you won't see it again!)

## Add to .env file

Create/update `.env` in your project root:
```env
CLOUDFLARE_API_TOKEN=your_token_here
CLOUDFLARE_ZONE_ID=your_zone_id
CLOUDFLARE_ACCOUNT_ID=your_account_id
```

## Get Your Zone ID and Account ID

### Zone ID:
1. Go to Cloudflare dashboard
2. Select `ignitehealthsystems.com`
3. Right sidebar → "API" section → Copy Zone ID

### Account ID:
1. Right sidebar → "API" section → Copy Account ID

## What I Can Do With This

Once you add the API token, I can:
- ✅ Create and manage Cloudflare Pages deployments
- ✅ Fix DNS records automatically
- ✅ Deploy your site directly
- ✅ Monitor deployment status
- ✅ Update environment variables
- ✅ Trigger rebuilds
- ✅ Check error logs

## Security Note
- This token is scoped only to your domain
- It cannot access billing or delete your account
- You can revoke it anytime from the API Tokens page
- Don't commit the .env file to Git (it's already in .gitignore)