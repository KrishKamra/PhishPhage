import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message || 'Unknown render error' };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('PhishPhage UI crashed', error, info.componentStack);
  }

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex min-h-screen items-center justify-center bg-void px-6 text-ink">
        <div className="glass-panel max-w-md space-y-3 rounded-2xl p-6">
          <p className="font-mono text-[11px] uppercase tracking-widest text-rose-300">
            Workspace fault
          </p>
          <h1 className="text-lg font-semibold">The console failed to render</h1>
          <p className="font-mono text-xs leading-relaxed text-slate-400">{this.state.message}</p>
          <button
            type="button"
            className="rounded-lg bg-emerald-500 px-3 py-1.5 font-mono text-xs font-semibold text-slate-950"
            onClick={() => window.location.reload()}
          >
            Reload workspace
          </button>
        </div>
      </div>
    );
  }
}
