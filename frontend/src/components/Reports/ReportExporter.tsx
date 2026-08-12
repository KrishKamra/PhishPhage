import { useState } from 'react';
import { Check, Copy, Download, FileCode } from 'lucide-react';
import { toast } from 'sonner';
import type { PredictResponse } from '../../types';
import { Button } from '../ui/Button';

interface ReportExporterProps {
  data: PredictResponse;
  emailText: string;
  onExportPdf: () => void;
  isExportingPdf: boolean;
}

export function ReportExporter({
  data,
  emailText,
  onExportPdf,
  isExportingPdf,
}: ReportExporterProps) {
  const [copied, setCopied] = useState(false);

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

  const handleCopyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(generateMarkdownTicket());
      setCopied(true);
      toast.success('Report copied', {
        description: 'Ready to paste into Jira or ServiceNow.',
      });
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Clipboard unavailable');
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-800/80 bg-slate-950/40 p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <FileCode className="h-4 w-4 text-cyan-400" />
        <span className="font-mono text-[11px] font-semibold text-slate-300">
          SOC ticket & artifact
        </span>
      </div>
      <div className="flex w-full items-center gap-2 sm:w-auto">
        <Button variant="secondary" className="flex-1 sm:flex-initial" onClick={() => void handleCopyMarkdown()}>
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
          {copied ? 'Copied' : 'Copy MD'}
        </Button>
        <Button
          variant="info"
          className="flex-1 sm:flex-initial"
          onClick={onExportPdf}
          disabled={isExportingPdf}
        >
          <Download className="h-3.5 w-3.5" />
          {isExportingPdf ? 'Exporting…' : 'Export PDF'}
        </Button>
      </div>
    </div>
  );
}
