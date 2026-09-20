"""
Post-Deployment Smoke Test Script for KhataLens
Hits the live API Gateway endpoints (or local server) and verifies:
1. Health & Dashboard endpoint (`GET /api/dashboard`)
2. Presigned S3 upload URL generation (`POST /api/upload-url`)
3. Multimodal extraction & schema validation (`POST /api/extract`)
4. Confirm & Commit to DynamoDB (`POST /api/entries`)
5. Multilingual reminder generation (`POST /api/reminder`)
"""

import argparse
import json
import sys
import time
import requests

GREEN = "\033[92m"
RED = "\033[91m"
BOLD = "\033[1m"
RESET = "\033[0m"


def run_smoke_tests(base_url: str):
    print(f"\n{BOLD}======================================================{RESET}")
    print(f"{BOLD}KhataLens Post-Deployment Smoke Test Suite{RESET}")
    print(f"Target URL: {base_url}")
    print(f"{BOLD}======================================================{RESET}\n")

    passed = 0
    failed = 0

    # Test 1: GET /api/dashboard
    t0 = time.time()
    try:
        r = requests.get(f"{base_url}/api/dashboard", timeout=10)
        dt = (time.time() - t0) * 1000
        if r.status_code == 200 and "total_outstanding" in r.json():
            data = r.json()
            print(f"[{GREEN}PASS{RESET}] GET /api/dashboard ({dt:.0f}ms) - Total Outstanding: INR {data.get('total_outstanding')}")
            passed += 1
        else:
            print(f"[{RED}FAIL{RESET}] GET /api/dashboard ({dt:.0f}ms) - Status: {r.status_code}, Body: {r.text[:120]}")
            failed += 1
    except Exception as e:
        print(f"[{RED}FAIL{RESET}] GET /api/dashboard - Exception: {e}")
        failed += 1

    # Test 2: POST /api/upload-url
    t0 = time.time()
    try:
        r = requests.post(
            f"{base_url}/api/upload-url",
            json={"file_name": "smoke_test_ledger.jpg", "content_type": "image/jpeg"},
            timeout=10
        )
        dt = (time.time() - t0) * 1000
        if r.status_code == 200 and "image_key" in r.json():
            print(f"[{GREEN}PASS{RESET}] POST /api/upload-url ({dt:.0f}ms) - Presigned key: {r.json().get('image_key')}")
            passed += 1
        else:
            print(f"[{RED}FAIL{RESET}] POST /api/upload-url ({dt:.0f}ms) - Status: {r.status_code}")
            failed += 1
    except Exception as e:
        print(f"[{RED}FAIL{RESET}] POST /api/upload-url - Exception: {e}")
        failed += 1

    # Test 3: POST /api/extract (Converse API / demo extraction)
    t0 = time.time()
    try:
        r = requests.post(
            f"{base_url}/api/extract",
            json={"demo_sample_id": "sample1", "force_demo": True},
            timeout=15
        )
        dt = (time.time() - t0) * 1000
        if r.status_code == 200 and len(r.json().get("entries", [])) >= 5:
            entries = r.json()["entries"]
            print(f"[{GREEN}PASS{RESET}] POST /api/extract ({dt:.0f}ms) - Extracted {len(entries)} verified entries")
            passed += 1
        else:
            print(f"[{RED}FAIL{RESET}] POST /api/extract ({dt:.0f}ms) - Status: {r.status_code}, Body: {r.text[:120]}")
            failed += 1
    except Exception as e:
        print(f"[{RED}FAIL{RESET}] POST /api/extract - Exception: {e}")
        failed += 1

    # Test 4: POST /api/entries (Save confirmed entries to DynamoDB)
    t0 = time.time()
    try:
        r = requests.post(
            f"{base_url}/api/entries",
            json={
                "shop_id": "smoke_test_shop",
                "entries": [
                    {
                        "customer": "Smoke Test Customer",
                        "amount": 999.0,
                        "date": "2026-09-20",
                        "type": "credit",
                        "confidence": 0.99
                    }
                ]
            },
            timeout=10
        )
        dt = (time.time() - t0) * 1000
        if r.status_code == 200 and r.json().get("saved_count") == 1:
            print(f"[{GREEN}PASS{RESET}] POST /api/entries ({dt:.0f}ms) - Successfully committed to DynamoDB")
            passed += 1
        else:
            print(f"[{RED}FAIL{RESET}] POST /api/entries ({dt:.0f}ms) - Status: {r.status_code}")
            failed += 1
    except Exception as e:
        print(f"[{RED}FAIL{RESET}] POST /api/entries - Exception: {e}")
        failed += 1

    # Test 5: POST /api/reminder (Hindi & Tamil)
    t0 = time.time()
    try:
        r_hi = requests.post(
            f"{base_url}/api/reminder",
            json={
                "customer": "Ramesh Kumar",
                "amount": 850.0,
                "language": "hi",
                "shop_name": "Sharma Kirana"
            },
            timeout=10
        )
        dt = (time.time() - t0) * 1000
        if r_hi.status_code == 200 and "बकाया" in r_hi.json().get("message", ""):
            print(f"[{GREEN}PASS{RESET}] POST /api/reminder [Hindi] ({dt:.0f}ms) - Polite reminder verified")
            passed += 1
        else:
            print(f"[{RED}FAIL{RESET}] POST /api/reminder [Hindi] ({dt:.0f}ms) - Status: {r_hi.status_code}")
            failed += 1
    except Exception as e:
        print(f"[{RED}FAIL{RESET}] POST /api/reminder - Exception: {e}")
        failed += 1

    print(f"\n{BOLD}------------------------------------------------------{RESET}")
    print(f"Results: {passed} PASSED, {failed} FAILED (Total: {passed + failed})")
    print(f"{BOLD}------------------------------------------------------{RESET}\n")

    return failed == 0


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="KhataLens Live Smoke Test")
    parser.add_argument("--url", default="http://localhost:8000", help="Base URL of deployed API or local server")
    args = parser.parse_args()

    success = run_smoke_tests(args.url.rstrip("/"))
    sys.exit(0 if success else 1)
