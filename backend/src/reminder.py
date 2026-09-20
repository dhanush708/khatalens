"""
Multilingual Polite Payment Reminder Generator for KhataLens
Uses Amazon Bedrock to draft culturally respectful, non-confrontational payment
reminders in English, Hindi (हिन्दी), and Tamil (தமிழ்).
Strict Safety: Copy-only output, never auto-sends.
"""

import logging
import os
import boto3
from botocore.exceptions import ClientError

from .schemas import ReminderRequest, ReminderResponse

logger = logging.getLogger("khatalens.reminder")
DEFAULT_MODEL_ID = os.environ.get("BEDROCK_MODEL_ID", "anthropic.claude-3-5-sonnet-20240620-v1:0")
AWS_REGION = os.environ.get("AWS_REGION", "us-east-1")


# High quality deterministic templates for instant preview and offline demo
TEMPLATES = {
    "en": (
        "Hello {customer},\n\n"
        "Warm greetings from {shop_name}. We hope you and your family are doing well.\n"
        "This is a gentle reminder regarding your outstanding ledger balance of ₹{amount:,.2f}.\n"
        "Whenever it is convenient, kindly settle the balance via UPI or during your next visit.\n\n"
        "Thank you for your continued trust and patronage!\n"
        "— {shop_name}"
    ),
    "hi": (
        "नमस्ते {customer} जी,\n\n"
        "{shop_name} की तरफ से सादर प्रणाम। आशा है आप सपरिवार सकुशल हैं।\n"
        "यह एक विनम्र संदेश है कि आपकी पुरानी बहीखाता बकाया राशि ₹{amount:,.2f} है।\n"
        "कृपया अपनी सुविधानुसार UPI अथवा दुकान पर आकर भुगतान करने की कृपा करें।\n\n"
        "आपके विश्वास और सहयोग के लिए हार्दिक धन्यवाद!\n"
        "— {shop_name}"
    ),
    "ta": (
        "வணக்கம் {customer} அவர்களே,\n\n"
        "{shop_name}-ன் அன்பான வணக்கங்கள். நீங்களும் உங்கள் குடும்பத்தினரும் நலமாக இருக்க வாழ்த்துகிறோம்.\n"
        "தங்களுடைய முந்தைய கணக்கு பாக்கி தொகை ₹{amount:,.2f} நிலுவையில் உள்ளது என்பதை பணிவுடன் நினைவூட்டுகிறோம்.\n"
        "தங்களுக்கு வசதியான நேரத்தில் UPI மூலமாகவோ அல்லது கடைக்கு வரும்போதோ செலுத்துமாறு அன்புடன் கேட்டுக்கொள்கிறோம்.\n\n"
        "தங்களின் தொடர் ஆதரவுக்கு மனமார்ந்த நன்றிகள்!\n"
        "— {shop_name}"
    )
}


def draft_reminder_message(req: ReminderRequest, force_demo: bool = False) -> ReminderResponse:
    """Drafts polite payment reminder using Amazon Bedrock with robust fallback."""
    if force_demo or os.environ.get("DEMO_MODE", "").lower() in ("true", "1"):
        template = TEMPLATES.get(req.language, TEMPLATES["en"])
        message = template.format(
            customer=req.customer,
            shop_name=req.shop_name,
            amount=req.amount
        )
        return ReminderResponse(
            customer=req.customer,
            amount=req.amount,
            language=req.language,
            message=message
        )

    try:
        client = boto3.client("bedrock-runtime", region_name=AWS_REGION)
        lang_names = {"en": "English", "hi": "Hindi (written in Devanagari script)", "ta": "Tamil (written in Tamil script)"}
        target_lang = lang_names.get(req.language, "English")

        prompt = f"""Draft a short, warm, and polite payment reminder for a local Indian retail shopkeeper to send to their customer.

Details:
- Customer Name: {req.customer}
- Shop Name: {req.shop_name}
- Pending Amount: ₹{req.amount:,.2f}
- Language: {target_lang}

Guidelines:
1. Tone must be deeply respectful, humble, and polite (never harsh, threatening, or sounding like a debt collector).
2. Mention the shop name, customer name, and exact amount.
3. Suggest paying via UPI or on their next visit at their convenience.
4. Output ONLY the message text ready to be sent. No preamble or explanations."""

        response = client.converse(
            modelId=DEFAULT_MODEL_ID,
            messages=[{"role": "user", "content": [{"text": prompt}]}]
        )

        content = response["output"]["message"]["content"][0]["text"].strip()
        return ReminderResponse(
            customer=req.customer,
            amount=req.amount,
            language=req.language,
            message=content
        )

    except Exception as e:
        logger.warning(f"Bedrock reminder prompt failed, using native template: {e}")
        template = TEMPLATES.get(req.language, TEMPLATES["en"])
        message = template.format(
            customer=req.customer,
            shop_name=req.shop_name,
            amount=req.amount
        )
        return ReminderResponse(
            customer=req.customer,
            amount=req.amount,
            language=req.language,
            message=message
        )
