import React from 'react';

export interface HighlightOptions {
  triggerWords?: string[];
  highlightLinks?: boolean;
}

/**
 * Escapes special characters for dynamic Regex construction
 */
const escapeRegex = (str: string): string =>
  str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Parses raw text and returns an array of annotated JSX ReactNodes with 
 * context-aware styling for detected phishing triggers and suspicious URLs.
 */
export const renderHighlightedText = (
  rawText: string,
  options: HighlightOptions = {}
): React.ReactNode[] => {
  if (!rawText) return [];

  const { triggerWords = [], highlightLinks = true } = options;

  // Build composite matching regex
  const patterns: string[] = [];

  // Pattern 1: Suspicious URLs & IP addresses
  if (highlightLinks) {
    patterns.push(`(https?://[^\\s]+)`);
  }

  // Pattern 2: Linguistic Trigger Words (Word Boundary matched)
  if (triggerWords.length > 0) {
    const sortedTriggers = [...triggerWords].sort((a, b) => b.length - a.length);
    const escapedTriggers = sortedTriggers.map(escapeRegex).join('|');
    patterns.push(`(\\b(?:${escapedTriggers})\\b)`);
  }

  if (patterns.length === 0) {
    return [rawText];
  }

  const combinedRegex = new RegExp(patterns.join('|'), 'gi');
  const parts = rawText.split(combinedRegex);

  return parts
    .filter((part) => part !== undefined && part !== '')
    .map((part, index) => {
      const lowerPart = part.toLowerCase();

      // Check if part matches a URL/IP pattern
      const isUrl = /^https?:\/\//i.test(part);
      const isIpUrl = isUrl && /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(part);
      const isUnencrypted = isUrl && part.startsWith('http://');

      // Check if part matches a trigger keyword
      const isTriggerWord = triggerWords.some(
        (word) => word.toLowerCase() === lowerPart
      );

      // Render IP or HTTP URL Threat Highlight
      if (isUrl && (isIpUrl || isUnencrypted)) {
        return React.createElement(
          'mark',
          {
            key: `url-${index}`,
            className:
              'group relative inline-flex items-center px-1.5 py-0.5 rounded text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.2)] transition-all cursor-help',
          },
          [
            part,
            React.createElement(
              'span',
              {
                key: `tooltip-url-${index}`,
                className:
                  'absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col whitespace-nowrap bg-slate-900 text-rose-300 text-[10px] font-sans px-2.5 py-1 rounded border border-rose-500/30 shadow-xl z-50 pointer-events-none',
              },
              isIpUrl ? '⚠️ Raw IP Address Detected' : '⚠️ Unencrypted HTTP Protocol'
            ),
          ]
        );
      }

      // Render Trigger Keyword Highlight
      if (isTriggerWord) {
        return React.createElement(
          'mark',
          {
            key: `trigger-${index}`,
            className:
              'group relative inline-block px-1.5 py-0.5 rounded text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.2)] transition-all cursor-help',
          },
          [
            part,
            React.createElement(
              'span',
              {
                key: `tooltip-trigger-${index}`,
                className:
                  'absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex whitespace-nowrap bg-slate-900 text-amber-300 text-[10px] font-sans px-2.5 py-1 rounded border border-amber-500/30 shadow-xl z-50 pointer-events-none',
              },
              '🚨 Psychological Urgency Trigger'
            ),
          ]
        );
      }

      // Standard Unmatched Text Segment
      return part;
    });
};