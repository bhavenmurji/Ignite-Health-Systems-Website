#!/usr/bin/env python3
import requests
import json
import os
import sys

# Try to load environment variables from .env file if present
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    # dotenv not installed, continue with system env vars only
    pass

# Configuration from environment variables
API_TOKEN = os.getenv("CLOUDFLARE_API_TOKEN")
ACCOUNT_ID = os.getenv("CLOUDFLARE_ACCOUNT_ID", "b9c488907659edd5db3b39c0151a26b8")
PROJECT_ID = os.getenv("CLOUDFLARE_PROJECT_ID", "5788a56d-292e-4b47-b4a5-73f6c9cb23e2")
ZONE_ID = os.getenv("CLOUDFLARE_ZONE_ID", "1adc1ca38d5f6c213fa65cd14e5753e9")

# Validate required environment variables
if not API_TOKEN:
    print("❌ Error: CLOUDFLARE_API_TOKEN environment variable is required")
    print("Please set it using: export CLOUDFLARE_API_TOKEN='your_token_here'")
    sys.exit(1)

headers = {
    "Authorization": f"Bearer {API_TOKEN}",
    "Content-Type": "application/json"
}

# Filter out empty environment variables to avoid sending empty values
def get_env_vars():
    """Get non-empty environment variables for deployment"""
    env_vars = {}

    # Required variables
    env_vars["NEXT_PUBLIC_N8N_WEBHOOK_URL"] = {
        "type": "plain_text",
        "value": os.getenv("NEXT_PUBLIC_N8N_WEBHOOK_URL", "https://bhavenmurji.app.n8n.cloud/webhook/ignite-interest-form")
    }
    env_vars["NEXT_PUBLIC_DOMAIN"] = {
        "type": "plain_text",
        "value": "https://ignitehealthsystems.com"
    }

    # Optional API keys - only include if set
    optional_vars = {
        "GEMINI_API_KEY": os.getenv("GEMINI_API_KEY", ""),
        "MAILCHIMP_API_KEY": os.getenv("MAILCHIMP_API_KEY", ""),
        "TELEGRAM_BOT_TOKEN": os.getenv("TELEGRAM_BOT_TOKEN", ""),
        "MAILCHIMP_AUDIENCE_ID": os.getenv("MAILCHIMP_AUDIENCE_ID", ""),
        "TELEGRAM_CHAT_ID": os.getenv("TELEGRAM_CHAT_ID", ""),
        "N8N_API_KEY": os.getenv("N8N_API_KEY", ""),
        "GOOGLE_CLIENT_ID": os.getenv("GOOGLE_CLIENT_ID", ""),
        "GOOGLE_CLIENT_SECRET": os.getenv("GOOGLE_CLIENT_SECRET", "")
    }

    for key, value in optional_vars.items():
        if value:  # Only add non-empty values
            env_vars[key] = {
                "type": "plain_text",
                "value": value
            }
        else:
            print(f"⚠️ Skipping {key} - no environment variable set")

    return env_vars

# Step 1: Update environment variables and build configuration
print("🔧 Updating Pages configuration...")
env_vars = get_env_vars()

update_data = {
    "build_config": {
        "build_command": "npm run build",
        "destination_dir": "out",
        "root_dir": ""
    },
    "deployment_configs": {
        "production": {
            "env_vars": env_vars
        },
        "preview": {
            "env_vars": env_vars
        }
    }
}

url = f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/pages/projects/{PROJECT_ID}"
response = requests.patch(url, headers=headers, json=update_data)

if response.status_code == 200:
    print("✅ Configuration updated successfully!")
    print(f"📝 Added {len(env_vars)} environment variables")
else:
    print(f"❌ Failed to update configuration: {response.status_code}")
    print(response.text)
    sys.exit(1)

# Step 2: Trigger a new deployment
print("\n🚀 Triggering new deployment...")
deploy_url = f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/pages/projects/{PROJECT_ID}/deployments"
deploy_data = {
    "branch": "main"
}

deploy_response = requests.post(deploy_url, headers=headers, json=deploy_data)

if deploy_response.status_code in [200, 201]:
    deployment = deploy_response.json()
    print("✅ Deployment triggered successfully!")
    if 'result' in deployment:
        print(f"📦 Deployment ID: {deployment['result']['id']}")
        print(f"🔗 URL: {deployment['result']['url']}")
else:
    print(f"❌ Failed to trigger deployment: {deploy_response.status_code}")
    print(deploy_response.text)
    sys.exit(1)

print("\n📋 Next steps:")
print("1. Wait 2-3 minutes for deployment to complete")
print("2. Check: https://ignite-health-systems-website.pages.dev")
print("3. Then check: https://ignitehealthsystems.com")