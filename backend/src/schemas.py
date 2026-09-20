"""
Pydantic Schemas for KhataLens
Enforces strict typing, input validation, and sanitization for ledger records,
aging calculations, and Bedrock Converse API structured outputs.
"""

from datetime import datetime, date
import re
from typing import List, Literal, Optional
from pydantic import BaseModel, Field, field_validator, model_validator


LedgerEntryType = Literal["credit", "payment"]
ReminderLanguage = Literal["en", "hi", "ta"]


class LedgerEntry(BaseModel):
    """Represents a single digitized financial ledger transaction."""
    id: Optional[str] = Field(default=None, description="Unique transaction UUID")
    customer: str = Field(..., min_length=1, max_length=120, description="Customer name or identifier")
    amount: float = Field(..., gt=0.0, description="Transaction amount in INR (positive number)")
    date: str = Field(..., description="Transaction date in YYYY-MM-DD format")
    type: LedgerEntryType = Field(..., description="'credit' for udhaar/debt, 'payment' for jama/settlement")
    confidence: float = Field(default=0.90, ge=0.0, le=1.0, description="AI extraction confidence score (0.0 to 1.0)")
    source_note: Optional[str] = Field(default="", max_length=255, description="Item details, notes, or Hindi annotations")

    @field_validator("customer")
    @classmethod
    def sanitize_customer_name(cls, v: str) -> str:
        # Strip control characters, excessive whitespace, and basic script tags
        sanitized = re.sub(r"[<>{}\[\]\\]", "", v).strip()
        if not sanitized:
            return "Unknown Customer"
        return sanitized

    @field_validator("date")
    @classmethod
    def validate_date_format(cls, v: str) -> str:
        v = v.strip()
        # Handle formats like YYYY-MM-DD or DD/MM/YYYY or DD-MM-YYYY
        for fmt in ("%Y-%m-%d", "%d/%m/%Y", "%d-%m-%Y", "%Y/%m/%d"):
            try:
                dt = datetime.strptime(v, fmt).date()
                return dt.strftime("%Y-%m-%d")
            except ValueError:
                pass
        # Fallback to current date if completely unparseable
        return date.today().strftime("%Y-%m-%d")

    @field_validator("source_note")
    @classmethod
    def sanitize_source_note(cls, v: Optional[str]) -> str:
        if not v:
            return ""
        return re.sub(r"[<>{}]", "", v).strip()


class ExtractionResponse(BaseModel):
    """Structured response returned by the Bedrock Converse Vision extraction pipeline."""
    entries: List[LedgerEntry] = Field(default_factory=list, description="Extracted records")
    model_id: str = Field(default="bedrock-vision", description="Amazon Bedrock model ID used")
    confidence_avg: float = Field(default=0.90, description="Average confidence across all rows")
    low_confidence_count: int = Field(default=0, description="Number of rows with confidence < 0.85")
    status: str = Field(default="success")
    warning: Optional[str] = None


class ConfirmEntriesRequest(BaseModel):
    """Payload sent by the merchant after human-in-the-loop review to persist records."""
    shop_id: str = Field(default="default", max_length=64)
    entries: List[LedgerEntry] = Field(..., min_length=1)
    image_key: Optional[str] = None


class AgingBuckets(BaseModel):
    """Aging breakdown of outstanding credit."""
    days_0_to_7: float = Field(default=0.0, description="Recent credit (0 to 7 days old)")
    days_8_to_30: float = Field(default=0.0, description="Moderate credit (8 to 30 days old)")
    days_30_plus: float = Field(default=0.0, description="High risk credit (>30 days old)")


class CustomerBalance(BaseModel):
    """Aggregated financial standing for a single customer."""
    customer: str
    total_credit: float = 0.0
    total_paid: float = 0.0
    net_balance: float = 0.0
    oldest_unpaid_date: Optional[str] = None
    last_transaction_date: Optional[str] = None
    entry_count: int = 0


class DashboardSummary(BaseModel):
    """High-level metrics for the merchant dashboard."""
    shop_id: str = "default"
    total_outstanding: float = 0.0
    total_customers: int = 0
    aging: AgingBuckets
    customers: List[CustomerBalance] = Field(default_factory=list)


class ReminderRequest(BaseModel):
    """Input payload for generating a polite payment reminder."""
    customer: str = Field(..., min_length=1)
    amount: float = Field(..., gt=0.0)
    language: ReminderLanguage = Field(default="en")
    shop_name: str = Field(default="Sharma Kirana Store")
    days_overdue: int = Field(default=0, ge=0)


class ReminderResponse(BaseModel):
    """Result of Bedrock polite reminder prompt."""
    customer: str
    amount: float
    language: ReminderLanguage
    message: str
    disclaimer: str = "Preview only. Review and copy to clipboard. KhataLens never auto-sends messages."
