import { useState, useCallback } from 'react';
import jsPDF from 'jspdf';
import { toast } from 'sonner';
import type { PredictResponse } from '../types';

interface UseAnalyticExportReturn {
  exportToPdf: (data: PredictResponse | null, emailText?: string, filename?: string) => Promise<void>;
  isExporting: boolean;
}

export const useAnalyticExport = (): UseAnalyticExportReturn => {
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const exportToPdf = useCallback(
    async (
      data: PredictResponse | null,
      rawEmailText: string = '',
      filename = 'PhishPhage-Forensic-Report.pdf'
    ) => {
      if (!data) {
        toast.error('Export Failed', { description: 'No analysis dataset available to export.' });
        return;
      }

      setIsExporting(true);
      const toastId = toast.loading('Generating SOC Threat Intelligence PDF...');

      try {
        const doc = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        });

        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

        // --- SAFE PROPERTY EXTRACTORS & FALLBACKS ---
        const safeEmailText = typeof rawEmailText === 'string' ? rawEmailText : '';
        
        const analysis = data.analysis ?? {
          urgency_level: 'Low',
          trigger_words_found: [],
          total_links_found: 0,
          link_details: [],
        };

        const urgencyLevel = (analysis.urgency_level ?? 'Low').toUpperCase();
        const triggerWords = analysis.trigger_words_found ?? [];
        const linkDetails = analysis.link_details ?? [];
        const totalLinks = analysis.total_links_found ?? linkDetails.length;
        const confidenceStr = data.confidence ?? '0.00%';
        const isPhishing = Boolean(data.is_phishing);
        const explanation = data.explanation ?? 'No detailed rationale provided.';

        // --- COLOR PALETTE ---
        const bgDark = [2, 6, 23];          // Slate-950
        const panelDark = [15, 23, 42];      // Slate-900
        const textWhite = [248, 250, 252];   // Slate-50
        const textMuted = [148, 163, 184];   // Slate-400
        const borderSlate = [51, 65, 85];    // Slate-700
        const accentRose = [244, 63, 94];    // Rose-500
        const accentEmerald = [16, 185, 129];// Emerald-500
        const accentAmber = [245, 158, 11];  // Amber-500

        // Page Background
        doc.setFillColor(bgDark[0], bgDark[1], bgDark[2]);
        doc.rect(0, 0, 210, 297, 'F');

        // --- HEADER BANNER ---
        doc.setFillColor(panelDark[0], panelDark[1], panelDark[2]);
        doc.setDrawColor(borderSlate[0], borderSlate[1], borderSlate[2]);
        doc.roundedRect(10, 10, 190, 24, 3, 3, 'FD');

        doc.setFont('courier', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(textWhite[0], textWhite[1], textWhite[2]);
        doc.text('PHISHPHAGE FORENSIC AUDIT REPORT', 15, 20);

        doc.setFont('courier', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
        doc.text(`GENERATED: ${timestamp} UTC | VERSION: 1.1.0 SOC`, 15, 28);

        // --- VERDICT SECTION ---
        const verdictBg = isPhishing ? accentRose : accentEmerald;
        doc.setFillColor(verdictBg[0], verdictBg[1], verdictBg[2]);
        doc.roundedRect(10, 38, 190, 28, 3, 3, 'F');

        doc.setFont('courier', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(0, 0, 0);
        const verdictText = isPhishing
          ? '🚨 VERDICT: PHISHING ATTACK DETECTED'
          : '✅ VERDICT: COMMUNICATIONS AUDITED SAFE';
        doc.text(verdictText, 15, 48);

        doc.setFontSize(9.5);
        doc.text(
          `AI Confidence Score: ${confidenceStr} | Urgency Priority: ${urgencyLevel}`,
          15,
          58
        );

        // --- EVALUATED EMAIL PAYLOAD BOX ---
        doc.setFillColor(panelDark[0], panelDark[1], panelDark[2]);
        doc.setDrawColor(borderSlate[0], borderSlate[1], borderSlate[2]);
        doc.roundedRect(10, 70, 190, 50, 3, 3, 'FD');

        doc.setFont('courier', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(accentEmerald[0], accentEmerald[1], accentEmerald[2]);
        doc.text('EVALUATED EMAIL TEXT PAYLOAD:', 15, 78);

        doc.setFont('courier', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(textWhite[0], textWhite[1], textWhite[2]);

        const truncatedText =
          safeEmailText.length > 500
            ? `${safeEmailText.substring(0, 500)}...`
            : safeEmailText || 'No raw email text payload provided.';

        const splitLines = doc.splitTextToSize(truncatedText, 180);
        doc.text(splitLines, 15, 85);

        // --- FORENSIC METRICS PANEL ---
        doc.setFillColor(panelDark[0], panelDark[1], panelDark[2]);
        doc.roundedRect(10, 124, 190, 55, 3, 3, 'FD');

        doc.setFont('courier', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(accentAmber[0], accentAmber[1], accentAmber[2]);
        doc.text('LINGUISTIC TRIGGERS & LINK ANALYSIS:', 15, 132);

        doc.setFont('courier', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(textWhite[0], textWhite[1], textWhite[2]);

        const triggersStr = triggerWords.length > 0 ? triggerWords.join(', ') : 'None Identified';
        doc.text(`Trigger Keywords Found (${triggerWords.length}):`, 15, 140);

        doc.setTextColor(accentAmber[0], accentAmber[1], accentAmber[2]);
        const triggerLines = doc.splitTextToSize(triggersStr, 180);
        doc.text(triggerLines, 15, 146);

        const suspiciousLinksCount = linkDetails.filter((l) => l.is_suspicious).length;
        doc.setTextColor(textWhite[0], textWhite[1], textWhite[2]);
        doc.text(
          `Embedded Links Audited: ${totalLinks} (${suspiciousLinksCount} Flagged Suspicious)`,
          15,
          162
        );

        // --- EXPLAINABLE AI (XAI) RATIONALE ---
        doc.setFillColor(panelDark[0], panelDark[1], panelDark[2]);
        doc.roundedRect(10, 183, 190, 45, 3, 3, 'FD');

        doc.setFont('courier', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(accentEmerald[0], accentEmerald[1], accentEmerald[2]);
        doc.text('EXPLAINABLE AI (XAI) RATIONALE:', 15, 191);

        doc.setFont('courier', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(textWhite[0], textWhite[1], textWhite[2]);
        const explanationLines = doc.splitTextToSize(explanation, 180);
        doc.text(explanationLines, 15, 199);

        // --- FOOTER ---
        doc.setFont('courier', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
        doc.text(
          'CONFIDENTIAL • PhishPhage SOC Threat Intelligence Report • Powered by Random Forest & TF-IDF Vectorization',
          15,
          285
        );

        doc.save(filename);
        toast.success('Report Exported', {
          id: toastId,
          description: `Saved ${filename} successfully.`,
        });
      } catch (err) {
        console.error('PDF Export Error:', err);
        toast.error('Export Failed', {
          id: toastId,
          description: 'Failed to generate PDF report.',
        });
      } finally {
        setIsExporting(false);
      }
    },
    []
  );

  return {
    exportToPdf,
    isExporting,
  };
};