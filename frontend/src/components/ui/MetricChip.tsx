import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface MetricChipProps {
  label: string;
  value: ReactNode;
  tone?: 'neutral' | 'safe' | 'threat' | 'warn' | 'info';
  className?: string;
}

const tones = {
  neutral: 'border-slate-800 bg-slate-950/50 text-slate-300',
  safe: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-200',
  threat: 'border-rose-500/20 bg-rose-500/5 text-rose-200',
  warn: 'border-amber-500/20 bg-amber-500/5 text-amber-200',
  info: 'border-cyan-500/20 bg-cyan-500/5 text-cyan-200',
} as const;

export function MetricChip({ label, value, tone = 'neutral', className }: MetricChipProps) {
  return (
    <div
      className={cn(
        'flex min-w-0 flex-col gap-0.5 rounded-lg border px-2.5 py-2',
        tones[tone],
        className
      )}
    >
      <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">{label}</span>
      <span className="truncate font-mono text-xs font-semibold">{value}</span>
    </div>
  );
}
