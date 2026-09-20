import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Volume2,
  Mic,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Copy,
  Check,
  X
} from 'lucide-react';
import { DEMO_SCENES, calculateTotalWordCount } from './script';
import { CursorOverlay } from './CursorOverlay';
import { Captions } from './Captions';
import { ArchitectureSlide } from './ArchitectureSlide';
import { AwsScene } from './AwsScene';
import { LearningScene } from './LearningScene';

interface AutoDemoProps {
  onExit: () => void;
}

export const AutoDemo: React.FC<AutoDemoProps> = ({ onExit }) => {
  // Setup & playback state
  const [stage, setStage] = useState<'setup' | 'countdown' | 'playing' | 'paused' | 'ended'>('setup');
  const [countdown, setCountdown] = useState<number>(3);
  const [mode, setMode] = useState<'voice' | 'teleprompter'>('voice');
  
  // Voice selection
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('');
  const [isTestingVoice, setIsTestingVoice] = useState<boolean>(false);

  // Scene & sentence indices
  const [currentSceneIdx, setCurrentSceneIdx] = useState<number>(0);
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState<number>(0);

  // Time elapsed tracking
  const [timeElapsedSec, setTimeElapsedSec] = useState<number>(0);
  const timerRef = useRef<any>(null);

  // Cursor state
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [isClicking, setIsClicking] = useState<boolean>(false);
  const [cursorLabel, setCursorLabel] = useState<string | undefined>(undefined);

  // Interactive Mock UI States
  const [reviewEditedAmount, setReviewEditedAmount] = useState<number>(400);
  const [reminderLang, setReminderLang] = useState<'en' | 'hi' | 'ta'>('en');
  const [copiedReminder, setCopiedReminder] = useState<boolean>(false);

  // Speech utterance ref to avoid garbage collection bug in Chromium
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load available voices
  useEffect(() => {
    const updateVoices = () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const available = window.speechSynthesis.getVoices();
        setVoices(available);

        // Auto-select best voice if not already chosen
        if (!selectedVoiceName && available.length > 0) {
          const naturalIn = available.find(
            (v) => (v.name.includes('Natural') || v.name.includes('Online')) && v.lang.includes('en-IN')
          );
          const enIn = available.find((v) => v.lang.includes('en-IN'));
          const naturalEn = available.find(
            (v) => (v.name.includes('Natural') || v.name.includes('Online')) && v.lang.startsWith('en')
          );
          const anyEn = available.find((v) => v.lang.startsWith('en'));
          const best = naturalIn || enIn || naturalEn || anyEn || available[0];
          if (best) setSelectedVoiceName(best.name);
        }
      }
    };

    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // Keyboard shortcut: Esc to pause or exit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (stage === 'playing') {
          pauseDemo();
        } else if (stage === 'paused' || stage === 'ended') {
          onExit();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stage]);

  // Timer effect for overall duration
  useEffect(() => {
    if (stage === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeElapsedSec((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [stage]);

  // Handle countdown before starting
  useEffect(() => {
    if (stage === 'countdown') {
      if (countdown > 1) {
        const t = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => {
          setStage('playing');
          playCurrentSentence(0, 0);
        }, 1000);
        return () => clearTimeout(t);
      }
    }
  }, [stage, countdown]);

  const testVoice = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setIsTestingVoice(true);
    const u = new SpeechSynthesisUtterance('Hello, this is the narration voice for KhataLens.');
    const v = voices.find((vox) => vox.name === selectedVoiceName);
    if (v) u.voice = v;
    u.rate = 0.95;
    u.onend = () => setIsTestingVoice(false);
    u.onerror = () => setIsTestingVoice(false);
    window.speechSynthesis.speak(u);
  };

  const startDemo = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setCountdown(3);
    setStage('countdown');
    setCurrentSceneIdx(0);
    setCurrentSentenceIdx(0);
    setTimeElapsedSec(0);
    setReviewEditedAmount(400);
    setReminderLang('en');
    setCopiedReminder(false);
  };

  const pauseDemo = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setStage('paused');
  };

  const resumeDemo = () => {
    setStage('playing');
    playCurrentSentence(currentSceneIdx, currentSentenceIdx);
  };

  // Play single sentence and trigger associated visual actions
  const playCurrentSentence = (sceneIdx: number, sentenceIdx: number) => {
    const scene = DEMO_SCENES[sceneIdx];
    if (!scene) {
      setStage('ended');
      return;
    }

    const sentenceObj = scene.sentences[sentenceIdx];
    if (!sentenceObj) {
      // Scene finished, advance to next scene
      if (sceneIdx + 1 < DEMO_SCENES.length) {
        setTimeout(() => {
          setCurrentSceneIdx(sceneIdx + 1);
          setCurrentSentenceIdx(0);
          playCurrentSentence(sceneIdx + 1, 0);
        }, 400);
      } else {
        setStage('ended');
      }
      return;
    }

    // 1. Move animated cursor if target specified
    if (sentenceObj.cursorTarget) {
      setCursorPos({ x: sentenceObj.cursorTarget.x, y: sentenceObj.cursorTarget.y });
      if (sentenceObj.cursorTarget.click) {
        setTimeout(() => {
          setIsClicking(true);
          setTimeout(() => setIsClicking(false), 300);
        }, 400);
      }
    }

    // 2. Perform simulated UI actions
    if (sentenceObj.action === 'edit_cell') {
      setTimeout(() => {
        setCursorLabel('Editing ambiguous amount: ₹450');
        // Typewriter edit animation
        setReviewEditedAmount(450);
        setTimeout(() => setCursorLabel(undefined), 1800);
      }, 600);
    } else if (sentenceObj.action === 'confirm_save') {
      setTimeout(() => {
        setCursorLabel('Confirmed! Saving to DynamoDB');
        setTimeout(() => setCursorLabel(undefined), 1500);
      }, 500);
    } else if (sentenceObj.action === 'switch_language') {
      setTimeout(() => {
        setReminderLang('hi');
        setTimeout(() => setReminderLang('ta'), 1400);
      }, 600);
    } else if (sentenceObj.action === 'copy_reminder') {
      setTimeout(() => {
        setCopiedReminder(true);
        setTimeout(() => setCopiedReminder(false), 2000);
      }, 700);
    }

    // 3. Drive audio / timers
    if (mode === 'voice' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(sentenceObj.text);
      const v = voices.find((vox) => vox.name === selectedVoiceName);
      if (v) u.voice = v;
      u.rate = 0.95;
      u.pitch = 1.0;

      u.onend = () => {
        // Pause 350ms between sentences for natural breathing rhythm
        setTimeout(() => {
          advanceToNextSentence(sceneIdx, sentenceIdx);
        }, 350);
      };

      u.onerror = (err) => {
        console.warn('SpeechSynthesis error:', err);
        // Fallback timer if speech synthesis errors out
        setTimeout(() => advanceToNextSentence(sceneIdx, sentenceIdx), 2500);
      };

      utteranceRef.current = u;
      window.speechSynthesis.speak(u);
    } else {
      // Teleprompter mode timer based on reading speed (~145 WPM)
      const words = sentenceObj.text.split(/\s+/).length;
      const durationMs = Math.max(2200, Math.round((words / 145) * 60 * 1000));
      setTimeout(() => {
        advanceToNextSentence(sceneIdx, sentenceIdx);
      }, durationMs);
    }
  };

  const advanceToNextSentence = (sceneIdx: number, sentenceIdx: number) => {
    const scene = DEMO_SCENES[sceneIdx];
    if (sentenceIdx + 1 < scene.sentences.length) {
      setCurrentSentenceIdx(sentenceIdx + 1);
      playCurrentSentence(sceneIdx, sentenceIdx + 1);
    } else {
      // Move to next scene
      if (sceneIdx + 1 < DEMO_SCENES.length) {
        setCurrentSceneIdx(sceneIdx + 1);
        setCurrentSentenceIdx(0);
        playCurrentSentence(sceneIdx + 1, 0);
      } else {
        setStage('ended');
      }
    }
  };

  const currentScene = DEMO_SCENES[currentSceneIdx] || DEMO_SCENES[0];
  const currentSentence = currentScene.sentences[currentSentenceIdx]?.text || '';

  // Setup Screen View
  if (stage === 'setup') {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900 text-white flex flex-col items-center justify-center p-4">
        <div className="max-w-xl w-full bg-slate-800 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-700 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-white">KhataLens Auto-Demo</h2>
                <p className="text-xs text-slate-400">Self-Playing Narrated Video Mode (2:45 Target)</p>
              </div>
            </div>
            <button onClick={onExit} className="text-slate-400 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Settings form */}
          <div className="space-y-5">
            {/* Mode selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Narration Mode:</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMode('voice')}
                  className={`p-3 rounded-xl border text-left flex items-center space-x-3 transition-all ${
                    mode === 'voice'
                      ? 'bg-orange-600/20 border-orange-500 text-white'
                      : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:bg-slate-700/30'
                  }`}
                >
                  <Volume2 className="w-5 h-5 text-orange-400" />
                  <div>
                    <span className="block text-xs font-bold text-white">Browser Voice</span>
                    <span className="text-[11px] text-slate-400">Natural TTS speech</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('teleprompter')}
                  className={`p-3 rounded-xl border text-left flex items-center space-x-3 transition-all ${
                    mode === 'teleprompter'
                      ? 'bg-blue-600/20 border-blue-500 text-white'
                      : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:bg-slate-700/30'
                  }`}
                >
                  <Mic className="w-5 h-5 text-blue-400" />
                  <div>
                    <span className="block text-xs font-bold text-white">Teleprompter</span>
                    <span className="text-[11px] text-slate-400">Read in own voice</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Voice selection (for voice mode) */}
            {mode === 'voice' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">Narration Voice:</label>
                  <button
                    type="button"
                    onClick={testVoice}
                    disabled={isTestingVoice}
                    className="text-[11px] text-orange-400 hover:text-orange-300 font-semibold"
                  >
                    {isTestingVoice ? 'Speaking...' : '▶ Test Voice'}
                  </button>
                </div>
                <select
                  value={selectedVoiceName}
                  onChange={(e) => setSelectedVoiceName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-orange-500"
                >
                  {voices.map((v) => (
                    <option key={v.name} value={v.name}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-amber-400/90 mt-1.5">
                  💡 Tip: For the most natural, human-like voice, open this page in <strong>Microsoft Edge</strong>.
                </p>
              </div>
            )}

            {/* Demo Stats */}
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/60 text-xs flex justify-between text-slate-400">
              <span>Target Duration: <strong>2m 45s</strong></span>
              <span>Script Length: <strong>{calculateTotalWordCount()} words</strong></span>
              <span>Total Scenes: <strong>11 scenes</strong></span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex items-center justify-end space-x-3 pt-4 border-t border-slate-700">
            <button
              onClick={onExit}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={startDemo}
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-orange-600/30 hover:brightness-110 active:scale-98 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Auto-Demo</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Countdown Overlay
  if (stage === 'countdown') {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col items-center justify-center">
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-orange-400 font-bold mb-4">
            Recording Begins In
          </p>
          <div className="text-8xl font-black text-white animate-ping">
            {countdown}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-100 flex flex-col overflow-hidden select-none font-sans">
      {/* Top Demo Bar */}
      <div className="h-10 bg-slate-900 text-white px-4 flex items-center justify-between text-xs z-30 shadow-xs">
        <div className="flex items-center space-x-3">
          <span className="font-bold text-orange-400 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>KhataLens Auto-Demo (Recording Mode)</span>
          </span>
          <span className="text-slate-400 hidden sm:inline">|</span>
          <span className="text-slate-300 font-semibold hidden sm:inline">{currentScene.badge}</span>
        </div>

        <div className="flex items-center space-x-3">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Demo Mode: cached sample result
          </span>
          <button
            onClick={stage === 'playing' ? pauseDemo : resumeDemo}
            className="p-1 text-slate-300 hover:text-white"
            title={stage === 'playing' ? 'Pause (Esc)' : 'Resume'}
          >
            {stage === 'playing' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onExit}
            className="text-slate-400 hover:text-white text-[11px] underline"
          >
            Exit Demo
          </button>
        </div>
      </div>

      {/* Realistic Simulated UI Content Area */}
      <div className="flex-1 overflow-auto relative pb-24">
        {/* Scene 1: Intro Title Card */}
        {currentScene.id === 'intro' && (
          <div className="max-w-4xl mx-auto px-4 py-16 text-center animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center shadow-xl shadow-orange-500/20 mb-6">
              <Sparkles className="w-10 h-10" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
              KhataLens <span className="text-orange-600">(खाता लेंस)</span>
            </h1>
            <p className="text-lg text-slate-600 mt-4 max-w-2xl mx-auto">
              Instant AI-Powered Handwritten Credit Ledger Digitization for Bharat's 12M+ Shopkeepers
            </p>
            <div className="mt-8 inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-orange-100 border border-orange-200 text-orange-800 text-xs font-bold shadow-xs">
              <span>First Commit | Bharat Builds Tour (WeMakeDevs x AWS Builder Center)</span>
            </div>
          </div>
        )}

        {/* Scene 2: The Problem (Paper Ledger) */}
        {currentScene.id === 'problem' && (
          <div className="max-w-4xl mx-auto px-4 py-8 animate-in fade-in duration-300">
            <div className="text-center mb-6">
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">The Real Problem</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Trapped in Paper: 30-50% of Retail Credit is Untracked
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="bg-white p-3 rounded-2xl border border-slate-300 shadow-md">
                <img
                  src="/samples/sample1_kirana_hindi_english.png"
                  alt="Paper Ledger Notebook"
                  className="w-full rounded-xl object-contain max-h-[360px]"
                />
                <p className="text-center text-[11px] text-slate-500 mt-2">
                  Sample Kirana Store Handwritten Ledger Page (*Bahi Khata*)
                </p>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                  <h4 className="font-bold text-sm text-slate-900">1. Lost & Forgotten Money</h4>
                  <p className="text-xs text-slate-600 mt-1">₹15,000–₹40,000 in credit is lost or delayed per store annually due to fading ink and torn pages.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                  <h4 className="font-bold text-sm text-slate-900">2. Manual Re-entry Fatigue</h4>
                  <p className="text-xs text-slate-600 mt-1">Merchants cannot type customer phone numbers and item amounts while customers wait in line.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                  <h4 className="font-bold text-sm text-slate-900">3. Awkward Debt Collection</h4>
                  <p className="text-xs text-slate-600 mt-1">Asking neighbors or elders for pending money feels uncomfortable without culturally polite wording.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scene 3: Upload Screen */}
        {currentScene.id === 'upload' && (
          <div className="max-w-4xl mx-auto px-4 py-8 animate-in fade-in duration-300">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Snap Photo or Choose Ledger Page</h2>
              <p className="text-xs text-slate-500 mt-1">Client-side canvas compression • S3 Presigned URL PUT</p>
            </div>
            <div className="border-2 border-dashed border-orange-400 bg-orange-50/50 rounded-2xl p-8 text-center shadow-xs">
              <div className="w-14 h-14 mx-auto rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-3">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Sharma Kirana Store - Udhaar Bahi Selected</h3>
              <p className="text-xs text-slate-500 mt-1">Image compressed to 1400px JPEG • Uploading directly to Amazon S3</p>
              <div className="mt-4 inline-flex items-center space-x-2 text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Presigned PUT URL generated</span>
              </div>
            </div>
          </div>
        )}

        {/* Scene 4: Processing State */}
        {currentScene.id === 'processing' && (
          <div className="max-w-2xl mx-auto px-4 py-20 text-center animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full border-4 border-orange-200 border-t-orange-600 animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900">Reading Handwritten Bilingual Ledger...</h3>
            <p className="text-xs text-slate-500 mt-1">Amazon Bedrock Converse API • Vision Tool-Use Extraction</p>
            <div className="mt-4 max-w-sm mx-auto p-3 bg-white rounded-xl border border-slate-200 shadow-xs text-xs text-slate-600">
              Decoding Hindi & English handwriting • Distinguishing Jama (-) and Baki (+)
            </div>
          </div>
        )}

        {/* Scene 5: Review Screen */}
        {currentScene.id === 'review' && (
          <div className="max-w-6xl mx-auto px-4 py-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                  <span>Review & Verify Ledger</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    Human-in-the-Loop
                  </span>
                </h3>
                <p className="text-xs text-slate-500">Edit any cell before saving. Nothing touches DynamoDB without confirmation.</p>
              </div>
              <button className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-600/20">
                Confirm & Save to Khata
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Image */}
              <div className="lg:col-span-5 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Original Notebook</span>
                <img
                  src="/samples/sample1_kirana_hindi_english.png"
                  alt="Ledger"
                  className="w-full rounded-lg max-h-[380px] object-contain border border-slate-200"
                />
              </div>

              {/* Right Table */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">Customer</th>
                      <th className="py-2.5 px-3">Amount (₹)</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Confidence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-2 px-3 text-rose-600 font-bold">Credit</td>
                      <td className="py-2 px-3 font-semibold">Ramesh Kumar</td>
                      <td className="py-2 px-3 font-bold">₹850</td>
                      <td className="py-2 px-3">2026-09-12</td>
                      <td className="py-2 px-3 text-emerald-600 font-bold">97%</td>
                    </tr>
                    {/* Ambiguous Row highlighted in Amber */}
                    <tr className="bg-amber-50 border-y border-amber-200">
                      <td className="py-2 px-3 text-rose-600 font-bold">Credit</td>
                      <td className="py-2 px-3 font-semibold">Suresh Gupta</td>
                      <td className="py-2 px-3">
                        <span className="font-black text-slate-900 bg-white px-2 py-0.5 rounded border border-amber-400">
                          ₹{reviewEditedAmount}
                        </span>
                      </td>
                      <td className="py-2 px-3">2026-09-14</td>
                      <td className="py-2 px-3">
                        <span className="px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 text-[10px] font-bold animate-pulse">
                          78% Low Conf
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-emerald-600 font-bold">Payment</td>
                      <td className="py-2 px-3 font-semibold">Amit Verma</td>
                      <td className="py-2 px-3 font-bold">₹500</td>
                      <td className="py-2 px-3">2026-09-15</td>
                      <td className="py-2 px-3 text-emerald-600 font-bold">94%</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-rose-600 font-bold">Credit</td>
                      <td className="py-2 px-3 font-semibold">Pooja Sharma</td>
                      <td className="py-2 px-3 font-bold">₹1,250</td>
                      <td className="py-2 px-3">2026-09-16</td>
                      <td className="py-2 px-3 text-emerald-600 font-bold">96%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Scene 6: Dashboard */}
        {currentScene.id === 'dashboard' && (
          <div className="max-w-6xl mx-auto px-4 py-6 animate-in fade-in duration-300">
            <h2 className="text-2xl font-black text-slate-900 mb-4">Outstanding Udhaar Dashboard</h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Total Outstanding</span>
                <p className="text-2xl font-black text-rose-600 mt-1">₹4,620</p>
                <span className="text-[11px] text-slate-400">5 active customers</span>
              </div>
              <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
                <span className="text-[10px] font-bold text-slate-500 uppercase">0 - 7 Days (Recent)</span>
                <p className="text-2xl font-black text-slate-800 mt-1">₹2,100</p>
                <span className="text-[11px] text-emerald-600 font-medium">Low risk</span>
              </div>
              <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
                <span className="text-[10px] font-bold text-slate-500 uppercase">8 - 30 Days</span>
                <p className="text-2xl font-black text-slate-800 mt-1">₹1,870</p>
                <span className="text-[11px] text-amber-600 font-medium">Follow-up due</span>
              </div>
              <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
                <span className="text-[10px] font-bold text-slate-500 uppercase">30+ Days (Overdue)</span>
                <p className="text-2xl font-black text-red-600 mt-1">₹650</p>
                <span className="text-[11px] text-red-600 font-bold">Urgent collection</span>
              </div>
            </div>

            {/* Customers table preview */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
              <h4 className="font-bold text-xs text-slate-700 mb-3">Debtor Accounts</h4>
              <div className="space-y-2">
                <div className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">Ramesh Kumar</span>
                    <span className="text-slate-500 ml-2">Atta & Dal</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-extrabold text-rose-600">₹850</span>
                    <button className="px-2.5 py-1 rounded bg-orange-100 text-orange-800 font-bold text-[11px]">
                      Draft Reminder
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scene 7: Polite Reminders */}
        {currentScene.id === 'reminders' && (
          <div className="max-w-2xl mx-auto px-4 py-8 animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Draft Courteous Payment Reminder</h3>
                  <p className="text-[11px] text-slate-500">Customer: Ramesh Kumar • Due: ₹850</p>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Zero Auto-Send
                </span>
              </div>

              {/* Language Selector */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <button
                  className={`py-1.5 rounded-lg text-xs font-bold border ${
                    reminderLang === 'en' ? 'bg-orange-600 text-white' : 'bg-slate-50 text-slate-700'
                  }`}
                >
                  English
                </button>
                <button
                  className={`py-1.5 rounded-lg text-xs font-bold border ${
                    reminderLang === 'hi' ? 'bg-orange-600 text-white' : 'bg-slate-50 text-slate-700'
                  }`}
                >
                  हिन्दी (Hindi)
                </button>
                <button
                  className={`py-1.5 rounded-lg text-xs font-bold border ${
                    reminderLang === 'ta' ? 'bg-orange-600 text-white' : 'bg-slate-50 text-slate-700'
                  }`}
                >
                  தமிழ் (Tamil)
                </button>
              </div>

              {/* Message preview */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed text-slate-800 font-sans mb-4 min-h-[90px]">
                {reminderLang === 'en' &&
                  "Hello Ramesh Kumar, warm greetings from Sharma Kirana Store. This is a gentle reminder regarding your pending balance of ₹850. Whenever convenient, kindly settle this via UPI or on your next visit. Thank you!"}
                {reminderLang === 'hi' &&
                  "नमस्ते रमेश जी, शर्मा किराना स्टोर की तरफ से सादर प्रणाम। यह एक विनम्र संदेश है कि आपकी पुरानी बहीखाता बकाया राशि ₹850 है। कृपया अपनी सुविधानुसार भुगतान करने की कृपा करें।"}
                {reminderLang === 'ta' &&
                  "வணக்கம் Ramesh Kumar அவர்களே, Sharma Kirana Store-ன் அன்பான வணக்கங்கள். தங்களுடைய கணக்கு பாக்கி தொகை ₹850 நிலுவையில் உள்ளது. தங்களுக்கு வசதியான நேரத்தில் செலுத்த அன்புடன் கேட்டுக்கொள்கிறோம்."}
              </div>

              <div className="flex justify-end">
                <button className="px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-orange-600/20">
                  {copiedReminder ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedReminder ? 'Copied to Clipboard!' : 'Copy Message'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Scene 8: Architecture */}
        {currentScene.id === 'architecture' && <ArchitectureSlide />}

        {/* Scene 9: AWS Scene (Honest) */}
        {currentScene.id === 'aws' && <AwsScene />}

        {/* Scene 10: Learning Scene */}
        {currentScene.id === 'learning' && <LearningScene />}

        {/* Scene 11: Closing Card */}
        {currentScene.id === 'closing' && (
          <div className="max-w-3xl mx-auto px-4 py-16 text-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 rounded-2xl bg-orange-600 text-white flex items-center justify-center mx-auto mb-4 shadow-lg">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              KhataLens: Digitizing Bharat with AWS
            </h2>
            <p className="text-sm text-slate-600 mt-2 max-w-xl mx-auto">
              Empowering India's 12 million small merchants with instant handwriting digitization,
              strict human-in-the-loop verification, and respectful multilingual debt reminders.
            </p>
            <div className="mt-8 p-4 bg-white border border-slate-200 rounded-2xl inline-block shadow-xs">
              <p className="text-xs font-mono font-bold text-slate-800">
                GitHub: https://github.com/dhanush-anbu/KhataLens
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                WeMakeDevs x AWS Builder Center • First Commit Bharat Builds Tour
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Synchronized Captions & Teleprompter Bar */}
      <Captions
        sentence={currentSentence}
        sceneTitle={currentScene.title}
        sceneIndex={currentSceneIdx}
        totalScenes={DEMO_SCENES.length}
        isTeleprompter={mode === 'teleprompter'}
        timeElapsedSec={timeElapsedSec}
        targetDurationSec={165}
      />

      {/* Realistic Animated Cursor */}
      <CursorOverlay
        x={cursorPos.x}
        y={cursorPos.y}
        isClicking={isClicking}
        label={cursorLabel}
        visible={stage === 'playing'}
      />
    </div>
  );
};
