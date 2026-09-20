"""
Lambda Handler: Bedrock Vision Ledger Extraction
Extracts structured ledger records using Bedrock Converse API with Pydantic validation.
"""

import base64
import json
import logging
import os
import boto3
from botocore.exceptions import ClientError

from .utils import build_response
from ..extractor import extract_ledger_from_image

logger = logging.getLogger("khatalens.handlers.extract")
logger.setLevel(logging.INFO)

UPLOAD_BUCKET = os.environ.get("UPLOAD_BUCKET_NAME", "khatalens-uploads-prod")
AWS_REGION = os.environ.get("AWS_REGION", "us-east-1")


def lambda_handler(event, context):
    """
    POST /api/extract
    Body:
      {
        "image_key": "ledgers/abc.jpg",
        "image_base64": "<optional base64>",
        "image_format": "jpeg",
        "demo_sample_id": "sample1",
        "force_demo": false
      }
    """
    method = event.get("httpMethod") or event.get("requestContext", {}).get("http", {}).get("method")
    if method == "OPTIONS":
        return build_response(200, {"message": "CORS preflight OK"})

    try:
        body_raw = event.get("body") or "{}"
        body = json.loads(body_raw) if isinstance(body_raw, str) else body_raw

        image_key = body.get("image_key")
        image_base64 = body.get("image_base64")
        image_format = body.get("image_format", "jpeg")
        demo_sample_id = body.get("demo_sample_id")
        force_demo = body.get("force_demo", False)

        image_bytes = b""

        # 1. Check if base64 provided
        if image_base64:
            if "," in image_base64:
                image_base64 = image_base64.split(",", 1)[1]
            image_bytes = base64.b64decode(image_base64)
        # 2. Check if S3 key provided
        elif image_key and not force_demo:
            try:
                s3 = boto3.client("s3", region_name=AWS_REGION)
                response = s3.get_object(Bucket=UPLOAD_BUCKET, Key=image_key)
                image_bytes = response["Body"].read()
            except Exception as s3_err:
                logger.warning(f"Could not read from S3 ({s3_err}), fallback to sample")
                force_demo = True

        # Call the extractor engine
        result = extract_ledger_from_image(
            image_bytes=image_bytes,
            image_format=image_format,
            image_name=demo_sample_id or image_key,
            force_demo=force_demo
        )

        return build_response(200, result.model_dump())

    except Exception as e:
        logger.error(f"Error in ledger extraction handler: {e}", exc_info=True)
        return build_response(500, {"error": str(e), "status": "error"})
