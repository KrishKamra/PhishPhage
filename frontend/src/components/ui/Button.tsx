import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'info';
type ButtonSize = 'sm' | 'md';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-safe to-cyan-600 text-slate-950 hover:from-emerald-400 hover:to-cyan-500 shadow-[0_0_20px_rgb(16_185_129/0.22)] disabled:shadow-none',
  secondary:
    'bg-slate-900/80 text-slate-200 border border-slate-700/80 hover:bg-slate-800 hover:text-white',
  ghost:
    'bg-transparent text-slate-400 hover:text-slate-100 hover:bg-slate-800/70 border border-transparent',
  danger:
    'bg-threat/10 text-rose-200 border border-rose-500/25 hover:bg-threat/20',
  info:
    'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:from-cyan-400 hover:to-blue-500 shadow-[0_0_16px_rgb(6_182_212/0.22)]',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-[11px] gap-1.5',
  md: 'h-9 px-4 text-xs gap-2',
};

export function Button({
  variant = 'secondary',
  size = 'sm',
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-mono font-semibold tracking-wide uppercase transition-all disabled:cursor-not-allowed disabled:opacity-40',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
