import { Activity, Code2, ShieldAlert, Terminal } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Kbd } from '../ui/Kbd';
import { cn } from '../../lib/cn';
import type { ApiStatus } from '../../types';

interface HeaderProps {
  apiStatus: ApiStatus | null;
  isOnline: boolean;
  isPinging: boolean;
}

export function Header({ apiStatus, isOnline, isPinging }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 shrink-0 border-b border-slate-800/70 bg-void/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 text-emerald-400 shadow-[0_0_18px_rgb(16_185_129/0.16)]">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="font-mono text-[15px] font-bold tracking-tight text-slate-100">
                PHISH<span className="text-emerald-400">PHAGE</span>
              </h1>
              <Badge tone="safe">v1.1.0 SOC</Badge>
            </div>
            <p className="hidden truncate text-[11px] text-slate-500 sm:block">
              Forensic phishing detection · threat intelligence
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-1.5 rounded-full border border-slate-800 bg-slate-950/70 px-2.5 py-1 font-mono text-[10px] text-slate-500 lg:flex">
            <span>Analyze</span>
            <Kbd>{typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘' : 'Ctrl'}</Kbd>
            <Kbd>↵</Kbd>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950/80 px-3 py-1.5 font-mono text-[11px]">
            <Activity
              className={cn(
                'h-3.5 w-3.5',
                isPinging ? 'animate-spin text-slate-500' : isOnline ? 'text-emerald-400' : 'text-rose-400'
              )}
            />
            <span className="hidden text-slate-500 md:inline">API</span>
            <span className={cn('flex items-center gap-1.5 font-semibold', isOnline ? 'text-emerald-400' : 'text-rose-400')}>
              <span
                className={cn(
                  'h-1.5 w-1.5 rounded-full',
                  isOnline ? 'bg-emerald-400 shadow-[0_0_8px_#10B981]' : 'bg-rose-400 shadow-[0_0_8px_#F43F5E]'
                )}
              />
              {isOnline ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>

          {apiStatus && (
            <div className="hidden items-center gap-1.5 rounded-md border border-slate-800 bg-slate-950/80 px-2.5 py-1 font-mono text-[11px] text-slate-400 lg:flex">
              <Terminal className="h-3 w-3 text-cyan-400" />
              <span>RF-TFIDF</span>
            </div>
          )}

          <a
            href="https://github.com/KrishKamra/PhishPhage"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 px-2 py-1.5 font-mono text-xs text-slate-400 transition-colors hover:bg-slate-900 hover:text-slate-100"
            title="View source repository"
          >
            <Code2 className="h-4 w-4" />
            <span className="hidden sm:inline">Repo</span>
          </a>
        </div>
      </div>
    </header>
  );
}
