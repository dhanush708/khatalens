"""Unit tests for Pydantic schemas and input sanitization."""

import pytest
from pydantic import ValidationError
from backend.src.schemas import LedgerEntry, ConfirmEntriesRequest, ReminderRequest


def test_valid_ledger_entry():
    entry = LedgerEntry(
        customer="Ramesh Kumar",
        amount=850.50,
        date="2026-09-12",
        type="credit",
        confidence=0.98,
        source_note="Atta 10kg, Dal 2kg"
    )
    assert entry.customer == "Ramesh Kumar"
    assert entry.amount == 850.50
    assert entry.type == "credit"
    assert entry.confidence == 0.98


def test_customer_name_sanitization():
    # Attempting to inject HTML or script tags into customer name
    entry = LedgerEntry(
        customer="<script>alert(1)</script> Suresh Gupta",
        amount=120.0,
        date="2026-09-15",
        type="credit",
        confidence=0.9
    )
    assert "<script>" not in entry.customer
    assert "Suresh Gupta" in entry.customer


def test_date_auto_normalization():
    # Testing DD/MM/YYYY formatting converted to YYYY-MM-DD
    entry = LedgerEntry(
        customer="Anita Sharma",
        amount=450.0,
        date="18/09/2026",
        type="credit"
    )
    assert entry.date == "2026-09-18"


def test_reject_zero_or_negative_amount():
    with pytest.raises(ValidationError):
        LedgerEntry(
            customer="Amit",
            amount=0.0, # Must be > 0.0
            date="2026-09-15",
            type="credit"
        )

    with pytest.raises(ValidationError):
        LedgerEntry(
            customer="Amit",
            amount=-250.0,
            date="2026-09-15",
            type="credit"
        )


def test_reject_invalid_transaction_type():
    with pytest.raises(ValidationError):
        LedgerEntry(
            customer="Deepak",
            amount=500.0,
            date="2026-09-15",
            type="unknown_type" # Only 'credit' or 'payment' allowed
        )


def test_reminder_request_validation():
    req = ReminderRequest(
        customer="Ramesh Kumar",
        amount=850.0,
        language="hi",
        shop_name="Sharma Kirana"
    )
    assert req.language == "hi"
    assert req.amount == 850.0

    with pytest.raises(ValidationError):
        ReminderRequest(
            customer="Ramesh",
            amount=500.0,
            language="fr" # Only 'en', 'hi', 'ta' supported
        )
