import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  AlertCircle,
  Eye,
  EyeOff,
  FileText,
  RotateCcw,
  Sparkles,
  Upload,
} from 'lucide-react';
import { renderHighlightedText } from '../../utils/highlightRules';
import { parseEmailHeaders } from '../../lib/parseEmail';
import { FORENSIC_MIN_WORDS } from '../../lib/api';
import { cn } from '../../lib/cn';
import { analyzeShortcutLabel } from '../../lib/site';
import { SAMPLE_PAYLOADS, type SamplePayload } from '../../fixtures/samplePayloads';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { IconButton } from '../ui/IconButton';
import { Kbd } from '../ui/Kbd';
import { Surface } from '../ui/Surface';

export interface EmailInspectorHandle {
  focusTrigger: (word: string) => void;
  getText: () => string;
}

interface EmailInspectorProps {
  onAnalyze: (text: string) => void;
  onReset: () => void;
  isLoading: boolean;
  isApiOnline: boolean;
  triggerWords?: string[];
  focusedTrigger?: string | null;
}

export const EmailInspector = forwardRef<EmailInspectorHandle, EmailInspectorProps>(
  function EmailInspector(
    { onAnalyze, onReset, isLoading, isApiOnline, triggerWords = [], focusedTrigger = null },
    ref
  ) {
    const [text, setText] = useState('');
    const [showHighlight, setShowHighlight] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    const wordCount = useMemo(() => {
      const trimmed = text.trim();
      return trimmed ? trimmed.split(/\s+/).length : 0;
    }, [text]);

    const headers = useMemo(() => parseEmailHeaders(text), [text]);
    const isMinWordCountMet = wordCount >= FORENSIC_MIN_WORDS;
    const canAnalyze = isMinWordCountMet && !isLoading && isApiOnline;

    const syncOverlayScroll = useCallback(() => {
      const area = textareaRef.current;
      const overlay = overlayRef.current;
      if (!area || !overlay) return;
      overlay.scrollTop = area.scrollTop;
      overlay.scrollLeft = area.scrollLeft;
    }, []);

    const handleClear = () => {
      setText('');
      onReset();
      textareaRef.current?.focus();
    };

    const handleSampleLoad = (sample: SamplePayload) => {
      setText(sample.text);
      textareaRef.current?.focus();
    };

    const readDroppedFile = async (file: File) => {
      const allowed = /\.(txt|eml|msg|md)$/i.test(file.name) || file.type.startsWith('text/');
      if (!allowed) return;
      const contents = await file.text();
      setText(contents);
    };

    useImperativeHandle(
      ref,
      () => ({
        focusTrigger: (word: string) => {
          const area = textareaRef.current;
          if (!area || !word) return;
          const idx = text.toLowerCase().indexOf(word.toLowerCase());
          if (idx < 0) return;
          area.focus();
          area.setSelectionRange(idx, idx + word.length);
          const before = text.slice(0, idx);
          const line = before.split('\n').length;
          const lineHeight = 22;
          area.scrollTop = Math.max(0, (line - 3) * lineHeight);
          syncOverlayScroll();
        },
        getText: () => text,
      }),
      [text, syncOverlayScroll]
    );

    return (
      <Surface className="flex h-full min-h-[30rem] flex-col space-y-4 lg:min-h-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-emerald-400" />
            <div>
              <h2 className="font-mono text-xs font-semibold uppercase tracking-wide text-slate-200">
                Email Payload Inspector
              </h2>
              <p className="text-[11px] text-slate-500">Paste headers and body. Highlights stay locked to scroll.</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowHighlight((value) => !value)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-[11px] transition-all',
                showHighlight
                  ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                  : 'border-slate-700 bg-slate-800 text-slate-400'
              )}
              aria-pressed={showHighlight}
            >
              {showHighlight ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
              <span>{showHighlight ? 'Highlight' : 'Plain'}</span>
            </button>
            <IconButton label="Clear payload" onClick={handleClear} disabled={!text}>
              <RotateCcw className="h-3.5 w-3.5" />
            </IconButton>
          </div>
        </div>

        {(headers.from || headers.to || headers.subject) && (
          <dl className="grid gap-2 sm:grid-cols-3">
            {headers.from && (
              <div className="min-w-0 rounded-lg border border-slate-800 bg-slate-950/60 px-2.5 py-1.5">
                <dt className="font-mono text-[10px] uppercase tracking-wider text-slate-500">From</dt>
                <dd className="truncate font-mono text-[11px] text-slate-200" title={headers.from}>
                  {headers.from}
                </dd>
              </div>
            )}
            {headers.to && (
              <div className="min-w-0 rounded-lg border border-slate-800 bg-slate-950/60 px-2.5 py-1.5">
                <dt className="font-mono text-[10px] uppercase tracking-wider text-slate-500">To</dt>
                <dd className="truncate font-mono text-[11px] text-slate-200" title={headers.to}>
                  {headers.to}
                </dd>
              </div>
            )}
            {headers.subject && (
              <div className="min-w-0 rounded-lg border border-slate-800 bg-slate-950/60 px-2.5 py-1.5 sm:col-span-1">
                <dt className="font-mono text-[10px] uppercase tracking-wider text-slate-500">Subject</dt>
                <dd className="truncate font-mono text-[11px] text-slate-200" title={headers.subject}>
                  {headers.subject}
                </dd>
              </div>
            )}
          </dl>
        )}

        <div
          className={cn(
            'relative min-h-[18rem] flex-1 overflow-hidden rounded-xl border bg-inset transition-all',
            isDragging
              ? 'border-cyan-400/50 ring-1 ring-cyan-400/40'
              : 'border-slate-800 focus-within:border-emerald-500/45 focus-within:ring-1 focus-within:ring-emerald-500/35'
          )}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            const file = event.dataTransfer.files[0];
            if (file) void readDroppedFile(file);
          }}
        >
          {showHighlight && text && (
            <div
              ref={overlayRef}
              className="editor-layer pointer-events-none absolute inset-0 z-0 overflow-hidden p-4 text-slate-200"
              aria-hidden="true"
            >
              {renderHighlightedText(text, {
                triggerWords,
                highlightLinks: true,
                focusedTrigger,
              })}
            </div>
          )}

          <textarea
            ref={textareaRef}
            value={text}
            onChange={(event) => setText(event.target.value)}
            onScroll={syncOverlayScroll}
            placeholder="Paste raw email headers and body for forensic AI analysis…"
            className={cn(
              'editor-layer relative z-10 h-full min-h-[18rem] w-full resize-none bg-transparent p-4 text-slate-200 placeholder-slate-600 focus:outline-none',
              showHighlight && text && 'caret-slate-100 text-transparent'
            )}
            spellCheck={false}
            aria-label="Email payload"
          />

          {isLoading && (
            <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-xl bg-slate-950/20">
              <div className="scan-line" />
            </div>
          )}

          {isDragging && (
            <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-slate-950/70 font-mono text-xs text-cyan-200">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-slate-900/80 px-3 py-1.5">
                <Upload className="h-3.5 w-3.5" />
                Drop .eml / .txt payload
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5 font-mono text-[11px]">
            <span className="mr-0.5 text-slate-500">Vectors</span>
            {SAMPLE_PAYLOADS.map((sample) => (
              <button
                key={sample.id}
                type="button"
                title={sample.description}
                onClick={() => handleSampleLoad(sample)}
                className={cn(
                  'rounded-md border px-2 py-0.5 transition-all',
                  sample.kind === 'phishing'
                    ? 'border-rose-500/20 bg-rose-500/10 text-rose-300 hover:border-rose-500/40 hover:bg-rose-500/20'
                    : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300 hover:border-emerald-500/40 hover:bg-emerald-500/20'
                )}
              >
                {sample.label}
              </button>
            ))}
          </div>

          <div className="flex w-full items-center justify-end gap-3 sm:w-auto">
            <div className="flex items-center gap-1.5 font-mono text-[11px]">
              {!isMinWordCountMet && text.length > 0 && (
                <AlertCircle className="h-3.5 w-3.5 text-amber-400" />
              )}
              <span className={isMinWordCountMet ? 'text-slate-500' : 'text-amber-400 font-semibold'}>
                {wordCount} / {FORENSIC_MIN_WORDS} words
              </span>
            </div>

            {!isApiOnline && (
              <Badge tone="threat" className="hidden sm:inline-flex">
                Engine offline
              </Badge>
            )}

            <Button
              variant="primary"
              size="md"
              onClick={() => onAnalyze(text)}
              disabled={!canAnalyze}
              title={!isApiOnline ? 'API engine is offline' : 'Run forensic analysis'}
            >
              {isLoading ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                  Auditing
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Run
                  <Kbd className="border-emerald-900/40 bg-emerald-950/20 text-slate-900">
                    {analyzeShortcutLabel()}
                  </Kbd>
                </>
              )}
            </Button>
          </div>
        </div>
      </Surface>
    );
  }
);
