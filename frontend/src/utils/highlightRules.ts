import React from 'react';

export interface HighlightOptions {
  triggerWords?: string[];
  highlightLinks?: boolean;
  focusedTrigger?: string | null;
}

const escapeRegex = (str: string): string =>
  str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Parses raw text and returns annotated nodes for trigger words and
 * suspicious URLs. Overlay must share font/padding/scroll with the textarea.
 */
export const renderHighlightedText = (
  rawText: string,
  options: HighlightOptions = {}
): React.ReactNode[] => {
  if (!rawText) return [];

  const { triggerWords = [], highlightLinks = true, focusedTrigger = null } = options;
  const patterns: string[] = [];

  if (highlightLinks) {
    patterns.push(`(https?://[^\\s]+)`);
  }

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
  let firstFocusedAssigned = false;

  return parts
    .filter((part) => part !== undefined && part !== '')
    .map((part, index) => {
      const lowerPart = part.toLowerCase();
      const isUrl = /^https?:\/\//i.test(part);
      const isIpUrl = isUrl && /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(part);
      const isUnencrypted = isUrl && part.startsWith('http://');
      const isTriggerWord = triggerWords.some((word) => word.toLowerCase() === lowerPart);
      const isFocused =
        Boolean(focusedTrigger) &&
        isTriggerWord &&
        lowerPart === focusedTrigger?.toLowerCase() &&
        !firstFocusedAssigned;

      if (isFocused) firstFocusedAssigned = true;

      if (isUrl && (isIpUrl || isUnencrypted)) {
        return React.createElement(
          'mark',
          {
            key: `url-${index}`,
            className:
              'rounded bg-rose-500/20 px-0.5 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.18)]',
            title: isIpUrl ? 'Raw IP address detected' : 'Unencrypted HTTP protocol',
          },
          part
        );
      }

      if (isTriggerWord) {
        return React.createElement(
          'mark',
          {
            key: `trigger-${index}`,
            className: `rounded bg-amber-500/20 px-0.5 font-semibold text-amber-300 ${
              isFocused ? 'mark-pulse ring-1 ring-amber-300/70' : ''
            }`,
            title: 'Psychological urgency trigger',
          },
          part
        );
      }

      return part;
    });
};
