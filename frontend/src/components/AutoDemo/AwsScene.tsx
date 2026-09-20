import React from 'react';
import { Cloud, FileCode, Terminal, ExternalLink, ShieldCheck } from 'lucide-react';
import { AWS_MODE } from '../../config';

const REAL_SAM_RESOURCES = [
  { name: 'KhataLensHttpApi', type: 'AWS::Serverless::HttpApi', desc: 'Low-latency CORS-enabled HTTP routing' },
  { name: 'KhataLensTable', type: 'AWS::DynamoDB::Table', desc: 'Single-table (PK: SHOP#id, SK: ENTRY#id / CUSTOMER#name)' },
  { name: 'UploadBucket', type: 'AWS::S3::Bucket', desc: 'Private bucket with SSE-S3 encryption & 30-day lifecycle' },
  { name: 'FrontendBucket', type: 'AWS::S3::Bucket', desc: 'S3 static website hosting for compiled React SPA' },
  { name: 'CloudFrontDistribution', type: 'AWS::CloudFront::Distribution', desc: 'Global edge delivery with Origin Access Control (OAC)' },
  { name: 'UploadUrlFunction', type: 'AWS::Serverless::Function', desc: 'backend/src/handlers/upload.py (S3 presigned PUT)' },
  { name: 'ExtractLedgerFunction', type: 'AWS::Serverless::Function', desc: 'backend/src/handlers/extract.py (Bedrock Converse Vision)' },
  { name: 'SaveEntriesFunction', type: 'AWS::Serverless::Function', desc: 'backend/src/handlers/entries.py (DynamoDB BatchWrite)' },
  { name: 'DashboardFunction', type: 'AWS::Serverless::Function', desc: 'backend/src/handlers/dashboard.py (FIFO aging engine)' },
  { name: 'ReminderFunction', type: 'AWS::Serverless::Function', desc: 'backend/src/handlers/reminder_handler.py (Bedrock EN/HI/TA)' }
];

export const AwsScene: React.FC = () => {
  if (AWS_MODE === 'deployed') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center animate-in fade-in duration-300">
        <div className="p-8 bg-amber-500/10 border-2 border-amber-500 rounded-2xl max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-amber-500 text-white flex items-center justify-center mx-auto mb-4 animate-bounce">
            <ExternalLink className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-amber-900 tracking-tight">
            SWITCH TO AWS CONSOLE SCREEN RECORDING
          </h2>
          <p className="text-sm text-amber-800 mt-2">
            [20-Second On-Screen Cue for Live Video Recording]
          </p>
          <div className="mt-4 p-3 bg-white rounded-xl border border-amber-300 font-mono text-xs text-slate-700">
            Show CloudFormation Stack • CloudWatch Logs • DynamoDB Table • S3 Uploads
          </div>
        </div>
      </div>
    );
  }

  // Real Local Open-Source Mode
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 animate-in fade-in zoom-in-95 duration-300">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-semibold mb-2">
          <Cloud className="w-3.5 h-3.5 text-orange-600" />
          <span>AWS Serverless Application Model (SAM) Infrastructure</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Truthful Infrastructure as Code (template.yaml)
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto mt-1">
          Defined declaratively in <code className="bg-slate-100 px-1.5 py-0.5 rounded text-orange-700 font-mono">template.yaml</code>,
          tested locally with SAM tooling, and ready for instant deployment to AWS.
        </p>
      </div>

      {/* Honest Mode Banner */}
      <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl mb-6 flex items-start space-x-3 text-xs text-blue-900">
        <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <strong>Honesty Disclosure:</strong> In this environment, KhataLens runs using the local Python serverless runner
          with bundled synthetic datasets. The complete stack below is fully codified in <span className="font-mono">template.yaml</span> with
          least-privilege IAM policies, ready to deploy via <code className="bg-blue-100 px-1 rounded font-mono">sam deploy</code>.
        </div>
      </div>

      {/* Grid of Real Resources from template.yaml */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {REAL_SAM_RESOURCES.map((res, idx) => (
          <div
            key={idx}
            className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs flex items-start space-x-3"
          >
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
              <FileCode className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-slate-900 truncate">{res.name}</h4>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                  {res.type.replace('AWS::', '').replace('Serverless::', '')}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 truncate">{res.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Deployment CLI Command Preview */}
      <div className="p-4 bg-slate-950 text-slate-200 rounded-xl font-mono text-xs shadow-md border border-slate-800">
        <div className="flex items-center space-x-2 text-slate-400 mb-2 border-b border-slate-800 pb-2">
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[11px] font-sans font-semibold">Reproducible Cloud Deployment Command</span>
        </div>
        <div className="text-emerald-400">
          $ sam build && sam deploy --guided --stack-name khatalens-prod
        </div>
        <div className="text-slate-400 text-[11px] mt-1">
          # Deploys API Gateway HTTP API, 5 Python 3.12 Lambdas, DynamoDB Single Table, and S3/CloudFront CDN
        </div>
      </div>
    </div>
  );
};
