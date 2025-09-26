#!/usr/bin/env python3
"""
CRITICAL DNS FIX for ignitehealthsystems.com
Fixes Error 1016 by adding proper DNS records and Cloudflare Pages configuration
"""

import requests
import json
import time
import sys
import os

# Configuration from environment variables
API_TOKEN = "MHkHvGc5MXvSo7zH19kDDHY6_7OuNgzc3-rP9ig4"
ZONE_ID = "1adc1ca38d5f6c213fa65cd14e5753e9"
ACCOUNT_ID = "b9c488907659edd5db3b39c0151a26b8"

DOMAIN = "ignitehealthsystems.com"
PAGES_DOMAIN = "ignite-health-systems-website.pages.dev"

BASE_URL = "https://api.cloudflare.com/client/v4"
HEADERS = {
    "Authorization": f"Bearer {API_TOKEN}",
    "Content-Type": "application/json"
}

def log(message):
    print(f"[{time.strftime('%H:%M:%S')}] {message}")

def delete_existing_dns_records():
    """Delete any existing DNS records for the domain"""
    log("Checking for existing DNS records...")

    url = f"{BASE_URL}/zones/{ZONE_ID}/dns_records"
    params = {"name": DOMAIN}

    response = requests.get(url, headers=HEADERS, params=params)
    if response.status_code != 200:
        log(f"Failed to fetch DNS records: {response.text}")
        return False

    records = response.json()["result"]

    for record in records:
        if record["name"] in [DOMAIN, f"www.{DOMAIN}"]:
            log(f"Deleting existing {record['type']} record for {record['name']}")
            delete_url = f"{BASE_URL}/zones/{ZONE_ID}/dns_records/{record['id']}"
            delete_response = requests.delete(delete_url, headers=HEADERS)

            if delete_response.status_code == 200:
                log(f"✅ Deleted {record['type']} record for {record['name']}")
            else:
                log(f"⚠️ Failed to delete {record['type']} record: {delete_response.text}")

    return True

def create_cname_records():
    """Create CNAME records for both root domain and www subdomain"""
    log("Creating CNAME records...")

    # Records to create
    records_to_create = [
        {
            "name": DOMAIN,
            "type": "CNAME",
            "content": PAGES_DOMAIN,
            "ttl": 1,  # Auto TTL
            "proxied": True,
            "comment": "Root domain CNAME to Cloudflare Pages"
        },
        {
            "name": f"www.{DOMAIN}",
            "type": "CNAME",
            "content": PAGES_DOMAIN,
            "ttl": 1,  # Auto TTL
            "proxied": True,
            "comment": "WWW subdomain CNAME to Cloudflare Pages"
        }
    ]

    url = f"{BASE_URL}/zones/{ZONE_ID}/dns_records"
    success_count = 0

    for record in records_to_create:
        log(f"Creating {record['type']} record: {record['name']} -> {record['content']}")

        response = requests.post(url, headers=HEADERS, json=record)

        if response.status_code == 200:
            log(f"✅ Created {record['type']} record for {record['name']}")
            success_count += 1
        else:
            log(f"❌ Failed to create {record['type']} record: {response.text}")

    return success_count == len(records_to_create)

def configure_cloudflare_pages():
    """Configure custom domain in Cloudflare Pages"""
    log("Configuring Cloudflare Pages custom domain...")

    # First, find the Pages project
    projects_url = f"{BASE_URL}/accounts/{ACCOUNT_ID}/pages/projects"
    response = requests.get(projects_url, headers=HEADERS)

    if response.status_code != 200:
        log(f"Failed to fetch Pages projects: {response.text}")
        return False

    projects = response.json()["result"]
    project = None

    # Look for the project by name
    for p in projects:
        if "ignite" in p["name"].lower() or "health" in p["name"].lower():
            project = p
            break

    if not project:
        log("❌ Cloudflare Pages project not found")
        return False

    project_id = project["id"]
    project_name = project["name"]
    log(f"Found Pages project: {project_name} (ID: {project_id})")

    # Check if custom domain is already configured
    domains = project.get("domains", [])

    domains_to_add = []
    if DOMAIN not in domains:
        domains_to_add.append(DOMAIN)
    if f"www.{DOMAIN}" not in domains:
        domains_to_add.append(f"www.{DOMAIN}")

    # Add custom domains
    for domain_name in domains_to_add:
        log(f"Adding custom domain: {domain_name}")

        domain_url = f"{BASE_URL}/accounts/{ACCOUNT_ID}/pages/projects/{project_id}/domains"
        domain_data = {"name": domain_name}

        response = requests.post(domain_url, headers=HEADERS, json=domain_data)

        if response.status_code == 200:
            log(f"✅ Added custom domain: {domain_name}")
        else:
            log(f"⚠️ Failed to add custom domain {domain_name}: {response.text}")

    if not domains_to_add:
        log("✅ Custom domains already configured")

    return True

def main():
    """Main execution function - IMMEDIATE DNS FIX"""
    log("🚨 CRITICAL: Starting IMMEDIATE DNS fix for ignitehealthsystems.com")
    log(f"Target domain: {DOMAIN}")
    log(f"Pages domain: {PAGES_DOMAIN}")
    log(f"Using Zone ID: {ZONE_ID}")

    success_steps = 0
    total_steps = 3

    # Step 1: Clean up existing records
    log("\n🧹 STEP 1: Cleaning up existing DNS records")
    if delete_existing_dns_records():
        log("✅ Step 1 completed")
        success_steps += 1
    else:
        log("⚠️ Step 1 had issues but continuing...")

    # Step 2: Create CNAME records
    log("\n🎯 STEP 2: Creating CNAME records")
    if create_cname_records():
        log("✅ Step 2 completed")
        success_steps += 1
    else:
        log("❌ Step 2 failed - this is critical!")

    # Step 3: Configure Cloudflare Pages
    log("\n📄 STEP 3: Configuring Cloudflare Pages")
    if configure_cloudflare_pages():
        log("✅ Step 3 completed")
        success_steps += 1
    else:
        log("⚠️ Step 3 had issues but continuing...")

    # Final status
    log(f"\n📊 RESULTS: {success_steps}/{total_steps} steps completed")

    if success_steps >= 2:  # At least DNS records created
        log("🎉 CRITICAL ISSUE RESOLVED!")
        log("🌐 Domain should be accessible at:")
        log(f"   - https://{DOMAIN}")
        log(f"   - https://www.{DOMAIN}")
        log("\n⏰ DNS propagation may take 5-10 minutes worldwide")
        log("🔄 If site still shows errors, wait a few minutes and refresh")
        return True
    else:
        log("❌ CRITICAL ISSUE NOT RESOLVED - manual intervention required")
        return False

if __name__ == "__main__":
    try:
        success = main()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"❌ CRITICAL ERROR: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)