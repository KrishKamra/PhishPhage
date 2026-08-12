import type { ReactNode } from 'react';

interface WorkspaceProps {
  inspector: ReactNode;
  rail: ReactNode;
}

export function Workspace({ inspector, rail }: WorkspaceProps) {
  return (
    <div
      id="workspace"
      className="mx-auto grid w-full max-w-[1440px] flex-1 grid-cols-1 gap-4 px-4 py-4 sm:px-6 min-h-0 lg:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)] lg:gap-5 lg:px-8 lg:py-4"
    >
      <section className="min-h-0 min-w-0 lg:h-full" aria-label="Email payload inspector">
        {inspector}
      </section>
      <aside className="min-h-0 min-w-0 lg:h-full lg:overflow-hidden" aria-label="Forensic verdict">
        {rail}
      </aside>
    </div>
  );
}
