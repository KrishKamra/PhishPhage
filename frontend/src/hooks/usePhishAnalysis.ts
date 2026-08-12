import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { API_BASE_URL, FORENSIC_MIN_WORDS } from '../lib/api';
import type { PredictResponse, EmailRequest } from '../types';

interface UsePhishAnalysisReturn {
  analyzeEmail: (text: string) => Promise<PredictResponse | null>;
  resetAnalysis: () => void;
  isLoading: boolean;
  error: string | null;
  data: PredictResponse | null;
}

export const usePhishAnalysis = (): UsePhishAnalysisReturn => {
  const [data, setData] = useState<PredictResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetAnalysis = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  const analyzeEmail = useCallback(async (text: string): Promise<PredictResponse | null> => {
    const trimmedText = text.trim();
    const wordCount = trimmedText ? trimmedText.split(/\s+/).length : 0;

    if (wordCount < FORENSIC_MIN_WORDS) {
      const msg = `Context too short. Minimum ${FORENSIC_MIN_WORDS} words required for forensic accuracy.`;
      toast.warning('Insufficient Context', { description: msg });
      setError(msg);
      return null;
    }

    setIsLoading(true);
    setError(null);

    const payload: EmailRequest = { text: trimmedText };

    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        if (response.status === 503) {
          throw new Error('ML model engine is currently offline or loading.');
        }
        const errDetail = await response.json().catch(() => ({ detail: 'API Error' }));
        throw new Error(errDetail.detail || `Server returned error ${response.status}`);
      }

      const result: PredictResponse = await response.json();
      setData(result);

      if (result.is_phishing) {
        toast.error('Threat Detected', {
          description: `Confidence: ${result.confidence} | Urgency: ${result.analysis.urgency_level}`,
        });
      } else {
        toast.success('Legitimate Communication', {
          description: `Confidence: ${result.confidence} | No malicious patterns found.`,
        });
      }

      return result;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unexpected network error occurred.';
      setError(errorMessage);
      toast.error('Analysis Failed', { description: errorMessage });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    analyzeEmail,
    resetAnalysis,
    isLoading,
    error,
    data,
  };
};
