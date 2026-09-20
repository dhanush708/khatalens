"""
Lambda Handler: Dues Dashboard & Aging Metrics
Returns total outstanding dues, customer balances, and FIFO aging buckets.
"""

import json
import logging
from .utils import build_response
from ..dynamo import compute_dashboard_summary

logger = logging.getLogger("khatalens.handlers.dashboard")
logger.setLevel(logging.INFO)


def lambda_handler(event, context):
    """
    GET /api/dashboard?shop_id=default
    """
    method = event.get("httpMethod") or event.get("requestContext", {}).get("http", {}).get("method")
    if method == "OPTIONS":
        return build_response(200, {"message": "CORS preflight OK"})

    try:
        params = event.get("queryStringParameters") or {}
        shop_id = params.get("shop_id", "default")

        summary = compute_dashboard_summary(shop_id=shop_id)
        return build_response(200, summary.model_dump())

    except Exception as e:
        logger.error(f"Error computing dashboard summary: {e}", exc_info=True)
        return build_response(500, {"error": str(e), "status": "error"})
