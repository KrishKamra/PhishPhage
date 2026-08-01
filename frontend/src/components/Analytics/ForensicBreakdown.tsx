import React, { useState } from 'react';
import { AlertTriangle, Link2, ShieldCheck, Flame, ExternalLink, HelpCircle } from 'lucide-react';
import type { ForensicAnalysis } from '../../types';

interface ForensicBreakdownProps {
  analysis: ForensicAnalysis;
  explanation: string;
  isPhishing: boolean;
}

export const ForensicBreakdown: React.FC<ForensicBreakdownProps> = ({
  analysis,
  explanation,
  isPhishing,
}) => {
  const [activeTab, setActiveTab] = useState<'urgency' | 'links' | 'explanation'>('urgency');

  const { urgency_level, trigger_words_found, link_details } = analysis;

  const urgencyColor =
    urgency_level === 'High'
      ? 'text-rose-400 bg-rose-500/10 border-rose-500/30'
      : urgency_level === 'Medium'
      ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
      : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';

  const suspiciousLinksCount = link_details.filter((l) => l.is_suspicious).length;

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md shadow-2xl flex flex-col space-y-4">
      
      {/* Tab Navigation */}
      <div className="flex items-center space-x-1 border-b border-slate-800 pb-3">
        
        <button
          type="button"
          onClick={() => setActiveTab('urgency')}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
            activeTab === 'urgency'
              ? 'bg-slate-800 text-slate-100 border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span>Urgency ({trigger_words_found.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('links')}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
            activeTab === 'links'
              ? 'bg-slate-800 text-slate-100 border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Link2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>
            Links ({link_details.length})
            {suspiciousLinksCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 text-[10px] bg-rose-500/20 text-rose-300 rounded-full">
                {suspiciousLinksCount}
              </span>
            )}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('explanation')}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
            activeTab === 'explanation'
              ? 'bg-slate-800 text-slate-100 border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>XAI Rationale</span>
        </button>

      </div>

      {/* Tab 1: Urgency & Psychological Triggers */}
      {activeTab === 'urgency' && (
        <div className="space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Psychological Urgency Level:</span>
            <span className={`px-2 py-0.5 rounded border font-bold ${urgencyColor}`}>
              {urgency_level.toUpperCase()} PRIORITY
            </span>
          </div>

          <div>
            <span className="text-slate-400 block mb-2">Detected Trigger Words:</span>
            {trigger_words_found.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {trigger_words_found.map((word, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[11px]"
                  >
                    🚨 {word}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 italic">No psychological manipulation keywords found.</p>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Link & URL Parsing */}
      {activeTab === 'links' && (
        <div className="space-y-3 font-mono text-xs">
          {link_details.length > 0 ? (
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {link_details.map((link, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-lg border flex flex-col space-y-1 ${
                    link.is_suspicious
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate font-semibold max-w-[280px]">{link.url}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div className="flex items-center space-x-1 text-[10px]">
                    {link.is_suspicious ? (
                      <>
                        <AlertTriangle className="w-3 h-3 text-rose-400" />
                        <span className="text-rose-400">{link.reason}</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">{link.reason}</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 italic">No embedded hyper-links detected in raw text.</p>
          )}
        </div>
      )}

      {/* Tab 3: Explainable AI Rationale */}
      {activeTab === 'explanation' && (
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-slate-300 font-mono text-xs leading-relaxed space-y-2">
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-1.5">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold">
              <HelpCircle className="w-4 h-4" />
              <span>AI Decision Rationale:</span>
            </div>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold border ${
                isPhishing
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              }`}
            >
              {isPhishing ? 'THREAT MODE' : 'SAFE MODE'}
            </span>
          </div>
          <p>{explanation}</p>
          <div className="text-[10px] text-slate-500 border-t border-slate-800 pt-2">
            * Evaluated using Random Forest Classifier & TF-IDF n-gram vectorization.
          </div>
        </div>
      )}

    </div>
  );
};