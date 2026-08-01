import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquareWarning, CheckCircle, Shield, Cpu } from 'lucide-react';
import { toast } from 'sonner';

// Custom Hooks
import { usePhishAnalysis } from './hooks/usePhishAnalysis';
import { useLenisScroll } from './hooks/useLenisScroll';
import { useAnalyticExport } from './hooks/useAnalyticExport';

// Modular SOC Components
import { Header } from './components/Header/Header';
import { EmailInspector } from './components/Inspector/EmailInspector';
import { ThreatGauge } from './components/Analytics/ThreatGauge';
import { ForensicBreakdown } from './components/Analytics/ForensicBreakdown';
import { ReportExporter } from './components/Reports/ReportExporter';

export function App() {
  // Initialize Lenis Smooth Inertia Scroll
  useLenisScroll();

  // Custom hook for API interactions & state
  const { analyzeEmail, resetAnalysis, isLoading, data } = usePhishAnalysis();
  const { exportToPdf, isExporting } = useAnalyticExport();

  // Local state
  const [currentText, setCurrentText] = useState<string>('');
  const [isReported, setIsReported] = useState<boolean>(false);

  const handleRunAnalysis = async (text: string) => {
    setCurrentText(text);
    setIsReported(false);
    await analyzeEmail(text);
  };

  const handleReset = () => {
    setCurrentText('');
    setIsReported(false);
    resetAnalysis();
  };

  const handleReportFeedback = () => {
    setIsReported(true);
    toast.success('Feedback Logged', {
      description: 'Sample flagged for active model retraining & human-in-the-loop review.',
    });
    console.log('FEEDBACK LOGGED:', {
      content: currentText,
      original_prediction: data?.prediction,
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* 1. SOC Dashboard Navigation Header */}
      <Header />

      {/* 2. Main Forensic Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Workspace Title */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            <Cpu className="w-3.5 h-3.5" />
            <span>Explainable AI Engine (XAI)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono text-slate-100">
            Threat Intelligence Operations
          </h2>
          <p className="text-slate-400 text-sm">
            Auditing email communications for phishing triggers, social engineering tactics, and malicious hyper-links.
          </p>
        </div>

        {/* 3. Primary Input Inspector */}
        <section className="w-full">
          <EmailInspector
            onAnalyze={handleRunAnalysis}
            onReset={handleReset}
            isLoading={isLoading}
            triggerWords={data?.analysis.trigger_words_found}
          />
        </section>

        {/* 4. Forensic Results Dashboard */}
        <AnimatePresence>
          {data && (
            <motion.div
              id="forensic-report-export-target"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="space-y-6 pt-4"
            >
              
              {/* Analytics Row: Gauge + Detailed Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                
                {/* Column 1: Risk Gauge */}
                <div className="lg:col-span-1 w-full">
                  <ThreatGauge
                    confidence={data.confidence}
                    isPhishing={data.is_phishing}
                  />
                </div>

                {/* Column 2 & 3: Tabbed Forensic Analysis */}
                <div className="lg:col-span-2 w-full">
                  <ForensicBreakdown
                    analysis={data.analysis}
                    explanation={data.explanation}
                    isPhishing={data.is_phishing}
                  />
                </div>

              </div>

              {/* 5. Export Controls (PDF & Markdown Copy) */}
              <ReportExporter
                data={data}
                emailText={currentText}
                onExportPdf={() => exportToPdf(data, currentText)}
                isExportingPdf={isExporting}
              />

              {/* 6. Human-In-The-Loop Active Retraining Feedback */}
              <div className="pt-4 border-t border-slate-800/60 flex flex-col items-center space-y-3">
                <span className="text-xs font-mono text-slate-500">
                  Model Evaluation Feedback Loop
                </span>

                {isReported ? (
                  <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
                    <CheckCircle className="w-4 h-4" />
                    <span>Feedback queued for next active learning pipeline run</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleReportFeedback}
                    className="flex items-center space-x-2 text-xs font-mono text-slate-400 hover:text-slate-200 bg-slate-900/80 border border-slate-800 hover:bg-slate-800 px-4 py-2 rounded-full transition-all"
                  >
                    <MessageSquareWarning className="w-4 h-4 text-amber-400" />
                    <span>Report Incorrect Analysis (Flag False Positive)</span>
                  </button>
                )}
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center font-mono text-xs text-slate-600">
        <div className="flex items-center justify-center space-x-2">
          <Shield className="w-3.5 h-3.5 text-slate-500" />
          <span>PhishPhage v1.1.0 SOC Edition • Krish Kamra</span>
        </div>
      </footer>

    </div>
  );
}

export default App;