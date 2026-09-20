import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { UploadScreen } from './components/UploadScreen';
import { ReviewScreen } from './components/ReviewScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { ReminderModal } from './components/ReminderModal';
import { AccuracyPanel } from './components/AccuracyPanel';
import { AutoDemo } from './components/AutoDemo/AutoDemo';
import type { LedgerEntry, ExtractionResponse, CustomerBalance } from './types';

export function App() {
  const initialTab =
    typeof window !== 'undefined' && (window.location.pathname.includes('/auto-demo') || window.location.search.includes('auto-demo'))
      ? 'auto-demo'
      : 'upload';

  const [currentTab, setCurrentTab] = useState<'upload' | 'review' | 'dashboard' | 'accuracy' | 'auto-demo'>(initialTab);
  const [demoMode, setDemoMode] = useState<boolean>(true);
  
  // Extraction state
  const [extractedEntries, setExtractedEntries] = useState<LedgerEntry[]>([]);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');
  const [currentModelId, setCurrentModelId] = useState<string>('anthropic.claude-3-5-sonnet');

  // Reminder modal state
  const [activeCustomerForReminder, setActiveCustomerForReminder] = useState<CustomerBalance | null>(null);

  // Synchronize URL path with tab state for seamless bookmarking/refreshing
  useEffect(() => {
    if (currentTab === 'auto-demo') {
      window.history.replaceState(null, '', '/auto-demo');
    } else {
      window.history.replaceState(null, '', '/');
    }
  }, [currentTab]);

  const handleExtractionComplete = (result: ExtractionResponse, imageUrl: string) => {
    setExtractedEntries(result.entries);
    setCurrentImageUrl(imageUrl);
    setCurrentModelId(result.model_id);
    setCurrentTab('review');
  };

  const handleConfirmSuccess = () => {
    // Clear review entries and transition to dashboard
    setCurrentTab('dashboard');
  };

  // Full-screen Auto-Demo View
  if (currentTab === 'auto-demo') {
    return <AutoDemo onExit={() => setCurrentTab('upload')} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        demoMode={demoMode}
        onToggleDemoMode={() => setDemoMode(!demoMode)}
        hasExtractedEntries={extractedEntries.length > 0}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {currentTab === 'upload' && (
          <UploadScreen
            onExtractionComplete={handleExtractionComplete}
            demoMode={demoMode}
            onLaunchAutoDemo={() => setCurrentTab('auto-demo')}
          />
        )}

        {currentTab === 'review' && (
          <ReviewScreen
            entries={extractedEntries}
            imageUrl={currentImageUrl}
            onConfirmSuccess={handleConfirmSuccess}
            onBackToUpload={() => setCurrentTab('upload')}
            modelId={currentModelId}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardScreen
            onOpenReminderModal={(cust) => setActiveCustomerForReminder(cust)}
            onNavigateToUpload={() => setCurrentTab('upload')}
          />
        )}

        {currentTab === 'accuracy' && (
          <AccuracyPanel />
        )}
      </main>

      {/* Modal for drafting reminder */}
      {activeCustomerForReminder && (
        <ReminderModal
          customer={activeCustomerForReminder}
          onClose={() => setActiveCustomerForReminder(null)}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            <strong>KhataLens</strong> • First Commit | Bharat Builds Tour (WeMakeDevs x AWS Builder Center)
          </p>
          <div className="flex items-center space-x-3 text-[11px] text-slate-400">
            <button
              onClick={() => setCurrentTab('auto-demo')}
              className="text-orange-600 hover:underline font-semibold"
            >
              ▶ Play Auto-Demo
            </button>
            <span>•</span>
            <span>AWS SAM Infrastructure as Code</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
