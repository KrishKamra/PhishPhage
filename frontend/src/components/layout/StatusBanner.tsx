import { AlertTriangle } from 'lucide-react';
import type { ReactNode } from 'react';

interface StatusBannerProps {
  children: ReactNode;
}

export function StatusBanner({ children }: StatusBannerProps) {
  return (
    <div
      role="status"
      className="shrink-0 border-b border-rose-500/20 bg-rose-500/[0.08] px-4 py-2"
    >
      <p className="mx-auto flex max-w-[1440px] items-center justify-center gap-2 font-mono text-[11px] text-rose-200 lg:px-4">
        <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        {children}
      </p>
    </div>
  );
}
