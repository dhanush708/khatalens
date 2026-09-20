"""
Local FastAPI Development & Demonstration Server for KhataLens
Allows full local testing of the backend API, Bedrock inference, and demo workflows.
"""

import base64
import os
from fastapi import FastAPI, UploadFile, File, Form, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse

from backend.src.schemas import (
    ConfirmEntriesRequest,
    ReminderRequest,
    ExtractionResponse,
    LedgerEntry
)
from backend.src.extractor import extract_ledger_from_image, get_synthetic_fallback
from backend.src.dynamo import save_confirmed_entries, compute_dashboard_summary
from backend.src.reminder import draft_reminder_message

app = FastAPI(title="KhataLens API", version="1.0.0")

# Enable CORS for local React development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SAMPLES_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "samples")
if os.path.exists(SAMPLES_DIR):
    app.mount("/samples", StaticFiles(directory=SAMPLES_DIR), name="samples")


@app.post("/api/upload-url")
async def get_upload_url(payload: dict):
    file_name = payload.get("file_name", "ledger.jpg")
    content_type = payload.get("content_type", "image/jpeg")
    return {
        "upload_url": f"http://localhost:8000/api/mock-upload",
        "image_key": f"ledgers/{file_name}",
        "bucket": "khatalens-uploads-local",
        "expires_in": 300
    }


@app.put("/api/mock-upload")
async def mock_upload():
    return {"status": "success", "message": "Image uploaded successfully"}


@app.post("/api/extract", response_model=ExtractionResponse)
async def extract_ledger(payload: dict):
    image_base64 = payload.get("image_base64")
    image_format = payload.get("image_format", "jpeg")
    demo_sample_id = payload.get("demo_sample_id")
    force_demo = payload.get("force_demo", False)

    image_bytes = b""
    if image_base64:
        if "," in image_base64:
            image_base64 = image_base64.split(",", 1)[1]
        image_bytes = base64.b64decode(image_base64)

    return extract_ledger_from_image(
        image_bytes=image_bytes,
        image_format=image_format,
        image_name=demo_sample_id,
        force_demo=force_demo
    )


@app.post("/api/entries")
async def save_entries(req: ConfirmEntriesRequest):
    saved_count = save_confirmed_entries(req.shop_id, req.entries, req.image_key)
    return {
        "status": "success",
        "message": f"Successfully committed {saved_count} entries to Khata.",
        "saved_count": saved_count
    }


@app.get("/api/dashboard")
async def get_dashboard(shop_id: str = Query(default="default")):
    return compute_dashboard_summary(shop_id=shop_id)


@app.post("/api/reminder")
async def create_reminder(req: ReminderRequest):
    return draft_reminder_message(req)


@app.get("/api/accuracy-benchmark")
async def get_accuracy_benchmark():
    benchmark_path = os.path.join(SAMPLES_DIR, "benchmark_summary.json")
    if os.path.exists(benchmark_path):
        import json
        with open(benchmark_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"status": "not_found"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.local_server:app", host="0.0.0.0", port=8000, reload=True)
