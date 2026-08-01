/**
 * PhishPhage Forensic API Data Contracts & UI State Types
 */

export interface LinkDetail {
  url: string;
  is_suspicious: boolean;
  reason: string;
}

export interface ForensicAnalysis {
  urgency_level: 'High' | 'Medium' | 'Low';
  trigger_words_found: string[];
  total_links_found: number;
  link_details: LinkDetail[];
}

export interface PredictResponse {
  prediction: 'Phishing Detected' | 'Likely Legitimate';
  is_phishing: boolean;
  confidence: string; // e.g., "98.45%"
  analysis: ForensicAnalysis;
  explanation: string;
}

export interface EmailRequest {
  text: string;
}

export interface ApiStatus {
  status: string;
  service: string;
  version: string;
  model_loaded: boolean;
}

export interface HighlightToken {
  id: string;
  text: string;
  isTrigger: boolean;
  type?: 'urgency' | 'url' | 'ip';
}