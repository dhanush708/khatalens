export type LedgerEntryType = 'credit' | 'payment';
export type ReminderLanguage = 'en' | 'hi' | 'ta';

export interface LedgerEntry {
  id?: string;
  customer: string;
  amount: number;
  date: string;
  type: LedgerEntryType;
  confidence: number;
  source_note?: string;
}

export interface ExtractionResponse {
  entries: LedgerEntry[];
  model_id: string;
  confidence_avg: number;
  low_confidence_count: number;
  status: string;
  warning?: string;
}

export interface AgingBuckets {
  days_0_to_7: number;
  days_8_to_30: number;
  days_30_plus: number;
}

export interface CustomerBalance {
  customer: string;
  total_credit: number;
  total_paid: number;
  net_balance: number;
  oldest_unpaid_date?: string;
  last_transaction_date?: string;
  entry_count: number;
}

export interface DashboardSummary {
  shop_id: string;
  total_outstanding: number;
  total_customers: number;
  aging: AgingBuckets;
  customers: CustomerBalance[];
}

export interface ReminderRequest {
  customer: string;
  amount: number;
  language: ReminderLanguage;
  shop_name: string;
  days_overdue?: number;
}

export interface ReminderResponse {
  customer: string;
  amount: number;
  language: ReminderLanguage;
  message: string;
  disclaimer: string;
}

export interface SampleLedger {
  id: string;
  title: string;
  filename: string;
  truth_file: string;
  description: string;
  store_type: string;
}
