import { useEffect } from 'react';

type HotkeyHandler = (event: KeyboardEvent) => void;

interface HotkeyOptions {
  enabled?: boolean;
}

/**
 * Registers a document-level keydown listener. Handler should
 * call preventDefault when it consumes the event.
 */
export function useHotkeys(handler: HotkeyHandler, options: HotkeyOptions = {}): void {
  const { enabled = true } = options;

  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (event: KeyboardEvent) => {
      handler(event);
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [handler, enabled]);
}
