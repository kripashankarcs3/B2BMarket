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
  default: 'bg-white border border-apple-gray-100 ios-shadow-sm',
  glass: 'glass-card ios-shadow',
  elevated: 'bg-white ios-shadow-lg',
};

const Card = ({ children, variant = 'default', padding = 'md', hover = false, className, ...props }: CardProps) => {
  return (
    <div
      className={cn(
        'rounded-[16px] apple-transition',
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
