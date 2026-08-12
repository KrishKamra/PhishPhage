import { useState, type ReactNode } from 'react';
import { AlertTriangle, Check, Copy, Flame, HelpCircle, Link2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import type { ForensicAnalysis } from '../../types';
import { Badge } from '../ui/Badge';
import { Surface } from '../ui/Surface';
import { cn } from '../../lib/cn';

interface ForensicBreakdownProps {
  analysis: ForensicAnalysis;
  explanation: string;
  isPhishing: boolean;
  onFocusTrigger?: (word: string) => void;
}

type Tab = 'urgency' | 'links' | 'explanation';

export function ForensicBreakdown({
  analysis,
  explanation,
  isPhishing,
  onFocusTrigger,
}: ForensicBreakdownProps) {
  const [activeTab, setActiveTab] = useState<Tab>('urgency');
  const { urgency_level, trigger_words_found, link_details } = analysis;
  const suspiciousLinksCount = link_details.filter((link) => link.is_suspicious).length;

  const urgencyTone =
    urgency_level === 'High' ? 'threat' : urgency_level === 'Medium' ? 'warn' : 'safe';

  return (
    <Surface padding="sm" className="space-y-4">
      <div className="flex gap-1 border-b border-slate-800 pb-3 lg:hidden">
        <TabButton active={activeTab === 'urgency'} onClick={() => setActiveTab('urgency')}>
          <Flame className="h-3.5 w-3.5 text-amber-400" />
          Urgency ({trigger_words_found.length})
        </TabButton>
        <TabButton active={activeTab === 'links'} onClick={() => setActiveTab('links')}>
          <Link2 className="h-3.5 w-3.5 text-cyan-400" />
          Links ({link_details.length})
          {suspiciousLinksCount > 0 && (
            <span className="rounded-full bg-rose-500/20 px-1.5 text-[10px] text-rose-300">
              {suspiciousLinksCount}
            </span>
          )}
        </TabButton>
        <TabButton active={activeTab === 'explanation'} onClick={() => setActiveTab('explanation')}>
          <HelpCircle className="h-3.5 w-3.5 text-emerald-400" />
          XAI
        </TabButton>
      </div>

      <div className="space-y-4">
        <section className={cn(activeTab !== 'urgency' && 'hidden lg:block')}>
          <SectionHeading
            icon={<Flame className="h-3.5 w-3.5 text-amber-400" />}
            title="Psychological urgency"
            extra={<Badge tone={urgencyTone}>{urgency_level} priority</Badge>}
          />
          {trigger_words_found.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {trigger_words_found.map((word, idx) => (
                <button
                  key={`${word}-${idx}`}
                  type="button"
                  onClick={() => onFocusTrigger?.(word)}
                  className="rounded border border-amber-500/30 bg-amber-500/10 px-2 py-1 font-mono text-[11px] text-amber-300 transition-colors hover:bg-amber-500/20"
                >
                  {word}
                </button>
              ))}
            </div>
          ) : (
            <p className="mt-2 font-mono text-[11px] italic text-slate-500">
              No psychological manipulation keywords found.
            </p>
          )}
        </section>

        <section className={cn(activeTab !== 'links' && 'hidden lg:block')}>
          <SectionHeading
            icon={<Link2 className="h-3.5 w-3.5 text-cyan-400" />}
            title="Embedded links"
            extra={
              suspiciousLinksCount > 0 ? (
                <Badge tone="threat">{suspiciousLinksCount} suspicious</Badge>
              ) : (
                <Badge tone="safe">Clean</Badge>
              )
            }
          />
          {link_details.length > 0 ? (
            <div className="mt-2 max-h-40 space-y-2 overflow-y-auto pr-1">
              {link_details.map((link, idx) => (
                <LinkRow
                  key={`${link.url}-${idx}`}
                  url={link.url}
                  suspicious={link.is_suspicious}
                  reason={link.reason}
                />
              ))}
            </div>
          ) : (
            <p className="mt-2 font-mono text-[11px] italic text-slate-500">
              No embedded hyperlinks detected in raw text.
            </p>
          )}
        </section>

        <section className={cn(activeTab !== 'explanation' && 'hidden lg:block')}>
          <div className="rounded-xl border border-slate-800/80 bg-slate-950/80 p-3.5">
            <div className="mb-2 flex items-center justify-between border-b border-slate-800/60 pb-1.5">
              <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-emerald-400">
                <HelpCircle className="h-4 w-4" />
                AI decision rationale
              </div>
              <Badge tone={isPhishing ? 'threat' : 'safe'}>
                {isPhishing ? 'Threat mode' : 'Safe mode'}
              </Badge>
            </div>
            <p className="font-mono text-xs leading-relaxed text-slate-300">{explanation}</p>
            <p className="mt-2 border-t border-slate-800 pt-2 font-mono text-[10px] text-slate-500">
              Evaluated with Random Forest and TF-IDF n-gram vectorization.
            </p>
          </div>
        </section>
      </div>
    </Surface>
  );
}

function SectionHeading({
  icon,
  title,
  extra,
}: {
  icon: ReactNode;
  title: string;
  extra?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <h3 className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-wide text-slate-300">
        {icon}
        {title}
      </h3>
      {extra}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-mono text-[11px] font-semibold transition-all',
        active
          ? 'border border-slate-700 bg-slate-800 text-slate-100'
          : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
      )}
    >
      {children}
    </button>
  );
}

function LinkRow({ url, suspicious, reason }: { url: string; suspicious: boolean; reason: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('URL copied');
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      toast.error('Could not copy URL');
    }
  };

  return (
    <div
      className={cn(
        'flex flex-col gap-1 rounded-lg border p-2.5',
        suspicious
          ? 'border-rose-500/30 bg-rose-500/10 text-rose-200'
          : 'border-slate-800 bg-slate-950/60 text-slate-300'
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="truncate font-mono text-[11px] font-semibold" title={url}>
          {url}
        </span>
        <button
          type="button"
          onClick={() => void copy()}
          className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
          title="Copy URL"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>
      <div className="flex items-center gap-1 font-mono text-[10px]">
        {suspicious ? (
          <>
            <AlertTriangle className="h-3 w-3 text-rose-400" />
            <span className="text-rose-300">{reason}</span>
          </>
        ) : (
          <>
            <ShieldCheck className="h-3 w-3 text-emerald-400" />
            <span className="text-emerald-300">{reason}</span>
          </>
        )}
      </div>
    </div>
  );
}
