#!/usr/bin/env python3
"""
Simple Cloudflare Pages deployment fixer
Focus on adding missing environment variables and triggering deployment
"""

import requests
import json
import time
import sys
import os

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
PROJECT_NAME = os.getenv("CLOUDFLARE_PROJECT_NAME", "ignite-health-systems-website")

# Validate required environment variables
if not API_TOKEN:
    print("❌ Error: CLOUDFLARE_API_TOKEN environment variable is required")
    print("Please set it using: export CLOUDFLARE_API_TOKEN='your_token_here'")
    sys.exit(1)

BASE_URL = "https://api.cloudflare.com/client/v4"
HEADERS = {
    "Authorization": f"Bearer {API_TOKEN}",
    "Content-Type": "application/json"
}

def log(message):
    print(f"[{time.strftime('%H:%M:%S')}] {message}")

def update_environment_variables():
    """Update environment variables using PATCH on deployment configs"""
    log("Adding missing environment variables...")

    # Missing critical environment variables from env vars or defaults
    missing_vars = {
        "NEXT_PUBLIC_N8N_WEBHOOK_URL": os.getenv("NEXT_PUBLIC_N8N_WEBHOOK_URL", "https://n8n.ruv.io/webhook/ignite-health-contact"),
        "MAILCHIMP_AUDIENCE_ID": os.getenv("MAILCHIMP_AUDIENCE_ID", ""),
        "TELEGRAM_CHAT_ID": os.getenv("TELEGRAM_CHAT_ID", ""),
        "N8N_API_KEY": os.getenv("N8N_API_KEY", ""),
        "GOOGLE_CLIENT_ID": os.getenv("GOOGLE_CLIENT_ID", ""),
        "GOOGLE_CLIENT_SECRET": os.getenv("GOOGLE_CLIENT_SECRET", ""),
        "NODE_ENV": "production",
        "NEXT_PUBLIC_SITE_URL": "https://ignitehealthsystems.com"
    }

    # Filter out empty values
    missing_vars = {k: v for k, v in missing_vars.items() if v}

    # Update production environment variables
    url = f"{BASE_URL}/accounts/{ACCOUNT_ID}/pages/projects/{PROJECT_ID}"

    # Get current configuration
    response = requests.get(url, headers=HEADERS)
    if response.status_code != 200:
        log(f"Failed to get current configuration: {response.text}")
        return False

    config = response.json()
    current_prod_env = config["result"]["deployment_configs"]["production"]["env_vars"] or {}

    # Merge existing and new environment variables
    for key, value in missing_vars.items():
        if value:  # Only add non-empty values
            current_prod_env[key] = {"type": "plain_text", "value": value}
        else:
            log(f"⚠️ Skipping {key} - no environment variable set")

    # Update configuration
    update_data = {
        "deployment_configs": {
            "production": {
                "env_vars": current_prod_env,
                "compatibility_date": "2025-09-24",
                "compatibility_flags": [],
                "fail_open": True,
                "always_use_latest_compatibility_date": False,
                "build_image_major_version": 3,
                "usage_model": "standard"
            },
            "preview": {
                "env_vars": current_prod_env,
                "compatibility_date": "2025-09-24",
                "compatibility_flags": [],
                "fail_open": True,
                "always_use_latest_compatibility_date": False,
                "build_image_major_version": 3,
                "usage_model": "standard"
            }
        }
    }

    response = requests.patch(url, headers=HEADERS, json=update_data)
    if response.status_code == 200:
        log("✅ Successfully updated environment variables")
        return True
    else:
        log(f"❌ Failed to update environment variables: {response.text}")
        return False

def update_build_config():
    """Update build configuration to fix build issues"""
    log("Updating build configuration...")

    url = f"{BASE_URL}/accounts/{ACCOUNT_ID}/pages/projects/{PROJECT_ID}"

    # Updated build configuration for Next.js
    build_data = {
        "build_config": {
            "build_command": "npm install && npm run build",
            "destination_dir": "out",
            "root_dir": "",
            "web_analytics_tag": None,
            "web_analytics_token": None
        }
    }

    response = requests.patch(url, headers=HEADERS, json=build_data)
    if response.status_code == 200:
        log("✅ Build configuration updated")
        return True
    else:
        log(f"❌ Failed to update build config: {response.text}")
        return False

def trigger_deployment():
    """Trigger a new deployment"""
    log("Triggering new deployment...")

    url = f"{BASE_URL}/accounts/{ACCOUNT_ID}/pages/projects/{PROJECT_ID}/deployments"

    response = requests.post(url, headers=HEADERS, json={})

    if response.status_code == 200:
        result = response.json()["result"]
        deployment_id = result["id"]
        log(f"✅ Deployment triggered! ID: {deployment_id}")
        return deployment_id
    else:
        log(f"❌ Failed to trigger deployment: {response.text}")
        return None

def monitor_deployment(deployment_id, timeout=600):
    """Monitor deployment status"""
    log("Monitoring deployment progress...")
    start_time = time.time()

    while time.time() - start_time < timeout:
        url = f"{BASE_URL}/accounts/{ACCOUNT_ID}/pages/projects/{PROJECT_ID}/deployments/{deployment_id}"
        response = requests.get(url, headers=HEADERS)

        if response.status_code != 200:
            log("Failed to get deployment status")
            time.sleep(10)
            continue

        deployment = response.json()["result"]
        stage = deployment["latest_stage"]
        status = stage["status"]
        stage_name = stage["name"]

        log(f"Status: {status} (stage: {stage_name})")

        if status == "success" and stage_name == "deploy":
            log("🎉 Deployment successful!")
            return True
        elif status == "failure":
            log(f"❌ Deployment failed at stage: {stage_name}")
            return False

        time.sleep(15)

    log("⏰ Deployment monitoring timeout")
    return False

def check_custom_domain():
    """Check and configure custom domain"""
    log("Checking custom domain configuration...")

    url = f"{BASE_URL}/accounts/{ACCOUNT_ID}/pages/projects/{PROJECT_ID}"
    response = requests.get(url, headers=HEADERS)

    if response.status_code == 200:
        project = response.json()["result"]
        domains = project.get("domains", [])

        if "ignitehealthsystems.com" not in domains:
            log("Adding custom domain: ignitehealthsystems.com")

            domain_url = f"{BASE_URL}/accounts/{ACCOUNT_ID}/pages/projects/{PROJECT_ID}/domains"
            domain_data = {"name": "ignitehealthsystems.com"}

            response = requests.post(domain_url, headers=HEADERS, json=domain_data)
            if response.status_code == 200:
                log("✅ Custom domain added")
            else:
                log(f"⚠️ Failed to add custom domain: {response.text}")
        else:
            log("✅ Custom domain already configured")

def main():
    """Main execution function"""
    log("🚀 Starting Cloudflare Pages deployment fix...")

    # Step 1: Update environment variables
    if not update_environment_variables():
        log("❌ Failed to update environment variables")
        return False

    # Step 2: Update build configuration
    if not update_build_config():
        log("❌ Failed to update build configuration")
        return False

    # Step 3: Configure custom domain
    check_custom_domain()

    # Step 4: Trigger deployment
    deployment_id = trigger_deployment()
    if not deployment_id:
        log("❌ Failed to trigger deployment")
        return False

    # Step 5: Monitor deployment
    if monitor_deployment(deployment_id):
        log("🎉 Deployment completed successfully!")
        log("🌐 Site should be accessible at: https://ignitehealthsystems.com")
        return True
    else:
        log("❌ Deployment failed")
        return False

if __name__ == "__main__":
    try:
        success = main()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n❌ Process interrupted")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)