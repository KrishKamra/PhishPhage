import { lazy, Suspense, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck } from 'lucide-react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { hasWebGL } from '../../lib/webgl';
import { Badge } from '../ui/Badge';
import { Surface } from '../ui/Surface';
import { cn } from '../../lib/cn';

const ThreatOrb = lazy(() => import('./ThreatOrb'));

interface ThreatGaugeProps {
  confidence: string;
  isPhishing: boolean;
}

const TICKS = [0, 50, 75, 90, 100];

export function ThreatGauge({ confidence, isPhishing }: ThreatGaugeProps) {
  const reducedMotion = usePrefersReducedMotion();
  const numericValue = Math.min(100, Math.max(0, parseFloat(confidence.replace('%', '')) || 0));
  const radius = 80;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (numericValue / 100) * circumference;
  const gaugeColor = isPhishing ? '#F43F5E' : '#10B981';
  const showOrb = useMemo(() => !reducedMotion && hasWebGL(), [reducedMotion]);

  return (
    <Surface glow={isPhishing ? 'threat' : 'safe'} className="relative overflow-hidden">
      {showOrb && (
        <div className="pointer-events-none absolute -right-6 -top-8 h-36 w-36 opacity-70">
          <Suspense fallback={null}>
            <ThreatOrb isPhishing={isPhishing} />
          </Suspense>
        </div>
      )}

      <div className="relative flex items-center justify-between border-b border-slate-800/60 pb-3">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Phishing probability
        </span>
        <Badge tone={isPhishing ? 'threat' : 'safe'}>
          {isPhishing ? 'High threat' : 'Safe verdict'}
        </Badge>
      </div>

      <div className="relative flex items-center justify-center pt-3">
        <svg className="h-32 w-56 overflow-visible" viewBox="0 0 200 118" aria-hidden="true">
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#1E293B"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <motion.path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={gaugeColor}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: reducedMotion ? strokeDashoffset : circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: reducedMotion ? 0 : 1.15, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 10px ${gaugeColor}80)` }}
          />
          {TICKS.map((tick) => {
            const angle = Math.PI * (1 - tick / 100);
            const inner = 88;
            const outer = 96;
            const cx = 100;
            const cy = 100;
            return (
              <line
                key={tick}
                x1={cx + Math.cos(angle) * inner}
                y1={cy - Math.sin(angle) * inner}
                x2={cx + Math.cos(angle) * outer}
                y2={cy - Math.sin(angle) * outer}
                stroke="#475569"
                strokeWidth="1.5"
              />
            );
          })}
        </svg>

        <div className="absolute top-10 flex flex-col items-center text-center">
          {isPhishing ? (
            <ShieldAlert className="mb-1 h-5 w-5 text-rose-400" />
          ) : (
            <ShieldCheck className="mb-1 h-5 w-5 text-emerald-400" />
          )}
          <span className="font-mono text-3xl font-bold tracking-tight text-slate-100">
            {numericValue.toFixed(1)}%
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
            phishing
          </span>
        </div>
      </div>

      <div className="mt-1 flex justify-between px-4 font-mono text-[10px] text-slate-600">
        <span>0</span>
        <span>50</span>
        <span>75</span>
        <span>100</span>
      </div>

      <div
        className={cn(
          'mt-3 w-full rounded-xl border px-4 py-2 text-center font-mono text-xs font-semibold',
          isPhishing
            ? 'border-rose-500/20 bg-rose-500/10 text-rose-200'
            : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200'
        )}
        role="status"
        aria-live="polite"
      >
        {isPhishing
          ? `Phishing attack detected, ${numericValue.toFixed(1)} percent`
          : `Communications audited safe, ${numericValue.toFixed(1)} percent`}
      </div>
    </Surface>
  );
}
