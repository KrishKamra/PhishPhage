import type { AnchorHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

interface TextLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  external?: boolean;
}

export function TextLink({ external = false, className, children, ...props }: TextLinkProps) {
  return (
    <a
      className={cn(
        'rounded-sm text-slate-400 transition-colors hover:text-slate-100 focus-visible:outline-offset-4',
        className
      )}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...props}
    >
      {children}
    </a>
  );
}
