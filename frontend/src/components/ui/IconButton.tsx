import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export function IconButton({ label, className, type = 'button', ...props }: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-950/60 text-slate-400 transition-colors hover:border-slate-700 hover:bg-slate-800 hover:text-slate-100 disabled:pointer-events-none disabled:opacity-30',
        className
      )}
      {...props}
    />
  );
}
