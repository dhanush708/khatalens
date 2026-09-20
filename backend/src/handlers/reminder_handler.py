"""
Lambda Handler: Multilingual Polite Payment Reminder
Drafts courteous payment reminder message in English, Hindi, or Tamil using Bedrock.
"""

import json
import logging
from .utils import build_response
from ..schemas import ReminderRequest
from ..reminder import draft_reminder_message

logger = logging.getLogger("khatalens.handlers.reminder")
logger.setLevel(logging.INFO)


def lambda_handler(event, context):
    """
    POST /api/reminder
    Body:
      {
        "customer": "Ramesh Kumar",
        "amount": 850.0,
        "language": "hi",
        "shop_name": "Sharma Kirana Store"
      }
    """
    method = event.get("httpMethod") or event.get("requestContext", {}).get("http", {}).get("method")
    if method == "OPTIONS":
        return build_response(200, {"message": "CORS preflight OK"})

    try:
        body_raw = event.get("body") or "{}"
        body = json.loads(body_raw) if isinstance(body_raw, str) else body_raw

        req = ReminderRequest(**body)
        res = draft_reminder_message(req)
        return build_response(200, res.model_dump())

    except Exception as e:
        logger.error(f"Error drafting payment reminder: {e}", exc_info=True)
        return build_response(400, {"error": str(e), "status": "error"})
