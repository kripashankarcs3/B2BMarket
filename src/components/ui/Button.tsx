'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: ReactNode;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
  href?: string;
}

const variants = {
  primary: 'bg-apple-blue text-white hover:bg-apple-blue-dark active:bg-[#005bbf] shadow-sm',
  secondary: 'bg-apple-gray-50 text-apple-gray-900 hover:bg-apple-gray-100 active:bg-apple-gray-200 border border-apple-gray-200',
  ghost: 'text-apple-gray-600 hover:bg-apple-gray-50 active:bg-apple-gray-100',
  outline: 'border-2 border-apple-gray-200 text-apple-gray-900 hover:border-apple-blue hover:text-apple-blue active:bg-apple-blue-light',
  danger: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs gap-1.5 rounded-[10px]',
  md: 'px-4 py-2.5 text-sm gap-2 rounded-[12px]',
  lg: 'px-6 py-3 text-base gap-2.5 rounded-[14px]',
  xl: 'px-8 py-4 text-lg gap-3 rounded-[16px]',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, icon, iconPosition = 'left', loading, fullWidth, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center font-medium apple-transition select-none disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {loading ? (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : icon && iconPosition === 'left' ? (
          <span className="shrink-0">{icon}</span>
        ) : null}
        {children}
        {!loading && icon && iconPosition === 'right' ? (
          <span className="shrink-0">{icon}</span>
        ) : null}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
export type { ButtonProps };
