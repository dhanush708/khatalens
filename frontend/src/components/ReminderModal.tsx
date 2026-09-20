import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Sparkles, Shield, MessageCircle } from 'lucide-react';
import type { CustomerBalance, ReminderLanguage } from '../types';
import { draftReminder } from '../api';

interface ReminderModalProps {
  customer: CustomerBalance;
  onClose: () => void;
}

export const ReminderModal: React.FC<ReminderModalProps> = ({
  customer,
  onClose
}) => {
  const [language, setLanguage] = useState<ReminderLanguage>('hi');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateMessage = async (lang: ReminderLanguage) => {
    setLoading(true);
    const res = await draftReminder({
      customer: customer.customer,
      amount: customer.net_balance,
      language: lang,
      shop_name: 'Sharma Kirana Store'
    });
    setMessage(res.message);
    setLoading(false);
  };

  useEffect(() => {
    generateMessage(language);
  }, [language, customer]);

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="p-4 bg-orange-50 border-b border-orange-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Draft Polite Payment Reminder</h3>
              <p className="text-[11px] text-slate-500">Culturally respectful message drafted by Amazon Bedrock</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Customer info card */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500">Customer: </span>
              <strong className="text-slate-900">{customer.customer}</strong>
            </div>
            <div>
              <span className="text-slate-500">Pending Dues: </span>
              <strong className="text-rose-600 font-bold">₹{customer.net_balance.toLocaleString('en-IN')}</strong>
            </div>
          </div>

          {/* Language Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Select Message Language:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  language === 'en'
                    ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  language === 'hi'
                    ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                हिन्दी (Hindi)
              </button>
              <button
                type="button"
                onClick={() => setLanguage('ta')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  language === 'ta'
                    ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                தமிழ் (Tamil)
              </button>
            </div>
          </div>

          {/* Message Preview Box */}
          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-600 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Generated Message Text:</span>
              </span>
              {loading && <span className="text-[11px] text-orange-600 animate-pulse">Drafting...</span>}
            </div>
            <textarea
              readOnly
              value={loading ? 'Generating polite multilingual reminder...' : message}
              rows={6}
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden font-sans leading-relaxed resize-none"
            />
          </div>

          {/* Safety Disclaimer */}
          <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start space-x-2 text-[11px] text-amber-800">
            <Shield className="w-3.5 h-3.5 mt-0.5 shrink-0 text-amber-600" />
            <span>
              <strong>Zero Auto-Send Guarantee:</strong> KhataLens never contacts your customers automatically.
              Copy this message and paste it into WhatsApp, SMS, or share directly as you choose.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            Close
          </button>

          <button
            onClick={handleCopy}
            disabled={loading || !message}
            className="inline-flex items-center space-x-2 px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md shadow-orange-600/20 active:scale-98 transition-all disabled:opacity-50"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Message</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
