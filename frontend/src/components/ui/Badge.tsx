import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

type BadgeTone = 'neutral' | 'safe' | 'threat' | 'warn' | 'info';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

const tones: Record<BadgeTone, string> = {
  neutral: 'bg-slate-800/80 text-slate-300 border-slate-700',
  safe: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25',
  threat: 'bg-rose-500/10 text-rose-300 border-rose-500/25',
  warn: 'bg-amber-500/10 text-amber-300 border-amber-500/25',
  info: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/25',
};

export function Badge({ tone = 'neutral', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-wide uppercase',
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
