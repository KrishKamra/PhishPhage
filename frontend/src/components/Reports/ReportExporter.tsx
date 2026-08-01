import React from 'react';
import { Download, Copy, Check, FileCode } from 'lucide-react';
import { toast } from 'sonner';
import type { PredictResponse } from '../../types';

interface ReportExporterProps {
  data: PredictResponse;
  emailText: string;
  onExportPdf: () => void;
  isExportingPdf: boolean;
}

export const ReportExporter: React.FC<ReportExporterProps> = ({
  data,
  emailText,
  onExportPdf,
  isExportingPdf,
}) => {
  const [copied, setCopied] = React.useState<boolean>(false);

  const generateMarkdownTicket = () => {
    return `### 🛡️ PhishPhage Incident Report
**Verdict:** ${data.prediction}
**Confidence:** ${data.confidence}
**Urgency Level:** ${data.analysis.urgency_level}
**Trigger Words Found:** ${data.analysis.trigger_words_found.join(', ') || 'None'}
**Suspicious Links:** ${data.analysis.link_details.filter((l) => l.is_suspicious).length} / ${data.analysis.total_links_found}

---
#### 📄 Evaluated Content Snapshot:
\`\`\`text
${emailText.slice(0, 300)}${emailText.length > 300 ? '...' : ''}
\`\`\`

#### 🤖 AI Rationale:
${data.explanation}
`;
  };

  const handleCopyMarkdown = () => {
    const md = generateMarkdownTicket();
    navigator.clipboard.writeText(md);
    setCopied(true);
    toast.success('Report Copied to Clipboard', {
      description: 'Ready to paste into Jira or ServiceNow ticketing system.',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-md shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
      
      {/* Title */}
      <div className="flex items-center space-x-2">
        <FileCode className="w-4 h-4 text-cyan-400" />
        <span className="text-xs font-mono font-semibold text-slate-300">
          SOC Ticketing & Forensic Artifact Export:
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2 w-full sm:w-auto">
        
        {/* Copy Markdown Button */}
        <button
          type="button"
          onClick={handleCopyMarkdown}
          className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-mono transition-all"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
          <span>{copied ? 'Copied' : 'Copy Ticket MD'}</span>
        </button>

        {/* Export PDF Button */}
        <button
          type="button"
          onClick={onExportPdf}
          disabled={isExportingPdf}
          className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold text-xs font-mono shadow-[0_0_15px_rgba(6,182,212,0.25)] disabled:opacity-50 transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{isExportingPdf ? 'Exporting...' : 'Export PDF Report'}</span>
        </button>

      </div>

    </div>
  );
};