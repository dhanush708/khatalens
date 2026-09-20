import React from 'react';

interface CaptionsProps {
  sentence: string;
  sceneTitle: string;
  sceneIndex: number;
  totalScenes: number;
  isTeleprompter: boolean;
  timeElapsedSec: number;
  targetDurationSec: number;
}

export const Captions: React.FC<CaptionsProps> = ({
  sentence,
  sceneTitle,
  sceneIndex,
  totalScenes,
  isTeleprompter,
  timeElapsedSec,
  targetDurationSec
}) => {
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = Math.min(100, Math.round((timeElapsedSec / targetDurationSec) * 100));

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-md border-t border-slate-800 text-white px-6 py-4 shadow-2xl">
      {/* Top progress line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800">
        <div
          className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Scene Indicator & Time */}
        <div className="flex items-center space-x-3 text-xs text-slate-400 shrink-0">
          <span className="px-2 py-0.5 rounded bg-orange-950/80 border border-orange-700/60 text-orange-400 font-mono font-bold">
            {sceneIndex + 1} / {totalScenes}
          </span>
          <span className="font-semibold text-slate-300 truncate max-w-[200px]">
            {sceneTitle}
          </span>
          <span className="font-mono text-slate-400">
            {formatTime(timeElapsedSec)} / {formatTime(targetDurationSec)}
          </span>
          {isTeleprompter && (
            <span className="px-2 py-0.5 rounded bg-blue-900 text-blue-200 text-[10px] font-bold uppercase tracking-wider">
              Teleprompter
            </span>
          )}
        </div>

        {/* Big Synced Captions Text */}
        <div className="flex-1 text-center md:text-left px-2">
          <p
            className={`text-base sm:text-lg lg:text-xl font-medium leading-snug tracking-normal transition-all duration-200 ${
              isTeleprompter
                ? 'text-amber-300 font-bold drop-shadow-md'
                : 'text-slate-100'
            }`}
          >
            "{sentence}"
          </p>
        </div>
      </div>
    </div>
  );
};
