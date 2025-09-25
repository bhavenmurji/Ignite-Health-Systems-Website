#!/usr/bin/env python3
"""
Verify GitHub Pages deployment and Cloudflare configuration
"""

import subprocess
import time
import json
import sys

def check_workflow_status():
    """Check if GitHub Actions workflow is running"""
    print("🔄 Checking GitHub Actions workflow status...")

    # Check if gh CLI is available
    try:
        result = subprocess.run(
            ["gh", "workflow", "view", "static.yml", "--repo", "bhavenmurji/Ignite-Health-Systems-Website"],
            capture_output=True,
            text=True
        )
        if result.returncode == 0:
            print("✅ GitHub Pages workflow exists")

            # Check recent runs
            runs_result = subprocess.run(
                ["gh", "run", "list", "--workflow=static.yml", "--limit=1", "--repo", "bhavenmurji/Ignite-Health-Systems-Website"],
                capture_output=True,
                text=True
            )
            if runs_result.returncode == 0:
                print("📊 Recent workflow runs:")
                print(runs_result.stdout)
        else:
            print("⚠️  GitHub CLI not configured or workflow not found")
            print("   Please check: https://github.com/bhavenmurji/Ignite-Health-Systems-Website/actions")
    except FileNotFoundError:
        print("⚠️  GitHub CLI not installed")
        print("   Visit: https://github.com/bhavenmurji/Ignite-Health-Systems-Website/actions")

def check_dns():
    """Check DNS configuration"""
    print("\n🌐 Checking DNS configuration...")

    # Check A records
    result = subprocess.run(
        ["dig", "ignitehealthsystems.com", "A", "+short"],
        capture_output=True,
        text=True
    )

    if result.returncode == 0 and result.stdout:
        ips = result.stdout.strip().split('\n')
        print(f"✅ DNS A records found: {', '.join(ips)}")

        # These are Cloudflare IPs
        if any(ip.startswith(('104.', '172.')) for ip in ips):
            print("✅ Domain is using Cloudflare proxy")
    else:
        print("❌ No DNS records found")

def test_website():
    """Test website accessibility"""
    print("\n🔍 Testing website accessibility...")

    urls = [
        "https://ignitehealthsystems.com",
        "https://www.ignitehealthsystems.com",
        "https://bhavenmurji.github.io/Ignite-Health-Systems-Website/"
    ]

    for url in urls:
        print(f"\nTesting: {url}")
        result = subprocess.run(
            ["curl", "-I", "-s", "-o", "/dev/null", "-w", "%{http_code}", url],
            capture_output=True,
            text=True
        )

        if result.returncode == 0:
            status_code = result.stdout.strip()
            if status_code == "200":
                print(f"✅ {url} - Status: {status_code} (OK)")
            elif status_code == "301" or status_code == "302":
                print(f"⚠️  {url} - Status: {status_code} (Redirect)")
            elif status_code == "522":
                print(f"❌ {url} - Status: {status_code} (Connection Timeout)")
            else:
                print(f"⚠️  {url} - Status: {status_code}")

def main():
    print("=" * 60)
    print("GitHub Pages & Cloudflare Deployment Verification")
    print("=" * 60)

    check_workflow_status()
    check_dns()

    print("\n⏳ Waiting 30 seconds for deployment to propagate...")
    time.sleep(30)

    test_website()

    print("\n" + "=" * 60)
    print("📋 Next Steps:")
    print("1. Check GitHub Actions: https://github.com/bhavenmurji/Ignite-Health-Systems-Website/actions")
    print("2. If workflow succeeded, wait 2-5 minutes for GitHub Pages to deploy")
    print("3. Verify GitHub Pages settings: https://github.com/bhavenmurji/Ignite-Health-Systems-Website/settings/pages")
    print("4. Ensure 'Source' is set to 'GitHub Actions'")
    print("5. Custom domain should be: ignitehealthsystems.com")
    print("=" * 60)

if __name__ == "__main__":
    main()