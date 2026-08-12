import { useCallback, useRef, useState } from 'react';
import { Header } from './components/Header/Header';
import { EmailInspector, type EmailInspectorHandle } from './components/Inspector/EmailInspector';
import { ResultsRail } from './components/Analytics/ResultsRail';
import { AppShell } from './components/layout/AppShell';
import { Workspace } from './components/layout/Workspace';
import { useAnalyticExport } from './hooks/useAnalyticExport';
import { useApiHealth } from './hooks/useApiHealth';
import { useHotkeys } from './hooks/useHotkeys';
import { usePhishAnalysis } from './hooks/usePhishAnalysis';
import type { AtmosphereVerdict } from './components/layout/Atmosphere';

export function App() {
  const { analyzeEmail, resetAnalysis, isLoading, data } = usePhishAnalysis();
  const { exportToPdf, isExporting } = useAnalyticExport();
  const { apiStatus, isOnline, isPinging } = useApiHealth();
  const inspectorRef = useRef<EmailInspectorHandle>(null);

  const [currentText, setCurrentText] = useState('');
  const [focusedTrigger, setFocusedTrigger] = useState<string | null>(null);

  const handleRunAnalysis = useCallback(
    async (text: string) => {
      setCurrentText(text);
      setFocusedTrigger(null);
      await analyzeEmail(text);
    },
    [analyzeEmail]
  );

  const handleReset = useCallback(() => {
    setCurrentText('');
    setFocusedTrigger(null);
    resetAnalysis();
  }, [resetAnalysis]);

  const handleFocusTrigger = useCallback((word: string) => {
    setFocusedTrigger(word);
    inspectorRef.current?.focusTrigger(word);
  }, []);

  const hotkeyHandler = useCallback(
    (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
        if (!isOnline || isLoading) return;
        event.preventDefault();
        const text = inspectorRef.current?.getText() ?? '';
        void handleRunAnalysis(text);
        return;
      }
      if (event.key === 'Escape') {
        const active = document.activeElement;
        if (active instanceof HTMLElement) active.blur();
      }
    },
    [handleRunAnalysis, isOnline, isLoading]
  );

  useHotkeys(hotkeyHandler);

  const verdict: AtmosphereVerdict = isLoading
    ? 'loading'
    : data
      ? data.is_phishing
        ? 'threat'
        : 'safe'
      : 'idle';

  return (
    <AppShell verdict={verdict}>
      <Header apiStatus={apiStatus} isOnline={isOnline} isPinging={isPinging} />

      {!isOnline && !isPinging && (
        <div className="shrink-0 border-b border-rose-500/20 bg-rose-500/10 px-4 py-2 text-center font-mono text-[11px] text-rose-200">
          Inference engine offline. Analysis is paused until the API reports a loaded model.
        </div>
      )}

      <Workspace
        inspector={
          <EmailInspector
            ref={inspectorRef}
            onAnalyze={handleRunAnalysis}
            onReset={handleReset}
            isLoading={isLoading}
            isApiOnline={isOnline}
            triggerWords={data?.analysis.trigger_words_found}
            focusedTrigger={focusedTrigger}
          />
        }
        rail={
          <ResultsRail
            data={data}
            isLoading={isLoading}
            emailText={currentText}
            onExportPdf={() => exportToPdf(data, currentText)}
            isExportingPdf={isExporting}
            onFocusTrigger={handleFocusTrigger}
          />
        }
      />

      <footer className="mt-auto shrink-0 border-t border-slate-900/80 py-2.5 text-center font-mono text-[11px] text-slate-600">
        PhishPhage v1.1.0 SOC Edition · Krish Kamra
      </footer>
    </AppShell>
  );
}

export default App;
