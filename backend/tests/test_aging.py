"""Unit tests for FIFO aging calculation and balance aggregation."""

from datetime import date
from backend.src.dynamo import calculate_fifo_aging, compute_dashboard_summary, save_confirmed_entries
from backend.src.schemas import LedgerEntry


def test_fifo_aging_no_payments():
    ref_date = date(2026, 9, 20)
    credits = [
        {"amount": 500.0, "date": "2026-09-18"}, # 2 days old -> 0-7
        {"amount": 300.0, "date": "2026-09-05"}, # 15 days old -> 8-30
        {"amount": 1000.0, "date": "2026-08-01"}, # 50 days old -> 30+
    ]
    buckets = calculate_fifo_aging(credits, total_paid=0.0, reference_date=ref_date)
    assert buckets["0_to_7"] == 500.0
    assert buckets["8_to_30"] == 300.0
    assert buckets["30_plus"] == 1000.0


def test_fifo_aging_partial_payment_satisfies_oldest_first():
    ref_date = date(2026, 9, 20)
    credits = [
        {"amount": 1000.0, "date": "2026-08-01"}, # Oldest: 50 days old
        {"amount": 400.0, "date": "2026-09-18"},  # Newest: 2 days old
    ]
    # Customer pays 1000 (clearing the old 50-day debt completely)
    buckets = calculate_fifo_aging(credits, total_paid=1000.0, reference_date=ref_date)
    assert buckets["30_plus"] == 0.0
    assert buckets["0_to_7"] == 400.0


def test_fifo_aging_partial_satisfaction_of_bucket():
    ref_date = date(2026, 9, 20)
    credits = [
        {"amount": 1000.0, "date": "2026-08-01"}, # Oldest: 50 days old
    ]
    # Customer pays 600, leaving 400 unpaid in the 30+ bucket
    buckets = calculate_fifo_aging(credits, total_paid=600.0, reference_date=ref_date)
    assert buckets["30_plus"] == 400.0
    assert buckets["0_to_7"] == 0.0
    assert buckets["8_to_30"] == 0.0


def test_dashboard_summary_computation():
    shop_id = "test_shop"
    entries = [
        LedgerEntry(customer="Customer A", amount=1000.0, date="2026-09-15", type="credit", confidence=0.95),
        LedgerEntry(customer="Customer A", amount=300.0, date="2026-09-17", type="payment", confidence=0.95),
        LedgerEntry(customer="Customer B", amount=500.0, date="2026-09-18", type="credit", confidence=0.95),
    ]
    save_confirmed_entries(shop_id, entries)
    summary = compute_dashboard_summary(shop_id=shop_id, reference_date=date(2026, 9, 20))

    # Customer A has 1000 - 300 = 700 net
    # Customer B has 500 net
    # Total outstanding = 1200
    assert summary.total_outstanding == 1200.0
    assert summary.total_customers == 2
    assert summary.aging.days_0_to_7 == 1200.0
