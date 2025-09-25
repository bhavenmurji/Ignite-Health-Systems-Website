#!/usr/bin/env python3
"""
Fix Cloudflare Pages custom domain configuration
Handle the remaining Pages setup after DNS is working
"""

import requests
import json
import time
import sys

# Configuration
API_TOKEN = "MHkHvGc5MXvSo7zH19kDDHY6_7OuNgzc3-rP9ig4"
ACCOUNT_ID = "b9c488907659edd5db3b39c0151a26b8"
DOMAIN = "ignitehealthsystems.com"

BASE_URL = "https://api.cloudflare.com/client/v4"
HEADERS = {
    "Authorization": f"Bearer {API_TOKEN}",
    "Content-Type": "application/json"
}

def log(message):
    print(f"[{time.strftime('%H:%M:%S')}] {message}")

def find_pages_project():
    """Find the correct Pages project"""
    log("Finding Cloudflare Pages project...")

    url = f"{BASE_URL}/accounts/{ACCOUNT_ID}/pages/projects"
    response = requests.get(url, headers=HEADERS)

    if response.status_code != 200:
        log(f"Failed to fetch projects: {response.text}")
        return None

    projects = response.json()["result"]

    # Print all projects for debugging
    log("Available projects:")
    for project in projects:
        log(f"  - {project['name']} (ID: {project['id']})")
        log(f"    Domains: {project.get('domains', [])}")

    # Look for project with ignite in name
    for project in projects:
        if "ignite" in project["name"].lower():
            return project

    # If no ignite project, return first project
    if projects:
        return projects[0]

    return None

def add_custom_domain(project_id):
    """Add custom domain to Pages project"""
    log(f"Adding custom domain to project ID: {project_id}")

    domains_to_add = [DOMAIN, f"www.{DOMAIN}"]

    for domain in domains_to_add:
        log(f"Adding domain: {domain}")

        url = f"{BASE_URL}/accounts/{ACCOUNT_ID}/pages/projects/{project_id}/domains"
        data = {"name": domain}

        response = requests.post(url, headers=HEADERS, json=data)

        if response.status_code == 200:
            log(f"✅ Successfully added domain: {domain}")
        else:
            log(f"❌ Failed to add domain {domain}: {response.text}")

def check_deployment_status(project_id):
    """Check the latest deployment status"""
    log("Checking deployment status...")

    url = f"{BASE_URL}/accounts/{ACCOUNT_ID}/pages/projects/{project_id}/deployments"
    response = requests.get(url, headers=HEADERS)

    if response.status_code != 200:
        log(f"Failed to get deployments: {response.text}")
        return

    deployments = response.json()["result"]

    if deployments:
        latest = deployments[0]
        log(f"Latest deployment: {latest['id']}")
        log(f"Status: {latest.get('latest_stage', {}).get('status', 'unknown')}")
        log(f"URL: {latest.get('url', 'N/A')}")

def main():
    log("🔧 Fixing Cloudflare Pages custom domain configuration...")

    # Find the project
    project = find_pages_project()
    if not project:
        log("❌ No Pages project found")
        return False

    project_id = project["id"]
    project_name = project["name"]
    log(f"Using project: {project_name} (ID: {project_id})")

    # Add custom domains
    add_custom_domain(project_id)

    # Check deployment status
    check_deployment_status(project_id)

    log("✅ Pages configuration update complete")
    log("🌐 Website should be accessible at:")
    log(f"   - https://{DOMAIN}")
    log(f"   - https://www.{DOMAIN}")

    return True

if __name__ == "__main__":
    try:
        success = main()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)