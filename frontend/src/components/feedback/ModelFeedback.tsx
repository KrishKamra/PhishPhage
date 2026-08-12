import { useState } from 'react';
import { CheckCircle, MessageSquareWarning, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import type { PredictResponse } from '../../types';
import { Button } from '../ui/Button';

type FeedbackKind = 'false_positive' | 'false_negative';

interface ModelFeedbackProps {
  data: PredictResponse | null;
  emailText: string;
}

interface FeedbackRecord {
  kind: FeedbackKind;
  at: string;
  prediction: string | null;
  confidence: string | null;
  sample: string;
}

const STORAGE_KEY = 'phishphage.feedback';

function persistFeedback(record: FeedbackRecord): void {
  try {
    const existing = sessionStorage.getItem(STORAGE_KEY);
    const parsed: FeedbackRecord[] = existing ? (JSON.parse(existing) as FeedbackRecord[]) : [];
    parsed.push(record);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  } catch {
    // Storage can be unavailable in locked-down SOC browsers.
  }
}

export function ModelFeedback({ data, emailText }: ModelFeedbackProps) {
  const [loggedKind, setLoggedKind] = useState<FeedbackKind | null>(null);

  const log = (kind: FeedbackKind) => {
    persistFeedback({
      kind,
      at: new Date().toISOString(),
      prediction: data?.prediction ?? null,
      confidence: data?.confidence ?? null,
      sample: emailText.slice(0, 400),
    });
    setLoggedKind(kind);
    toast.success('Feedback queued', {
      description:
        kind === 'false_positive'
          ? 'Logged as false positive for the next human-in-the-loop review.'
          : 'Logged as a missed threat for the next human-in-the-loop review.',
    });
  };

  return (
    <div className="border-t border-slate-800/70 pt-3">
      <p className="mb-2 text-center font-mono text-[10px] uppercase tracking-wider text-slate-500">
        Model evaluation feedback
      </p>
      {loggedKind ? (
        <div className="flex items-center justify-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 font-mono text-[11px] text-emerald-300">
          <CheckCircle className="h-3.5 w-3.5" />
          {loggedKind === 'false_positive' ? 'False positive queued' : 'Missed threat queued'}
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-2">
          <Button variant="ghost" onClick={() => log('false_positive')}>
            <MessageSquareWarning className="h-3.5 w-3.5 text-amber-400" />
            False positive
          </Button>
          <Button variant="ghost" onClick={() => log('false_negative')}>
            <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
            Missed threat
          </Button>
        </div>
      )}
    </div>
  );
}
