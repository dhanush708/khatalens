import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  Save,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import type { LedgerEntry } from '../types';
import { confirmEntries } from '../api';

interface ReviewScreenProps {
  entries: LedgerEntry[];
  imageUrl: string;
  onConfirmSuccess: () => void;
  onBackToUpload: () => void;
  modelId?: string;
}

export const ReviewScreen: React.FC<ReviewScreenProps> = ({
  entries: initialEntries,
  imageUrl,
  onConfirmSuccess,
  onBackToUpload,
  modelId = 'bedrock-vision'
}) => {
  const [entries, setEntries] = useState<LedgerEntry[]>(initialEntries);
  const [zoom, setZoom] = useState(1);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleCellChange = (index: number, field: keyof LedgerEntry, value: any) => {
    const updated = [...entries];
    updated[index] = {
      ...updated[index],
      [field]: field === 'amount' ? (parseFloat(value) || 0) : value,
      // If user edits a row, elevate confidence
      confidence: field === 'confidence' ? value : Math.max(updated[index].confidence, 0.95)
    };
    setEntries(updated);
  };

  const handleAddRow = () => {
    const newRow: LedgerEntry = {
      customer: 'New Customer',
      amount: 100.0,
      date: new Date().toISOString().split('T')[0],
      type: 'credit',
      confidence: 1.0,
      source_note: 'Manual entry'
    };
    setEntries([...entries, newRow]);
  };

  const handleDeleteRow = (index: number) => {
    if (entries.length <= 1) {
      alert('At least one entry must remain in the ledger review.');
      return;
    }
    setEntries(entries.filter((_, idx) => idx !== index));
  };

  const handleSaveToKhata = async () => {
    try {
      setSaving(true);
      setSaveError(null);
      await confirmEntries(entries);
      setSaving(false);
      onConfirmSuccess();
    } catch (err: any) {
      setSaving(false);
      setSaveError(err.message || 'Failed to save confirmed entries');
    }
  };

  const totalCredit = entries
    .filter((e) => e.type === 'credit')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalPayment = entries
    .filter((e) => e.type === 'payment')
    .reduce((sum, e) => sum + e.amount, 0);

  const lowConfidenceCount = entries.filter((e) => e.confidence < 0.85).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBackToUpload}
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
            title="Back to upload"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center space-x-2">
              <span>Review & Verify Ledger</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                Human-in-the-Loop
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Compare AI extraction against your notebook page. Edit any number before saving.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleSaveToKhata}
            disabled={saving}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 active:scale-98 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Committing to DynamoDB...' : 'Confirm & Save to Khata'}</span>
          </button>
        </div>
      </div>

      {/* Model & Security Banner */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-3.5 h-3.5 text-orange-600" />
          <span>Extracted using: <strong>{modelId}</strong></span>
        </div>
        {lowConfidenceCount > 0 ? (
          <div className="flex items-center space-x-1.5 text-amber-700 font-semibold">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{lowConfidenceCount} ambiguous row(s) flagged in amber for review</span>
          </div>
        ) : (
          <div className="flex items-center space-x-1.5 text-emerald-700 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>All entries extracted with high confidence</span>
          </div>
        )}
      </div>

      {saveError && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">
          {saveError}
        </div>
      )}

      {/* Split Screen Container */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Original Ledger Viewer */}
        <div className="lg:col-span-5 flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Original Notebook Page
            </span>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setZoom(Math.max(0.6, zoom - 0.2))}
                className="p-1 rounded hover:bg-slate-200 text-slate-600"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono font-medium text-slate-500 w-10 text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom(Math.min(2.5, zoom + 0.2))}
                className="p-1 rounded hover:bg-slate-200 text-slate-600"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoom(1)}
                className="p-1 rounded hover:bg-slate-200 text-slate-600 ml-1"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="relative flex-1 min-h-[400px] max-h-[650px] overflow-auto bg-slate-900/5 p-4 flex items-center justify-center">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Uploaded Handwritten Ledger"
                style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
                className="transition-transform duration-150 max-w-full rounded shadow-sm border border-slate-300"
              />
            ) : (
              <p className="text-xs text-slate-400">No image loaded</p>
            )}
          </div>
        </div>

        {/* Right: Editable Extracted Table */}
        <div className="lg:col-span-7 flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-3.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Extracted Records ({entries.length})
            </span>
            <button
              onClick={handleAddRow}
              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-600" />
              <span>Add Row</span>
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto flex-1 max-h-[550px]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Customer / ग्राहक</th>
                  <th className="py-2.5 px-3">Amount (₹)</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Item / Notes</th>
                  <th className="py-2.5 px-3 text-center">Conf.</th>
                  <th className="py-2.5 px-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {entries.map((entry, idx) => {
                  const isLowConf = entry.confidence < 0.85;
                  return (
                    <tr
                      key={idx}
                      className={`transition-colors ${
                        isLowConf
                          ? 'bg-amber-50/70 hover:bg-amber-100/50'
                          : 'hover:bg-slate-50/70'
                      }`}
                    >
                      {/* Type Toggle */}
                      <td className="py-2 px-3">
                        <select
                          value={entry.type}
                          onChange={(e) => handleCellChange(idx, 'type', e.target.value)}
                          className={`font-semibold rounded px-2 py-1 border text-xs cursor-pointer ${
                            entry.type === 'credit'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          <option value="credit">Credit (बाकी)</option>
                          <option value="payment">Payment (जमा)</option>
                        </select>
                      </td>

                      {/* Customer Name */}
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={entry.customer}
                          onChange={(e) => handleCellChange(idx, 'customer', e.target.value)}
                          className="w-full font-medium text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-orange-500 focus:bg-white px-1 py-0.5 rounded outline-hidden"
                        />
                      </td>

                      {/* Amount */}
                      <td className="py-2 px-3">
                        <div className="relative flex items-center">
                          <span className="text-slate-400 mr-1">₹</span>
                          <input
                            type="number"
                            value={entry.amount}
                            onChange={(e) => handleCellChange(idx, 'amount', e.target.value)}
                            className="w-20 font-bold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-orange-500 focus:bg-white px-1 py-0.5 rounded outline-hidden"
                          />
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-2 px-3">
                        <input
                          type="date"
                          value={entry.date}
                          onChange={(e) => handleCellChange(idx, 'date', e.target.value)}
                          className="text-slate-700 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-orange-500 focus:bg-white px-1 py-0.5 rounded outline-hidden"
                        />
                      </td>

                      {/* Notes */}
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={entry.source_note || ''}
                          onChange={(e) => handleCellChange(idx, 'source_note', e.target.value)}
                          placeholder="Item note..."
                          className="w-full text-slate-600 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-orange-500 focus:bg-white px-1 py-0.5 rounded outline-hidden text-[11px]"
                        />
                      </td>

                      {/* Confidence Score */}
                      <td className="py-2 px-3 text-center">
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            isLowConf
                              ? 'bg-amber-200 text-amber-900 border border-amber-300 animate-pulse'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {Math.round(entry.confidence * 100)}%
                        </span>
                      </td>

                      {/* Delete Action */}
                      <td className="py-2 px-2 text-center">
                        <button
                          onClick={() => handleDeleteRow(idx)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-slate-100"
                          title="Delete entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Running Totals Bar */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center space-x-4">
              <div>
                <span className="text-slate-500">New Udhaar (Credit): </span>
                <span className="font-bold text-rose-600">₹{totalCredit.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-slate-500">Jama (Payments): </span>
                <span className="font-bold text-emerald-600">₹{totalPayment.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="text-slate-700 font-medium">
              Net Impact: <strong className="text-slate-900">₹{(totalCredit - totalPayment).toLocaleString('en-IN')}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
