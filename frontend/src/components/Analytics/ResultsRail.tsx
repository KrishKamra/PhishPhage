import { AnimatePresence, motion } from 'framer-motion';
import { Shield, Sparkles } from 'lucide-react';
import type { PredictResponse } from '../../types';
import { MetricChip } from '../ui/MetricChip';
import { Surface } from '../ui/Surface';
import { ThreatGauge } from './ThreatGauge';
import { ForensicBreakdown } from './ForensicBreakdown';
import { ReportExporter } from '../Reports/ReportExporter';
import { ModelFeedback } from '../feedback/ModelFeedback';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { analyzeModifierLabel } from '../../lib/site';

interface ResultsRailProps {
  data: PredictResponse | null;
  isLoading: boolean;
  emailText: string;
  onExportPdf: () => void;
  isExportingPdf: boolean;
  onFocusTrigger: (word: string) => void;
}

export function ResultsRail({
  data,
  isLoading,
  emailText,
  onExportPdf,
  isExportingPdf,
  onFocusTrigger,
}: ResultsRailProps) {
  const reducedMotion = usePrefersReducedMotion();
  const transition = reducedMotion ? { duration: 0 } : { duration: 0.28, ease: 'easeOut' as const };

  return (
    <div className="flex h-full min-h-[28rem] flex-col lg:min-h-0">
      <AnimatePresence mode="wait">
        {data ? (
          <motion.div
            key="ready"
            initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={transition}
            className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-0.5"
            id="forensic-report-export-target"
          >
            <ThreatGauge confidence={data.confidence} isPhishing={data.is_phishing} />
            <div className="grid grid-cols-3 gap-2">
              <MetricChip
                label="Urgency"
                value={data.analysis.urgency_level}
                tone={
                  data.analysis.urgency_level === 'High'
                    ? 'threat'
                    : data.analysis.urgency_level === 'Medium'
                      ? 'warn'
                      : 'safe'
                }
              />
              <MetricChip
                label="Triggers"
                value={data.analysis.trigger_words_found.length}
                tone={data.analysis.trigger_words_found.length > 0 ? 'warn' : 'neutral'}
              />
              <MetricChip
                label="Links"
                value={`${data.analysis.link_details.filter((l) => l.is_suspicious).length}/${data.analysis.total_links_found}`}
                tone={data.analysis.link_details.some((l) => l.is_suspicious) ? 'threat' : 'info'}
              />
            </div>
            <ForensicBreakdown
              analysis={data.analysis}
              explanation={data.explanation}
              isPhishing={data.is_phishing}
              onFocusTrigger={onFocusTrigger}
            />
            <ReportExporter
              data={data}
              emailText={emailText}
              onExportPdf={onExportPdf}
              isExportingPdf={isExportingPdf}
            />
            <ModelFeedback data={data} emailText={emailText} />
          </motion.div>
        ) : isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition}
          >
            <LoadingState />
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition}
            className="h-full"
          >
            <EmptyState />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EmptyState() {
  return (
    <Surface className="flex h-full min-h-[28rem] flex-col items-center justify-center text-center lg:min-h-0">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
        <Shield className="h-6 w-6" />
      </div>
      <h2 className="text-base font-semibold tracking-tight text-slate-100">Awaiting payload</h2>
      <p className="mt-1 max-w-xs text-sm text-slate-500">
        Verdict, urgency, and XAI stay in this rail so you never scroll to see a HIGH THREAT.
      </p>
      <ol className="mt-6 space-y-2 text-left font-mono text-[11px] text-slate-400">
        <li className="flex gap-2">
          <span className="text-emerald-400">01</span>
          Paste or drop an email payload
        </li>
        <li className="flex gap-2">
          <span className="text-emerald-400">02</span>
          Run forensic AI with {analyzeModifierLabel()} + Enter
        </li>
        <li className="flex gap-2">
          <span className="text-emerald-400">03</span>
          Triage, copy a ticket, export the PDF
        </li>
      </ol>
    </Surface>
  );
}

function LoadingState() {
  return (
    <Surface className="flex h-full min-h-[28rem] flex-col items-center justify-center gap-4 lg:min-h-0">
      <div className="h-28 w-52 animate-pulse rounded-full border border-slate-800 bg-slate-900/80" />
      <div className="flex items-center gap-2 font-mono text-xs text-cyan-300">
        <Sparkles className="h-4 w-4" />
        Vectorizing n-grams…
      </div>
      <div className="h-2 w-40 overflow-hidden rounded-full bg-slate-800">
        <div className="h-full w-1/2 animate-pulse rounded-full bg-cyan-400/70" />
      </div>
    </Surface>
  );
}
