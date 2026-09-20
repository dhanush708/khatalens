import React, { useState, useRef } from 'react';
import { Camera, Sparkles, Image as ImageIcon, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { extractLedger, getUploadUrl, uploadImageToS3 } from '../api';
import type { ExtractionResponse } from '../types';

interface UploadScreenProps {
  onExtractionComplete: (result: ExtractionResponse, imageUrl: string) => void;
  demoMode: boolean;
}

const SAMPLE_LEDGERS = [
  {
    id: 'sample1',
    title: 'Sharma Kirana Store',
    sub: 'Hindi/English Udhaar Bahi',
    tag: 'Grocery Store',
    img: '/samples/sample1_kirana_hindi_english.png',
    color: 'border-orange-200 bg-orange-50/40 hover:border-orange-400'
  },
  {
    id: 'sample2',
    title: 'Gupta Provision Register',
    sub: 'Daily credit & GPay jama',
    tag: 'Daily Register',
    img: '/samples/sample2_daily_register.png',
    color: 'border-blue-200 bg-blue-50/40 hover:border-blue-400'
  },
  {
    id: 'sample3',
    title: 'New Star Tailors',
    sub: 'Messy handwriting & kurti note',
    tag: 'Low Confidence Test',
    img: '/samples/sample3_tailor_notes.png',
    color: 'border-amber-200 bg-amber-50/40 hover:border-amber-400'
  },
  {
    id: 'sample4',
    title: 'Arogya Medicals',
    sub: 'Clinic tablets & balance notes',
    tag: 'Pharmacy Khata',
    img: '/samples/sample4_medical_store.png',
    color: 'border-emerald-200 bg-emerald-50/40 hover:border-emerald-400'
  },
  {
    id: 'sample5',
    title: 'Dinesh Hardware & Paint',
    sub: 'Strikethrough paid entries',
    tag: 'Strikethrough Test',
    img: '/samples/sample5_complex_strikes.png',
    color: 'border-purple-200 bg-purple-50/40 hover:border-purple-400'
  }
];

export const UploadScreen: React.FC<UploadScreenProps> = ({
  onExtractionComplete,
  demoMode
}) => {
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Client-side image resize helper to keep payloads fast & under Bedrock limits
  const resizeImage = (file: File): Promise<{ base64: string; blob: Blob }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1600;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, w, h);
            canvas.toBlob((blob) => {
              if (blob) {
                const base64 = canvas.toDataURL('image/jpeg', 0.85);
                resolve({ base64, blob });
              } else {
                reject(new Error('Canvas blob generation failed'));
              }
            }, 'image/jpeg', 0.85);
          } else {
            reject(new Error('Canvas context unavailable'));
          }
        };
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const processFile = async (file: File) => {
    try {
      setLoading(true);
      setStatusMsg('Optimizing image in browser...');
      const { base64, blob } = await resizeImage(file);

      // 1. Get S3 presigned URL
      setStatusMsg('Requesting secure S3 presigned URL...');
      const uploadMeta = await getUploadUrl(file.name, 'image/jpeg');

      // 2. Direct S3 upload
      if (uploadMeta.upload_url) {
        setStatusMsg('Streaming image directly to Amazon S3...');
        await uploadImageToS3(uploadMeta.upload_url, blob, 'image/jpeg');
      }

      // 3. Invoke Bedrock extraction
      setStatusMsg('Amazon Bedrock Converse API analyzing handwriting...');
      const result = await extractLedger({
        imageKey: uploadMeta.image_key,
        imageBase64: base64,
        forceDemo: demoMode
      });

      setStatusMsg('Validating structured JSON against Pydantic schema...');
      setTimeout(() => {
        onExtractionComplete(result, base64);
        setLoading(false);
      }, 400);

    } catch (err: any) {
      console.error(err);
      alert('Extraction failed: ' + (err.message || 'Unknown error'));
      setLoading(false);
    }
  };

  const handleSampleClick = async (sample: typeof SAMPLE_LEDGERS[0]) => {
    try {
      setLoading(true);
      setStatusMsg(`Loading ${sample.title}...`);
      
      const imageUrl = sample.img;
      const result = await extractLedger({
        sampleId: sample.id,
        forceDemo: true
      });

      setTimeout(() => {
        onExtractionComplete(result, imageUrl);
        setLoading(false);
      }, 500);

    } catch (err: any) {
      console.error(err);
      alert('Failed loading sample: ' + err.message);
      setLoading(false);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-semibold mb-3">
          <Zap className="w-3.5 h-3.5 text-orange-600" />
          <span>Zero Retyping • Human-in-the-Loop • 100% Serverless AWS</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Turn Your Paper Ledger into a <br className="hidden sm:inline" />
          <span className="text-orange-600">Searchable Dues Dashboard</span>
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
          Take a photo of any handwritten Hindi/English credit notebook (*Bahi Khata*).
          Amazon Bedrock extracts the names, amounts, and dates so you never lose pending revenue.
        </p>
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
          }
        }}
        className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-10 text-center transition-all ${
          dragActive
            ? 'border-orange-500 bg-orange-50'
            : 'border-slate-300 bg-white hover:border-slate-400'
        } shadow-xs`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={onFileInputChange}
          className="hidden"
        />

        {loading ? (
          <div className="py-8 flex flex-col items-center justify-center space-y-4">
            <div className="relative w-16 h-16">
              <div className="w-16 h-16 rounded-full border-4 border-orange-200 border-t-orange-600 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-orange-600 animate-pulse" />
              </div>
            </div>
            <div>
              <p className="text-base font-semibold text-slate-800">{statusMsg}</p>
              <p className="text-xs text-slate-500 mt-1">Amazon Bedrock Converse API • Vision Inference</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shadow-inner">
              <Camera className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-800">
                Snap Photo or Upload Ledger
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Supports camera capture on mobile, JPG, or PNG up to 10MB
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-orange-600 text-white font-semibold text-sm hover:bg-orange-700 shadow-md shadow-orange-600/20 active:scale-98 transition-transform"
              >
                <Camera className="w-4 h-4" />
                <span>Open Camera / Browse</span>
              </button>
            </div>

            <div className="flex items-center justify-center space-x-4 text-xs text-slate-500 pt-3 border-t border-slate-100">
              <span className="flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Encrypted in S3</span>
              </span>
              <span>•</span>
              <span>Client-side Compression</span>
              <span>•</span>
              <span>Prompt Injection Hardened</span>
            </div>
          </div>
        )}
      </div>

      {/* Demo Quick-Pick Samples */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Try Bundled Synthetic Ledgers (Demo Mode)</span>
            </h2>
            <p className="text-xs text-slate-500">Test the extraction engine with 5 real-world handwritten formats</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SAMPLE_LEDGERS.map((sample) => (
            <div
              key={sample.id}
              onClick={() => handleSampleClick(sample)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer shadow-xs hover:shadow-md ${sample.color} group flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/80 text-slate-700 border border-slate-200">
                    {sample.tag}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-800 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 leading-snug">{sample.title}</h3>
                <p className="text-xs text-slate-600 mt-0.5">{sample.sub}</p>
              </div>

              <div className="mt-3 flex items-center space-x-1 text-[11px] font-semibold text-orange-700">
                <ImageIcon className="w-3 h-3" />
                <span>Test Extraction</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
