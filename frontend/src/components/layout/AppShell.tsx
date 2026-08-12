import type { ReactNode } from 'react';
import { Atmosphere, type AtmosphereVerdict } from './Atmosphere';

interface AppShellProps {
  children: ReactNode;
  verdict?: AtmosphereVerdict;
}

export function AppShell({ children, verdict = 'idle' }: AppShellProps) {
  return (
    <div className="relative min-h-dvh bg-void text-ink">
      <a
        href="#workspace"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-slate-900 focus:px-3 focus:py-2 focus:font-mono focus:text-xs focus:text-emerald-300"
      >
        Skip to workspace
      </a>
      <Atmosphere verdict={verdict} />
      <div className="relative z-10 flex min-h-dvh flex-col lg:h-dvh lg:overflow-hidden">{children}</div>
    </div>
  );
}
