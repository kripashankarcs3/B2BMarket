'use client';

import { useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-3xl',
};

const Modal = ({ isOpen, onClose, children, title, size = 'md', className }: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-ink-900/40 backdrop-blur-[2px]"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={cn(
              'relative w-full bg-white rounded-xl elev-xl max-h-[85vh] overflow-y-auto',
              sizeClasses[size],
              className
            )}
          >
            {title && (
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-ink-100">
                <h2 className="text-lg font-semibold text-ink-900">{title}</h2>
                <button onClick={onClose} aria-label="Close" className="p-1.5 rounded-full hover:bg-ink-50 transition-smooth">
                  <X size={20} className="text-ink-400" />
                </button>
              </div>
            )}
            {!title && (
              <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-ink-50 transition-smooth z-10">
                <X size={20} className="text-ink-400" />
              </button>
            )}
            <div className={cn(!title && 'pt-2')}>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export { Modal };
export type { ModalProps };
