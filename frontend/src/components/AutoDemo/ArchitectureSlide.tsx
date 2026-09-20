import React from 'react';
import {
  Smartphone,
  Cloud,
  Layers,
  Cpu,
  BrainCircuit,
  Database,
  ShieldCheck,
  CheckCircle2,
  Lock
} from 'lucide-react';

export const ArchitectureSlide: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold mb-2">
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          <span>System Architecture & Cloud Topology</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Serverless Pipeline & AI Guardrails
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl mx-auto">
          High-throughput, zero-idle-cost architecture with schema validation and human-in-the-loop verification
        </p>
      </div>

      {/* Visual Pipeline Flow */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative mb-8">
        {/* Step 1: Client */}
        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs text-center flex flex-col items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-2">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-slate-900">1. Mobile Client</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">React + Vite + Tailwind</p>
            <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
              Canvas Downscaling
            </span>
          </div>
        </div>

        {/* Step 2: Edge & API Gateway */}
        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs text-center flex flex-col items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-2">
            <Cloud className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-slate-900">2. Edge & API</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">CloudFront + API GW</p>
            <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-50 text-purple-700">
              Presigned Ingestion
            </span>
          </div>
        </div>

        {/* Step 3: Compute Lambdas */}
        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs text-center flex flex-col items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-2">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-slate-900">3. Serverless Compute</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Python 3.12 Lambdas</p>
            <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700">
              AWS SAM Package
            </span>
          </div>
        </div>

        {/* Step 4: Amazon Bedrock */}
        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs text-center flex flex-col items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-slate-900">4. Amazon Bedrock</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Converse API Vision</p>
            <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700">
              Tool Schema Output
            </span>
          </div>
        </div>

        {/* Step 5: DynamoDB */}
        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs text-center flex flex-col items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-slate-900">5. Amazon DynamoDB</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Single-Table Design</p>
            <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700">
              FIFO Aging Rollup
            </span>
          </div>
        </div>
      </div>

      {/* Security & Validation Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Guardrail 1 */}
        <div className="p-4 rounded-xl bg-slate-900 text-white shadow-md flex items-start space-x-3">
          <Lock className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
          <div>
            <h5 className="font-bold text-xs text-orange-300">Prompt-Injection Defense</h5>
            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
              Ledger handwriting is treated strictly as inert data. The system prompt rejects executing any written instructions found on paper.
            </p>
          </div>
        </div>

        {/* Guardrail 2 */}
        <div className="p-4 rounded-xl bg-slate-900 text-white shadow-md flex items-start space-x-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h5 className="font-bold text-xs text-emerald-300">Pydantic Validation & Retry</h5>
            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
              Converse API tool use enforces strict JSON schema. The backend validates monetary bounds and date formats, retrying on anomalies.
            </p>
          </div>
        </div>

        {/* Guardrail 3 */}
        <div className="p-4 rounded-xl bg-slate-900 text-white shadow-md flex items-start space-x-3">
          <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <h5 className="font-bold text-xs text-blue-300">Human-in-the-Loop Gate</h5>
            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
              Ambiguous rows (&lt;0.85 confidence) are highlighted in amber. Zero records reach DynamoDB without explicit merchant review and approval.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
