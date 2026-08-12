export interface ParsedEmailHeaders {
  from?: string;
  to?: string;
  subject?: string;
}

const HEADER_LINE = /^(From|To|Subject)\s*:\s*(.+)$/gim;

/**
 * Best-effort extraction of RFC-5322-ish From/To/Subject lines
 * from a pasted raw payload. Frontend-only — does not alter the
 * string sent to /predict.
 */
export function parseEmailHeaders(text: string): ParsedEmailHeaders {
  const result: ParsedEmailHeaders = {};
  if (!text) return result;

  const matches = text.matchAll(HEADER_LINE);
  for (const match of matches) {
    const key = match[1].toLowerCase() as keyof ParsedEmailHeaders;
    const value = match[2].trim();
    if (value && !result[key]) {
      result[key] = value;
    }
  }

  return result;
}
