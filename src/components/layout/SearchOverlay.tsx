'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { products, categories } from '@/lib/data';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof products>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.length > 1) {
      const filtered = products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const trending = ['Smart Factory', 'Organic Cotton', 'CNC Machine', 'Medical Equipment', 'Brake System'];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4"
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-white rounded-[20px] ios-shadow-xl overflow-hidden"
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-apple-gray-100">
              <Search size={20} className="text-apple-gray-400 shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, suppliers, categories..."
                className="flex-1 text-base text-apple-gray-900 placeholder:text-apple-gray-400 outline-none bg-transparent"
              />
              {query && (
                <button onClick={() => setQuery('')} className="p-1 rounded-full hover:bg-apple-gray-50">
                  <X size={16} className="text-apple-gray-400" />
                </button>
              )}
              <button onClick={onClose} className="hidden sm:flex px-2 py-1 text-xs text-apple-gray-400 bg-apple-gray-50 rounded-lg font-medium">
                ESC
              </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto p-2">
              {results.length > 0 ? (
                <div className="space-y-0.5">
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      onClick={onClose}
                      className="flex items-center gap-4 px-3 py-3 rounded-[14px] hover:bg-apple-gray-50 apple-transition group"
                    >
                      <div className="w-12 h-12 rounded-[10px] bg-apple-gray-50 overflow-hidden shrink-0">
                        <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-apple-gray-900 truncate">{product.name}</p>
                        <p className="text-xs text-apple-gray-400">{product.supplier.name}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold text-apple-gray-900">${product.price.toLocaleString()}</p>
                        <p className="text-xs text-apple-gray-400">MOQ: {product.moq}</p>
                      </div>
                      <ArrowRight size={16} className="text-apple-gray-300 opacity-0 group-hover:opacity-100 apple-transition" />
                    </Link>
                  ))}
                </div>
              ) : query.length > 0 ? (
                <div className="flex flex-col items-center py-12 text-center">
                  <Search size={40} className="text-apple-gray-200 mb-3" />
                  <p className="text-sm text-apple-gray-400">No results found for &ldquo;{query}&rdquo;</p>
                </div>
              ) : (
                <div className="p-3 space-y-4">
                  <div>
                    <p className="flex items-center gap-2 text-xs font-medium text-apple-gray-400 uppercase tracking-wider mb-2">
                      <TrendingUp size={14} /> Trending Searches
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {trending.map((term) => (
                        <button
                          key={term}
                          onClick={() => setQuery(term)}
                          className="px-3 py-1.5 text-sm bg-apple-gray-50 rounded-[10px] text-apple-gray-600 hover:bg-apple-gray-100 apple-transition"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="flex items-center gap-2 text-xs font-medium text-apple-gray-400 uppercase tracking-wider mb-2">
                      <Clock size={14} /> Categories
                    </p>
                    <div className="grid grid-cols-2 gap-1">
                      {categories.slice(0, 6).map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/products?category=${cat.slug}`}
                          onClick={onClose}
                          className="px-3 py-2 text-sm text-apple-gray-600 hover:bg-apple-gray-50 rounded-[10px] apple-transition"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
