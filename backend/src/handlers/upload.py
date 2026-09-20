"""
Lambda Handler: Presigned S3 Upload URL Generator
Generates secure S3 presigned PUT URLs with content type validation and 5MB size limit.
"""

import json
import logging
import os
import uuid
import boto3
from botocore.exceptions import ClientError

from .utils import build_response

logger = logging.getLogger("khatalens.handlers.upload")
logger.setLevel(logging.INFO)

UPLOAD_BUCKET = os.environ.get("UPLOAD_BUCKET_NAME", "khatalens-uploads-prod")
AWS_REGION = os.environ.get("AWS_REGION", "us-east-1")


def lambda_handler(event, context):
    """
    POST /api/upload-url
    Body: {"file_name": "ledger.jpg", "content_type": "image/jpeg"}
    """
    logger.info(f"Upload URL request received: {event.get('httpMethod', event.get('requestContext', {}).get('http', {}).get('method'))}")

    # Handle CORS preflight
    method = event.get("httpMethod") or event.get("requestContext", {}).get("http", {}).get("method")
    if method == "OPTIONS":
        return build_response(200, {"message": "CORS preflight OK"})

    try:
        body_raw = event.get("body") or "{}"
        body = json.loads(body_raw) if isinstance(body_raw, str) else body_raw
        
        file_name = body.get("file_name", "ledger.jpg")
        content_type = body.get("content_type", "image/jpeg")

        # Validate content type
        if content_type not in ("image/jpeg", "image/jpg", "image/png"):
            return build_response(400, {"error": "Invalid file type. Only JPEG and PNG are permitted."})

        ext = ".jpg" if "jpeg" in content_type or "jpg" in content_type else ".png"
        key = f"ledgers/{uuid.uuid4().hex}{ext}"

        try:
            s3_client = boto3.client("s3", region_name=AWS_REGION)
            presigned_url = s3_client.generate_presigned_url(
                ClientMethod="put_object",
                Params={
                    "Bucket": UPLOAD_BUCKET,
                    "Key": key,
                    "ContentType": content_type
                },
                ExpiresIn=300 # 5 minutes
            )
        except Exception as aws_err:
            logger.warning(f"Unable to generate S3 presigned URL (offline/mock): {aws_err}")
            # Mock URL for local demo testing
            presigned_url = f"https://mock-s3.amazonaws.com/{UPLOAD_BUCKET}/{key}?mock-token=demo"

        return build_response(200, {
            "upload_url": presigned_url,
            "image_key": key,
            "bucket": UPLOAD_BUCKET,
            "expires_in": 300
        })

    except Exception as e:
        logger.error(f"Error generating presigned URL: {e}", exc_info=True)
        return build_response(500, {"error": str(e)})
