import type { ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8', className)}>{children}</div>;
}

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: { label: string; href: string };
  className?: string;
}

export function SectionHeader({ title, description, action, className }: SectionHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-8', className)}>
      <div className="max-w-2xl">
        <h2 className="font-display text-2xl sm:text-[2rem] font-semibold text-ink-900 leading-tight">{title}</h2>
        {description && <p className="mt-2 text-[15px] text-ink-500 leading-relaxed">{description}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="shrink-0 text-sm font-medium text-brand-600 hover:text-brand-700 underline-offset-4 hover:underline"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

export function Logo({ inverse = false, className }: { inverse?: boolean; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <svg viewBox="0 0 32 32" className="h-8 w-8 shrink-0" aria-hidden>
        <rect width="32" height="32" rx="7" className={inverse ? 'fill-white' : 'fill-brand-600'} />
        <path d="M9 22V10h7.2a3.4 3.4 0 0 1 0 6.8H9" fill="none" strokeWidth="2.4" strokeLinejoin="round" className={inverse ? 'stroke-brand-600' : 'stroke-white'} />
        <path d="M13.5 16.8h4.3a3.6 3.6 0 0 1 0 7.2H9" fill="none" strokeWidth="2.4" strokeLinejoin="round" className={inverse ? 'stroke-brand-600' : 'stroke-white'} />
        <circle cx="24" cy="10" r="2.2" className="fill-accent-500" />
      </svg>
      <span className={cn('font-display text-[1.2rem] font-semibold tracking-tight', inverse ? 'text-white' : 'text-ink-900')}>
        B2BMarket
      </span>
    </span>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-shimmer rounded-md', className)} aria-hidden />;
}

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center text-center py-16 px-6 border border-dashed border-ink-200 rounded-lg bg-ink-50/50', className)}>
      {icon && <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-white border border-ink-100 text-ink-400">{icon}</div>}
      <h3 className="text-base font-semibold text-ink-900">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-ink-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
