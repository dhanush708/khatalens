"""
DynamoDB Single-Table Persistence & Aging Analytics for KhataLens
Stores confirmed ledger entries and calculates:
- Net customer balances (Total Udhaar - Total Jama)
- Accurate FIFO Aging Buckets (0-7 Days, 8-30 Days, 30+ Days)
- Real-time shopkeeper dashboard summaries
"""

from datetime import datetime, date
import logging
import os
import uuid
from typing import List, Dict, Any, Optional
import boto3
from botocore.exceptions import ClientError

from .schemas import (
    LedgerEntry,
    DashboardSummary,
    CustomerBalance,
    AgingBuckets
)

logger = logging.getLogger("khatalens.dynamo")
TABLE_NAME = os.environ.get("DYNAMODB_TABLE_NAME", "khatalens-entries-prod")
AWS_REGION = os.environ.get("AWS_REGION", "us-east-1")

# In-memory storage for local test / demo mode when AWS is offline
IN_MEMORY_STORE: Dict[str, List[Dict[str, Any]]] = {
    "default": [
        {"id": "entry-1", "customer": "Ramesh Kumar", "amount": 850.0, "date": "2026-09-12", "type": "credit", "confidence": 0.97, "source_note": "Atta 10kg, Dal 2kg"},
        {"id": "entry-2", "customer": "Suresh Gupta", "amount": 420.0, "date": "2026-09-14", "type": "credit", "confidence": 0.95, "source_note": "Chini 2kg, Chai Patti"},
        {"id": "entry-3", "customer": "Amit Verma", "amount": 500.0, "date": "2026-09-15", "type": "payment", "confidence": 0.94, "source_note": "Jama kiya (cash returned)"},
        {"id": "entry-4", "customer": "Pooja Sharma", "amount": 1250.0, "date": "2026-09-16", "type": "credit", "confidence": 0.96, "source_note": "Ghee 1kg, Masale packet"},
        {"id": "entry-5", "customer": "Rajesh Singh", "amount": 630.0, "date": "2026-09-18", "type": "credit", "confidence": 0.92, "source_note": "Basmati Rice 5kg"},
        {"id": "entry-6", "customer": "Amit Verma", "amount": 950.0, "date": "2026-08-15", "type": "credit", "confidence": 0.95, "source_note": "Old ledger balance (30+ days)"}
    ]
}


def get_dynamodb_resource():
    try:
        return boto3.resource("dynamodb", region_name=AWS_REGION)
    except Exception as e:
        logger.warning(f"Unable to connect to DynamoDB: {e}")
        return None


def calculate_fifo_aging(
    credit_transactions: List[Dict[str, Any]],
    total_paid: float,
    reference_date: Optional[date] = None
) -> Dict[str, float]:
    """
    Applies standard FIFO (First-In, First-Out) debt settlement:
    Payments satisfy the oldest unpaid credit entries first.
    The remaining unsettled credit amounts are categorized into aging buckets.
    """
    if reference_date is None:
        reference_date = date.today()

    # Sort credits chronologically (oldest first)
    sorted_credits = sorted(credit_transactions, key=lambda x: x.get("date", "9999-99-99"))
    
    remaining_payment = total_paid
    buckets = {"0_to_7": 0.0, "8_to_30": 0.0, "30_plus": 0.0}

    for cred in sorted_credits:
        cred_amt = float(cred.get("amount", 0.0))
        if remaining_payment >= cred_amt:
            # Entire credit transaction is satisfied by past payments
            remaining_payment -= cred_amt
            continue
        else:
            # Partial or full unpaid balance remains on this transaction
            unpaid_portion = cred_amt - remaining_payment
            remaining_payment = 0.0

            try:
                entry_dt = datetime.strptime(cred.get("date", ""), "%Y-%m-%d").date()
                age_days = (reference_date - entry_dt).days
            except Exception:
                age_days = 0

            if age_days <= 7:
                buckets["0_to_7"] += unpaid_portion
            elif age_days <= 30:
                buckets["8_to_30"] += unpaid_portion
            else:
                buckets["30_plus"] += unpaid_portion

    return buckets


def save_confirmed_entries(shop_id: str, entries: List[LedgerEntry], image_key: Optional[str] = None) -> int:
    """Persists human-confirmed entries to DynamoDB table or in-memory store."""
    db = get_dynamodb_resource()
    table = db.Table(TABLE_NAME) if db else None

    timestamp = datetime.utcnow().isoformat()
    saved_count = 0

    items_to_save = []
    for entry in entries:
        entry_id = entry.id or f"ent_{uuid.uuid4().hex[:8]}"
        item = {
            "PK": f"SHOP#{shop_id}",
            "SK": f"ENTRY#{entry.date}#{entry_id}",
            "id": entry_id,
            "customer": entry.customer,
            "amount": entry.amount,
            "date": entry.date,
            "type": entry.type,
            "confidence": entry.confidence,
            "source_note": entry.source_note or "",
            "image_key": image_key or "",
            "created_at": timestamp
        }
        items_to_save.append(item)

    if table:
        try:
            with table.batch_writer() as batch:
                for item in items_to_save:
                    batch.put_item(Item=item)
            saved_count = len(items_to_save)
        except Exception as err:
            logger.warning(f"Failed writing to DynamoDB, updating in-memory store: {err}")
            if shop_id not in IN_MEMORY_STORE:
                IN_MEMORY_STORE[shop_id] = []
            IN_MEMORY_STORE[shop_id].extend(items_to_save)
            saved_count = len(items_to_save)
    else:
        if shop_id not in IN_MEMORY_STORE:
            IN_MEMORY_STORE[shop_id] = []
        IN_MEMORY_STORE[shop_id].extend(items_to_save)
        saved_count = len(items_to_save)

    return saved_count


def compute_dashboard_summary(shop_id: str = "default", reference_date: Optional[date] = None) -> DashboardSummary:
    """
    Computes real-time dues dashboard:
    1. Fetches all shop transactions.
    2. Groups by customer and tallies Net Balance = (Total Credit - Total Payments).
    3. Runs FIFO aging analysis for outstanding balances.
    """
    if reference_date is None:
        # Use September 20, 2026 for consistent demo alignment if needed
        reference_date = date.today()

    db = get_dynamodb_resource()
    raw_entries = []

    if db:
        try:
            table = db.Table(TABLE_NAME)
            response = table.query(
                KeyConditionExpression="PK = :pk",
                ExpressionAttributeValues={":pk": f"SHOP#{shop_id}"}
            )
            raw_entries = response.get("Items", [])
        except Exception as e:
            logger.warning(f"DynamoDB query failed, reading in-memory store: {e}")
            raw_entries = IN_MEMORY_STORE.get(shop_id, [])
    else:
        raw_entries = IN_MEMORY_STORE.get(shop_id, [])

    # Group by customer
    customers_map: Dict[str, Dict[str, Any]] = {}

    for item in raw_entries:
        cust_name = item.get("customer", "Unknown")
        if cust_name not in customers_map:
            customers_map[cust_name] = {
                "customer": cust_name,
                "credits": [],
                "total_paid": 0.0,
                "dates": [],
                "entry_count": 0
            }

        c_data = customers_map[cust_name]
        c_data["entry_count"] += 1
        amt = float(item.get("amount", 0.0))
        entry_type = item.get("type", "credit")
        entry_date = item.get("date", "")

        if entry_date:
            c_data["dates"].append(entry_date)

        if entry_type == "credit":
            c_data["credits"].append(item)
        else:
            c_data["total_paid"] += amt

    customer_balances: List[CustomerBalance] = []
    total_shop_outstanding = 0.0
    overall_aging = {"0_to_7": 0.0, "8_to_30": 0.0, "30_plus": 0.0}

    for cust_name, c_data in customers_map.items():
        total_credit = sum(float(x.get("amount", 0.0)) for x in c_data["credits"])
        total_paid = c_data["total_paid"]
        net_balance = max(0.0, total_credit - total_paid)

        c_data["dates"].sort()
        oldest_date = c_data["dates"][0] if c_data["dates"] else None
        latest_date = c_data["dates"][-1] if c_data["dates"] else None

        # Compute aging for this customer
        cust_aging = calculate_fifo_aging(c_data["credits"], total_paid, reference_date)
        overall_aging["0_to_7"] += cust_aging["0_to_7"]
        overall_aging["8_to_30"] += cust_aging["8_to_30"]
        overall_aging["30_plus"] += cust_aging["30_plus"]
        total_shop_outstanding += net_balance

        customer_balances.append(
            CustomerBalance(
                customer=cust_name,
                total_credit=round(total_credit, 2),
                total_paid=round(total_paid, 2),
                net_balance=round(net_balance, 2),
                oldest_unpaid_date=oldest_date,
                last_transaction_date=latest_date,
                entry_count=c_data["entry_count"]
            )
        )

    # Sort customers by highest outstanding balance
    customer_balances.sort(key=lambda x: x.net_balance, reverse=True)

    return DashboardSummary(
        shop_id=shop_id,
        total_outstanding=round(total_shop_outstanding, 2),
        total_customers=len(customer_balances),
        aging=AgingBuckets(
            days_0_to_7=round(overall_aging["0_to_7"], 2),
            days_8_to_30=round(overall_aging["8_to_30"], 2),
            days_30_plus=round(overall_aging["30_plus"], 2)
        ),
        customers=customer_balances
    )
