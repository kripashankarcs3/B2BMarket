import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'premium';
  size?: 'sm' | 'md';
  className?: string;
}

const variants = {
  default: 'bg-ink-50 text-ink-600 border-ink-200',
  success: 'bg-leaf-50 text-leaf-700 border-leaf-600/20',
  warning: 'bg-accent-50 text-accent-700 border-accent-500/30',
  danger: 'bg-red-50 text-red-700 border-red-200',
  info: 'bg-brand-50 text-brand-700 border-brand-200',
  premium: 'bg-accent-50 text-accent-700 border-accent-500/40',
};

const sizes = {
  sm: 'px-1.5 py-0.5 text-[11px] gap-1',
  md: 'px-2 py-0.5 text-xs gap-1',
};

const Badge = ({ children, variant = 'default', size = 'md', className }: BadgeProps) => {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-sm border whitespace-nowrap',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
};

export { Badge };
export type { BadgeProps };
