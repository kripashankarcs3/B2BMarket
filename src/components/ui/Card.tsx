'use client';

import { type ReactNode, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'glass' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const paddingStyles = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

const variantStyles = {
  default: 'bg-white border border-ink-100',
  glass: 'glass-card elev',
  elevated: 'bg-white border border-ink-100 elev',
};

const Card = ({ children, variant = 'default', padding = 'md', hover = false, className, ...props }: CardProps) => {
  return (
    <div
      className={cn(
        'rounded-lg transition-smooth',
        variantStyles[variant],
        paddingStyles[padding],
        hover && 'hover-lift cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export { Card };
export type { CardProps };
