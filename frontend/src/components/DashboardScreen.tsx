import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  MessageSquare,
  Clock,
  Calendar,
  AlertCircle,
  TrendingUp,
  RefreshCw,
  PlusCircle
} from 'lucide-react';
import type { DashboardSummary, CustomerBalance } from '../types';
import { getDashboard } from '../api';

interface DashboardScreenProps {
  onOpenReminderModal: (customer: CustomerBalance) => void;
  onNavigateToUpload: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onOpenReminderModal,
  onNavigateToUpload
}) => {
  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchSummary = async () => {
    setLoading(true);
    const data = await getDashboard();
    setDashboard(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (loading || !dashboard) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 rounded-full border-4 border-orange-200 border-t-orange-600 animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold text-slate-700">Loading Dues & Aging Analytics from DynamoDB...</p>
      </div>
    );
  }

  // Filter customers by search
  const filteredCustomers = dashboard.customers.filter((c) =>
    c.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Outstanding Udhaar Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time credit totals, FIFO aging risk, and polite payment reminders
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchSummary}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 shadow-2xs transition-colors"
            title="Refresh dashboard"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={onNavigateToUpload}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-orange-600/20 active:scale-98 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Scan Another Page</span>
          </button>
        </div>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Outstanding */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Outstanding</p>
            <h3 className="text-2xl font-black text-rose-600 mt-1">
              ₹{dashboard.total_outstanding.toLocaleString('en-IN')}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">Across {dashboard.total_customers} customers</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* 0-7 Days Aging */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">0 - 7 Days</p>
            </div>
            <h3 className="text-2xl font-black text-slate-800 mt-1">
              ₹{dashboard.aging.days_0_to_7.toLocaleString('en-IN')}
            </h3>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">Recent • Low Risk</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* 8-30 Days Aging */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">8 - 30 Days</p>
            </div>
            <h3 className="text-2xl font-black text-slate-800 mt-1">
              ₹{dashboard.aging.days_8_to_30.toLocaleString('en-IN')}
            </h3>
            <p className="text-[11px] text-amber-600 font-medium mt-1">Follow-up Recommended</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        {/* 30+ Days Aging */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-red-600" />
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">30+ Days</p>
            </div>
            <h3 className="text-2xl font-black text-red-600 mt-1">
              ₹{dashboard.aging.days_30_plus.toLocaleString('en-IN')}
            </h3>
            <p className="text-[11px] text-red-600 font-medium mt-1">Urgent Overdue</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Customer List Section */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        {/* Controls */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search customer by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-orange-500"
            />
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <Users className="w-4 h-4" />
            <span>Showing {filteredCustomers.length} debtor accounts</span>
          </div>
        </div>

        {/* Table / Mobile Cards */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-100/70 text-slate-600 border-b border-slate-200 font-semibold">
                <th className="py-3 px-4">Customer / ग्राहक</th>
                <th className="py-3 px-4">Total Credit</th>
                <th className="py-3 px-4">Paid (Jama)</th>
                <th className="py-3 px-4">Net Pending</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-4 text-right">Reminder Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((cust, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {cust.customer}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    ₹{cust.total_credit.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-emerald-600 font-medium">
                    ₹{cust.total_paid.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-extrabold text-rose-600">
                      ₹{cust.net_balance.toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-500">
                    {cust.last_transaction_date || 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onOpenReminderModal(cust)}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold text-xs border border-orange-200 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-orange-600" />
                      <span>Draft Reminder</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
