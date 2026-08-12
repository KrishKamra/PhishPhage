import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export function Kbd({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <kbd
      className={cn(
        'inline-flex items-center rounded border border-slate-700/80 bg-slate-950/80 px-1.5 py-0.5 font-mono text-[10px] font-medium tracking-wide text-slate-400',
        className
      )}
      {...props}
    />
  );
}
