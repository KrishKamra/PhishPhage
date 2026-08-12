import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

interface SurfaceProps extends HTMLAttributes<HTMLDivElement> {
  glow?: 'none' | 'safe' | 'threat' | 'info';
  padding?: 'none' | 'sm' | 'md';
}

const glowClass = {
  none: '',
  safe: 'glow-emerald',
  threat: 'glow-rose',
  info: 'shadow-[0_0_28px_-8px_rgb(34_211_238/0.25)]',
} as const;

const paddingClass = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
} as const;

export function Surface({
  glow = 'none',
  padding = 'md',
  className,
  ...props
}: SurfaceProps) {
  return (
    <div
      className={cn(
        'glass-panel rounded-[var(--radius-panel)]',
        paddingClass[padding],
        glowClass[glow],
        className
      )}
      {...props}
    />
  );
}
