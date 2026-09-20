"""Unit tests for Lambda API Gateway handlers."""

import json
from backend.src.handlers.upload import lambda_handler as upload_handler
from backend.src.handlers.extract import lambda_handler as extract_handler
from backend.src.handlers.entries import lambda_handler as entries_handler
from backend.src.handlers.dashboard import lambda_handler as dashboard_handler
from backend.src.handlers.reminder_handler import lambda_handler as reminder_handler


def test_upload_handler_success():
    event = {
        "httpMethod": "POST",
        "body": json.dumps({
            "file_name": "test_ledger.jpg",
            "content_type": "image/jpeg"
        })
    }
    resp = upload_handler(event, None)
    assert resp["statusCode"] == 200
    assert "Access-Control-Allow-Origin" in resp["headers"]
    body = json.loads(resp["body"])
    assert "upload_url" in body
    assert "image_key" in body


def test_upload_handler_reject_invalid_mime():
    event = {
        "httpMethod": "POST",
        "body": json.dumps({
            "file_name": "malicious.exe",
            "content_type": "application/x-msdownload"
        })
    }
    resp = upload_handler(event, None)
    assert resp["statusCode"] == 400


def test_extract_handler_demo():
    event = {
        "httpMethod": "POST",
        "body": json.dumps({
            "demo_sample_id": "sample1",
            "force_demo": True
        })
    }
    resp = extract_handler(event, None)
    assert resp["statusCode"] == 200
    body = json.loads(resp["body"])
    assert body["status"] == "success"
    assert len(body["entries"]) > 0


def test_entries_handler_confirm():
    event = {
        "httpMethod": "POST",
        "body": json.dumps({
            "shop_id": "test_shop",
            "entries": [
                {
                    "customer": "Vikram Singh",
                    "amount": 750.0,
                    "date": "2026-09-18",
                    "type": "credit",
                    "confidence": 0.95
                }
            ]
        })
    }
    resp = entries_handler(event, None)
    assert resp["statusCode"] == 200
    body = json.loads(resp["body"])
    assert body["status"] == "success"
    assert body["saved_count"] == 1


def test_dashboard_handler():
    event = {
        "httpMethod": "GET",
        "queryStringParameters": {"shop_id": "default"}
    }
    resp = dashboard_handler(event, None)
    assert resp["statusCode"] == 200
    body = json.loads(resp["body"])
    assert "total_outstanding" in body
    assert "aging" in body
    assert "customers" in body


def test_reminder_handler_multilingual():
    for lang in ("en", "hi", "ta"):
        event = {
            "httpMethod": "POST",
            "body": json.dumps({
                "customer": "Ramesh Kumar",
                "amount": 850.0,
                "language": lang,
                "shop_name": "Sharma Kirana"
            })
        }
        resp = reminder_handler(event, None)
        assert resp["statusCode"] == 200
        body = json.loads(resp["body"])
        assert body["customer"] == "Ramesh Kumar"
        assert len(body["message"]) > 0
