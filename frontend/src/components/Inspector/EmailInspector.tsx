import React, { useState, useMemo } from 'react';
import { Eye, EyeOff, Sparkles, RotateCcw, AlertCircle, FileText } from 'lucide-react';
import { renderHighlightedText } from '../../utils/highlightRules';

interface EmailInspectorProps {
  onAnalyze: (text: string) => void;
  onReset: () => void;
  isLoading: boolean;
  triggerWords?: string[];
}

const SAMPLE_PHISHING_VECTOR = `URGENT SECURITY ALERT: Your account access has been suspended due to unauthorized login attempts. Please click http://192.168.1.1/verify immediately to validate your password and prevent account termination within 24 hours. Action required!`;

const SAMPLE_SAFE_VECTOR = `Hi Team, please review the attached project roadmap for Phase 2. We have scheduled our sprint sync meeting for tomorrow at 10 AM EST. Let me know if you need any adjustments to the agenda beforehand.`;

export const EmailInspector: React.FC<EmailInspectorProps> = ({
  onAnalyze,
  onReset,
  isLoading,
  triggerWords = [],
}) => {
  const [text, setText] = useState<string>('');
  const [showHighlight, setShowHighlight] = useState<boolean>(true);

  const wordCount = useMemo(() => {
    const trimmed = text.trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  }, [text]);

  const isMinWordCountMet = wordCount >= 5;

  const handleClear = () => {
    setText('');
    onReset();
  };

  const handleSampleLoad = (sample: string) => {
    setText(sample);
  };

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md shadow-2xl flex flex-col justify-between space-y-4">
      
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-semibold tracking-wide text-slate-200 font-mono uppercase">
            Email Payload Inspector
          </h2>
        </div>

        {/* Action Toggles */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setShowHighlight(!showHighlight)}
            className={`flex items-center space-x-1.5 text-xs px-2.5 py-1 rounded-md border font-mono transition-all ${
              showHighlight
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {showHighlight ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{showHighlight ? 'Highlight ON' : 'Highlight OFF'}</span>
          </button>

          <button
            type="button"
            onClick={handleClear}
            disabled={!text}
            className="p-1.5 text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:hover:text-slate-400 rounded-md hover:bg-slate-800 transition-all"
            title="Clear Text"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor & Highlight Container */}
      <div className="relative min-h-[220px] w-full rounded-xl border border-slate-800 bg-slate-950/80 p-4 font-mono text-sm leading-relaxed text-slate-200 focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/50 transition-all">
        
        {/* Highlight Overlay Layer */}
        {showHighlight && text && (
          <div
            className="absolute inset-0 p-4 pointer-events-none whitespace-pre-wrap break-words overflow-hidden text-transparent font-mono text-sm leading-relaxed z-0"
            aria-hidden="true"
          >
            {renderHighlightedText(text, { triggerWords, highlightLinks: true })}
          </div>
        )}

        {/* Textarea Input Layer */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste raw email header or body text here for forensic AI analysis..."
          className="relative z-10 w-full h-48 bg-transparent text-slate-200 placeholder-slate-600 resize-none focus:outline-none font-mono text-sm leading-relaxed"
          spellCheck="false"
        />
      </div>

      {/* Footer controls & Forensic Word Counter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
        
        {/* Sample Vectors */}
        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="text-slate-500">Test Vector:</span>
          <button
            type="button"
            onClick={() => handleSampleLoad(SAMPLE_PHISHING_VECTOR)}
            className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all"
          >
            Phishing
          </button>
          <button
            type="button"
            onClick={() => handleSampleLoad(SAMPLE_SAFE_VECTOR)}
            className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
          >
            Legitimate
          </button>
        </div>

        {/* Word Counter & Run Button */}
        <div className="flex items-center space-x-4 w-full sm:w-auto justify-end">
          
          <div className="flex items-center space-x-1.5 text-xs font-mono">
            {!isMinWordCountMet && text.length > 0 && (
              <AlertCircle className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            )}
            <span className={isMinWordCountMet ? 'text-slate-400' : 'text-amber-400 font-semibold'}>
              {wordCount} / 5 words min
            </span>
          </div>

          <button
            type="button"
            onClick={() => onAnalyze(text)}
            disabled={!isMinWordCountMet || isLoading}
            className="flex items-center justify-center space-x-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-slate-950 font-semibold font-mono text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Auditing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run Forensic AI</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};