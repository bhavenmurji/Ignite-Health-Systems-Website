#!/usr/bin/env python3
"""
Cloudflare Pages deployment fixer for ignitehealthsystems.com
Fixes build configuration, adds missing environment variables, and triggers deployment
"""

import requests
import json
import time
import sys
import os
from typing import Dict, Any, List

# Try to load environment variables from .env file if present
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    # dotenv not installed, continue with system env vars only
    pass

# Cloudflare API Configuration from environment variables
API_TOKEN = os.getenv("CLOUDFLARE_API_TOKEN")
ACCOUNT_ID = os.getenv("CLOUDFLARE_ACCOUNT_ID", "b9c488907659edd5db3b39c0151a26b8")
ZONE_ID = os.getenv("CLOUDFLARE_ZONE_ID", "1adc1ca38d5f6c213fa65cd14e5753e9")
PROJECT_NAME = os.getenv("CLOUDFLARE_PROJECT_NAME", "ignite-health-systems-website")

# Validate required environment variables
if not API_TOKEN:
    print("❌ Error: CLOUDFLARE_API_TOKEN environment variable is required")
    print("Please set it using: export CLOUDFLARE_API_TOKEN='your_token_here'")
    sys.exit(1)

# API endpoints
BASE_URL = "https://api.cloudflare.com/client/v4"
PAGES_URL = f"{BASE_URL}/accounts/{ACCOUNT_ID}/pages/projects"

# Headers for API requests
HEADERS = {
    "Authorization": f"Bearer {API_TOKEN}",
    "Content-Type": "application/json"
}

class CloudflarePagesFixer:
    def __init__(self):
        self.project_id = None
        self.project_info = None

    def log(self, message: str):
        """Log message with timestamp"""
        print(f"[{time.strftime('%H:%M:%S')}] {message}")

    def make_request(self, method: str, url: str, data: Dict = None) -> Dict[Any, Any]:
        """Make API request with error handling"""
        try:
            response = requests.request(
                method=method,
                url=url,
                headers=HEADERS,
                json=data if data else None,
                timeout=30
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            self.log(f"API request failed: {e}")
            if hasattr(e.response, 'text'):
                self.log(f"Response: {e.response.text}")
            return None

    def get_project_info(self) -> bool:
        """Get existing project information"""
        self.log("Getting project information...")

        response = self.make_request("GET", PAGES_URL)
        if not response or not response.get("success"):
            self.log("Failed to get projects list")
            return False

        projects = response.get("result", [])
        for project in projects:
            if project.get("name") == PROJECT_NAME:
                self.project_info = project
                self.project_id = project.get("id")
                self.log(f"Found project: {PROJECT_NAME} (ID: {self.project_id})")
                return True

        self.log(f"Project {PROJECT_NAME} not found")
        return False

    def get_environment_variables(self) -> Dict[str, str]:
        """Get current environment variables"""
        if not self.project_id:
            return {}

        url = f"{PAGES_URL}/{self.project_id}/env-vars"
        response = self.make_request("GET", url)

        if not response or not response.get("success"):
            self.log("Failed to get environment variables")
            return {}

        env_vars = {}
        for env_var in response.get("result", []):
            env_vars[env_var.get("name")] = env_var.get("value", "")

        self.log(f"Current environment variables: {list(env_vars.keys())}")
        return env_vars

    def add_environment_variable(self, name: str, value: str, is_secret: bool = True) -> bool:
        """Add or update environment variable"""
        if not self.project_id:
            return False

        url = f"{PAGES_URL}/{self.project_id}/env-vars"
        data = {
            "name": name,
            "value": value,
            "type": "secret_text" if is_secret else "plain_text"
        }

        # Try to add new variable
        response = self.make_request("POST", url, data)
        if response and response.get("success"):
            self.log(f"✅ Added environment variable: {name}")
            return True

        # If failed, try to update existing
        self.log(f"Attempting to update existing variable: {name}")
        update_url = f"{url}/{name}"
        response = self.make_request("PUT", update_url, data)

        if response and response.get("success"):
            self.log(f"✅ Updated environment variable: {name}")
            return True
        else:
            self.log(f"❌ Failed to add/update environment variable: {name}")
            return False

    def update_build_configuration(self) -> bool:
        """Update build configuration to fix deployment issues"""
        if not self.project_id:
            return False

        # Build configuration optimized for Next.js
        build_config = {
            "build_command": "npm install && npm run build",
            "destination_dir": "out",
            "root_dir": "/",
            "web_analytics_tag": None,
            "web_analytics_token": None,
            "nodejs_version": "18"  # Specify Node.js version
        }

        url = f"{PAGES_URL}/{self.project_id}"
        response = self.make_request("PATCH", url, build_config)

        if response and response.get("success"):
            self.log("✅ Updated build configuration")
            return True
        else:
            self.log("❌ Failed to update build configuration")
            return False

    def add_missing_environment_variables(self) -> bool:
        """Add all missing environment variables"""
        self.log("Adding missing environment variables...")

        # Critical environment variables
        env_vars = {
            # N8N Webhook (critical missing variable)
            "NEXT_PUBLIC_N8N_WEBHOOK_URL": os.getenv("NEXT_PUBLIC_N8N_WEBHOOK_URL", "https://n8n.ruv.io/webhook/ignite-health-contact"),

            # API Keys and tokens from environment variables
            "GEMINI_API_KEY": os.getenv("GEMINI_API_KEY", ""),
            "MAILCHIMP_API_KEY": os.getenv("MAILCHIMP_API_KEY", ""),
            "MAILCHIMP_AUDIENCE_ID": os.getenv("MAILCHIMP_AUDIENCE_ID", ""),
            "TELEGRAM_BOT_TOKEN": os.getenv("TELEGRAM_BOT_TOKEN", ""),
            "TELEGRAM_CHAT_ID": os.getenv("TELEGRAM_CHAT_ID", ""),
            "N8N_API_KEY": os.getenv("N8N_API_KEY", ""),

            # Google OAuth from environment variables
            "GOOGLE_CLIENT_ID": os.getenv("GOOGLE_CLIENT_ID", ""),
            "GOOGLE_CLIENT_SECRET": os.getenv("GOOGLE_CLIENT_SECRET", ""),

            # Build configuration
            "NODE_ENV": "production",
            "NEXT_PUBLIC_SITE_URL": "https://ignitehealthsystems.com",
            "NEXTJS_VERSION": "14.2.33"
        }

        success_count = 0
        for name, value in env_vars.items():
            # Skip empty values (when env var is not set)
            if value and self.add_environment_variable(name, value):
                success_count += 1
            elif not value:
                self.log(f"⚠️ Skipping {name} - no environment variable set")

        self.log(f"Successfully added/updated {success_count}/{len(env_vars)} environment variables")
        return success_count == len(env_vars)

    def trigger_deployment(self) -> bool:
        """Trigger a new deployment"""
        if not self.project_id:
            return False

        self.log("Triggering new deployment...")
        url = f"{PAGES_URL}/{self.project_id}/deployments"

        # Force redeploy from the main branch
        data = {
            "compatibility_flags": [],
            "usage_model": "standard"
        }

        response = self.make_request("POST", url, data)

        if response and response.get("success"):
            deployment = response.get("result", {})
            deployment_id = deployment.get("id")
            self.log(f"✅ Deployment triggered successfully! ID: {deployment_id}")
            return True
        else:
            self.log("❌ Failed to trigger deployment")
            return False

    def monitor_deployment(self, timeout: int = 600) -> bool:
        """Monitor deployment status"""
        if not self.project_id:
            return False

        self.log("Monitoring deployment status...")
        start_time = time.time()

        while time.time() - start_time < timeout:
            url = f"{PAGES_URL}/{self.project_id}/deployments"
            response = self.make_request("GET", url)

            if not response or not response.get("success"):
                self.log("Failed to get deployment status")
                time.sleep(10)
                continue

            deployments = response.get("result", [])
            if not deployments:
                self.log("No deployments found")
                time.sleep(10)
                continue

            latest_deployment = deployments[0]
            status = latest_deployment.get("latest_stage", {}).get("status")
            stage_name = latest_deployment.get("latest_stage", {}).get("name", "unknown")

            self.log(f"Deployment status: {status} (stage: {stage_name})")

            if status == "success":
                deployment_url = latest_deployment.get("url")
                self.log(f"🎉 Deployment successful! URL: {deployment_url}")
                return True
            elif status == "failure":
                self.log("❌ Deployment failed")
                return False

            time.sleep(15)  # Check every 15 seconds

        self.log("⏰ Deployment monitoring timeout")
        return False

    def verify_site_accessibility(self) -> bool:
        """Verify the site is accessible"""
        self.log("Verifying site accessibility...")

        test_urls = [
            "https://ignitehealthsystems.com",
            "https://ignitehealthsystems.com/index.html"
        ]

        for url in test_urls:
            try:
                response = requests.get(url, timeout=10)
                if response.status_code == 200:
                    self.log(f"✅ Site accessible: {url}")
                    return True
                else:
                    self.log(f"❌ Site returned status {response.status_code}: {url}")
            except requests.exceptions.RequestException as e:
                self.log(f"❌ Failed to access {url}: {e}")

        return False

    def run_complete_fix(self) -> bool:
        """Run the complete deployment fix process"""
        self.log("🚀 Starting Cloudflare Pages deployment fix...")

        # Step 1: Get project information
        if not self.get_project_info():
            self.log("❌ Cannot proceed without project information")
            return False

        # Step 2: Update build configuration
        if not self.update_build_configuration():
            self.log("⚠️ Build configuration update failed, continuing...")

        # Step 3: Add missing environment variables
        if not self.add_missing_environment_variables():
            self.log("⚠️ Some environment variables failed to add, continuing...")

        # Step 4: Trigger deployment
        if not self.trigger_deployment():
            self.log("❌ Failed to trigger deployment")
            return False

        # Step 5: Monitor deployment
        if not self.monitor_deployment():
            self.log("❌ Deployment failed or timed out")
            return False

        # Step 6: Verify site accessibility
        time.sleep(30)  # Wait for DNS propagation
        if not self.verify_site_accessibility():
            self.log("⚠️ Site verification failed, but deployment might still be successful")

        self.log("🎉 Cloudflare Pages deployment fix completed!")
        return True

def main():
    """Main function"""
    fixer = CloudflarePagesFixer()

    try:
        success = fixer.run_complete_fix()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n❌ Process interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()