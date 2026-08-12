import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../lib/api';
import type { ApiStatus } from '../types';

export interface ApiHealth {
  apiStatus: ApiStatus | null;
  isOnline: boolean;
  isPinging: boolean;
}

export function useApiHealth(pollMs = 30_000): ApiHealth {
  const [apiStatus, setApiStatus] = useState<ApiStatus | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [isPinging, setIsPinging] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const checkHealth = async () => {
      setIsPinging(true);
      try {
        const res = await fetch(`${API_BASE_URL}/`, { cache: 'no-store' });
        if (!res.ok) {
          if (!cancelled) {
            setIsOnline(false);
          }
          return;
        }
        const data: ApiStatus = await res.json();
        if (!cancelled) {
          setApiStatus(data);
          setIsOnline(Boolean(data.model_loaded));
        }
      } catch {
        if (!cancelled) {
          setIsOnline(false);
        }
      } finally {
        if (!cancelled) {
          setIsPinging(false);
        }
      }
    };

    void checkHealth();
    const interval = window.setInterval(() => {
      void checkHealth();
    }, pollMs);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [pollMs]);

  return { apiStatus, isOnline, isPinging };
}
