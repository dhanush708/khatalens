"""
Lambda Handler: Save Confirmed Ledger Entries
Persists merchant-verified records to DynamoDB single table.
"""

import json
import logging
from .utils import build_response
from ..schemas import ConfirmEntriesRequest
from ..dynamo import save_confirmed_entries

logger = logging.getLogger("khatalens.handlers.entries")
logger.setLevel(logging.INFO)


def lambda_handler(event, context):
    """
    POST /api/entries
    Body:
      {
        "shop_id": "default",
        "entries": [...],
        "image_key": "..."
      }
    """
    method = event.get("httpMethod") or event.get("requestContext", {}).get("http", {}).get("method")
    if method == "OPTIONS":
        return build_response(200, {"message": "CORS preflight OK"})

    try:
        body_raw = event.get("body") or "{}"
        body = json.loads(body_raw) if isinstance(body_raw, str) else body_raw

        req = ConfirmEntriesRequest(**body)
        saved_count = save_confirmed_entries(
            shop_id=req.shop_id,
            entries=req.entries,
            image_key=req.image_key
        )

        return build_response(200, {
            "status": "success",
            "message": f"Successfully confirmed and committed {saved_count} entries.",
            "saved_count": saved_count
        })

    except Exception as e:
        logger.error(f"Error saving entries: {e}", exc_info=True)
        return build_response(400, {"error": str(e), "status": "error"})
