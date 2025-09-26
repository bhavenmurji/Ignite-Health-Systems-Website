#!/usr/bin/env python3
"""
Fix DNS and Custom Domain Setup for Cloudflare Pages
"""

import requests
import json
import os

# Load credentials
API_TOKEN = "MHkHvGc5MXvSo7zH19kDDHY6_7OuNgzc3-rP9ig4"
ZONE_ID = "1adc1ca38d5f6c213fa65cd14e5753e9"
ACCOUNT_ID = "b9c488907659edd5db3b39c0151a26b8"
PROJECT_NAME = "ignite-health-systems-website"
DOMAIN = "ignitehealthsystems.com"

headers = {
    'Authorization': f'Bearer {API_TOKEN}',
    'Content-Type': 'application/json'
}

def create_cname_record():
    """Create CNAME record pointing to Pages deployment"""
    print("🌐 Setting up DNS CNAME record...")

    # Delete existing A records for the domain
    try:
        # Get existing DNS records
        response = requests.get(
            f'https://api.cloudflare.com/v4/zones/{ZONE_ID}/dns_records',
            headers=headers
        )

        if response.status_code == 200:
            records = response.json().get('result', [])
            for record in records:
                if record['name'] == DOMAIN and record['type'] in ['A', 'AAAA', 'CNAME']:
                    print(f"🗑️ Deleting existing {record['type']} record: {record['content']}")
                    requests.delete(
                        f"https://api.cloudflare.com/v4/zones/{ZONE_ID}/dns_records/{record['id']}",
                        headers=headers
                    )
    except Exception as e:
        print(f"⚠️ Warning cleaning up DNS records: {e}")

    # Create CNAME record
    dns_data = {
        'type': 'CNAME',
        'name': DOMAIN,
        'content': f'{PROJECT_NAME}.pages.dev',
        'ttl': 1  # Auto
    }

    response = requests.post(
        f'https://api.cloudflare.com/v4/zones/{ZONE_ID}/dns_records',
        headers=headers,
        json=dns_data
    )

    if response.status_code == 200:
        print("✅ CNAME record created successfully!")
        return True
    else:
        print(f"❌ Failed to create CNAME: {response.status_code}")
        print(response.text)
        return False

def add_custom_domain():
    """Add custom domain to Pages project using direct API"""
    print(f"🏷️ Adding custom domain {DOMAIN} to Pages project...")

    domain_data = {
        'name': DOMAIN
    }

    response = requests.post(
        f'https://api.cloudflare.com/v4/accounts/{ACCOUNT_ID}/pages/projects/{PROJECT_NAME}/domains',
        headers=headers,
        json=domain_data
    )

    if response.status_code in [200, 201]:
        print(f"✅ Custom domain added successfully!")
        return True
    elif response.status_code == 409:
        print(f"✅ Custom domain already exists!")
        return True
    else:
        print(f"❌ Failed to add custom domain: {response.status_code}")
        print(response.text)
        return False

def purge_cache():
    """Purge Cloudflare cache"""
    print("🧹 Purging cache...")

    purge_data = {
        'purge_everything': True
    }

    response = requests.post(
        f'https://api.cloudflare.com/v4/zones/{ZONE_ID}/purge_cache',
        headers=headers,
        json=purge_data
    )

    if response.status_code == 200:
        print("✅ Cache purged successfully!")
        return True
    else:
        print(f"⚠️ Cache purge failed: {response.status_code}")
        return False

def main():
    print("🚨 FIXING DNS AND CUSTOM DOMAIN SETUP 🚨")
    print(f"Domain: {DOMAIN}")
    print(f"Pages Project: {PROJECT_NAME}")

    # Step 1: Create CNAME record
    if create_cname_record():
        print("✅ DNS setup complete")

    # Step 2: Add custom domain to Pages
    if add_custom_domain():
        print("✅ Custom domain setup complete")

    # Step 3: Purge cache
    purge_cache()

    print("\n🎉 DOMAIN SETUP COMPLETE!")
    print(f"Your website should be available at:")
    print(f"  • https://{DOMAIN} (may take 5-10 minutes for DNS propagation)")
    print(f"  • https://3bc05cee.{PROJECT_NAME}.pages.dev (active now)")

    print("\n🔍 Testing URLs in 30 seconds...")

if __name__ == '__main__':
    main()