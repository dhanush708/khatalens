import React from 'react';
import { BookOpen, Camera, CheckSquare, BarChart3, Award, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentTab: 'upload' | 'review' | 'dashboard' | 'accuracy';
  onTabChange: (tab: 'upload' | 'review' | 'dashboard' | 'accuracy') => void;
  demoMode: boolean;
  onToggleDemoMode: () => void;
  hasExtractedEntries: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  demoMode,
  onToggleDemoMode,
  hasExtractedEntries
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onTabChange('upload')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">KhataLens</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-orange-100 text-orange-800 border border-orange-200">
                  खाता लेंस
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">AI Digitization for Indian Shop Ledgers</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex space-x-1 sm:space-x-2">
            <button
              onClick={() => onTabChange('upload')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                currentTab === 'upload'
                  ? 'bg-orange-50 text-orange-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Capture</span>
            </button>

            <button
              onClick={() => onTabChange('review')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors relative ${
                currentTab === 'review'
                  ? 'bg-orange-50 text-orange-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>Review</span>
              {hasExtractedEntries && (
                <span className="w-2 h-2 rounded-full bg-amber-500 absolute top-2 right-2 animate-ping" />
              )}
            </button>

            <button
              onClick={() => onTabChange('dashboard')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                currentTab === 'dashboard'
                  ? 'bg-orange-50 text-orange-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Dues</span>
            </button>

            <button
              onClick={() => onTabChange('accuracy')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                currentTab === 'accuracy'
                  ? 'bg-orange-50 text-orange-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Award className="w-4 h-4" />
              <span className="hidden md:inline">Accuracy</span>
            </button>
          </nav>

          {/* Right actions: Demo mode & AWS badge */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={onToggleDemoMode}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                demoMode
                  ? 'bg-amber-50 border-amber-300 text-amber-800'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-800'
              }`}
              title={demoMode ? "Using bundled synthetic samples" : "Using live Amazon Bedrock"}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{demoMode ? "Demo Mode" : "AWS Live"}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
