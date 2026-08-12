import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export type AtmosphereVerdict = 'idle' | 'safe' | 'threat' | 'loading';

interface AtmosphereProps extends HTMLAttributes<HTMLDivElement> {
  verdict?: AtmosphereVerdict;
}

export function Atmosphere({ verdict = 'idle', className, ...props }: AtmosphereProps) {
  return (
    <div
      className={cn('atmosphere', className)}
      data-verdict={verdict}
      aria-hidden="true"
      {...props}
    >
      <div className="atmosphere-grid" />
      <div className="atmosphere-glow atmosphere-glow-a" />
      <div className="atmosphere-glow atmosphere-glow-b" />
      <div className="atmosphere-glow atmosphere-glow-c" />
      <div className="atmosphere-vignette" />
      <div className="atmosphere-noise" />
    </div>
  );
}
