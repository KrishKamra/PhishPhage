import { Github, Scale, Shield } from 'lucide-react';
import { SITE } from '../../lib/site';
import { API_BASE_URL } from '../../lib/api';
import { TextLink } from '../ui/TextLink';

const nav = [
  { href: SITE.docs, label: 'Docs' },
  { href: `${API_BASE_URL}/docs`, label: 'API' },
  { href: SITE.licenseUrl, label: 'License' },
  { href: SITE.security, label: 'Security' },
] as const;

export function Footer() {
  return (
    <footer className="shrink-0 border-t border-slate-800/80 bg-void/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-4 py-3 sm:px-6 lg:h-[3.25rem] lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:px-8 lg:py-0">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-emerald-500/25 bg-emerald-500/10 text-emerald-400">
            <Shield className="h-3 w-3" aria-hidden="true" />
          </span>
          <p className="truncate font-mono text-[11px] text-slate-500">
            <span className="font-semibold tracking-tight text-slate-300">
              {SITE.name.toUpperCase()}
            </span>
            <span className="mx-2 text-slate-700" aria-hidden="true">
              ·
            </span>
            <span>
              v{SITE.version} {SITE.edition}
            </span>
            <span className="mx-2 text-slate-700" aria-hidden="true">
              ·
            </span>
            <span>
              © {SITE.year}{' '}
              <TextLink href={SITE.authorUrl} external className="text-slate-400 hover:text-emerald-300">
                {SITE.author}
              </TextLink>
            </span>
          </p>
        </div>

        <nav aria-label="Project" className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px]">
          {nav.map((item) => (
            <TextLink key={item.href} href={item.href} external>
              {item.label}
            </TextLink>
          ))}
        </nav>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href={SITE.repo}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${SITE.repoLabel} on GitHub`}
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-800 bg-slate-950/70 px-2 py-1 font-mono text-[11px] text-slate-300 transition-colors hover:border-slate-600 hover:bg-slate-900 hover:text-white"
          >
            <Github className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">{SITE.repoLabel}</span>
            <span className="sm:hidden">GitHub</span>
          </a>
          <span className="inline-flex items-center gap-1 rounded-md border border-slate-800/80 px-1.5 py-1 font-mono text-[10px] uppercase tracking-wide text-slate-500">
            <Scale className="h-3 w-3" aria-hidden="true" />
            {SITE.license}
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-wide text-slate-600 xl:inline">
            On-prem · no telemetry
          </span>
        </div>
      </div>
    </footer>
  );
}
