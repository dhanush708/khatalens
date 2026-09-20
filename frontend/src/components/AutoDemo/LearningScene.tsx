import React from 'react';
import { Lightbulb, Wrench, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';

export const LearningScene: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Execution, Learning & Engineering Growth</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Three Concrete Engineering Lessons Learned
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl mx-auto">
          Real challenges encountered and architectural solutions implemented during the hackathon
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        {/* Lesson 1 */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-3">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 leading-snug">
              1. Converse Tool Schemas vs Freeform Text
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Standard Bedrock text prompts often returned conversational chatter (<code className="text-[11px] bg-slate-100 px-1 py-0.5 rounded">Here is your data: ...</code>).
              Switching to the <strong>Converse API tool use</strong> pattern guaranteed 100% structured JSON that seamlessly feeds our Pydantic validation pipeline.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-[11px] font-semibold text-emerald-600">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            <span>Eliminated JSON parsing errors</span>
          </div>
        </div>

        {/* Lesson 2 */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
              <Wrench className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 leading-snug">
              2. S3 Presigned Uploads & Browser Downscaling
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Streaming 5–8MB phone camera photos through API Gateway caused memory spikes and mobile timeouts.
              Downscaling images client-side via HTML5 Canvas and streaming directly to S3 cut Lambda execution time by over <strong>75%</strong>.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-[11px] font-semibold text-emerald-600">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            <span>Sub-second upload latency</span>
          </div>
        </div>

        {/* Lesson 3 */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 leading-snug">
              3. FIFO Aging & Strikethrough Semantics
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Indian merchants cross out paid credit with a single horizontal strike.
              Training our prompt to classify strikethroughs as settlements and applying rigorous <strong>FIFO debt aging</strong>
              matches real-world grassroots bookkeeping.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-[11px] font-semibold text-emerald-600">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            <span>Accurate aging risk buckets</span>
          </div>
        </div>
      </div>
    </div>
  );
};
