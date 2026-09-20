import React from 'react';

interface CursorOverlayProps {
  x: number; // 0 to 100 percentage
  y: number; // 0 to 100 percentage
  isClicking: boolean;
  label?: string;
  visible: boolean;
}

export const CursorOverlay: React.FC<CursorOverlayProps> = ({
  x,
  y,
  isClicking,
  label,
  visible
}) => {
  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed z-50 transition-all duration-700 ease-out"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-2px, -2px)'
      }}
    >
      {/* Click ripple animation */}
      {isClicking && (
        <span className="absolute -left-4 -top-4 w-12 h-12 rounded-full bg-orange-500/40 animate-ping" />
      )}

      {/* Realistic Mouse Pointer SVG */}
      <svg
        className={`w-6 h-6 drop-shadow-md transition-transform duration-150 ${
          isClicking ? 'scale-90 rotate-[-4deg]' : 'scale-100'
        }`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.45 0 .67-.54.35-.85L6.35 2.85a.5.5 0 0 0-.85.36z"
          fill="#0f172a"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>

      {/* Action Tooltip badge */}
      {label && (
        <div className="absolute left-6 top-2 bg-slate-900/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-lg border border-slate-700 whitespace-nowrap animate-in fade-in zoom-in duration-200">
          {label}
        </div>
      )}
    </div>
  );
};
