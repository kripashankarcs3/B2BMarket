'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, CornerDownLeft } from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { buildCategoryTree, categoryIcon } from '@/lib/categories';
import { useSearchResults } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { Skeleton } from '@/components/ui';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUGGESTED_SEARCHES = ['Cotton kurta', 'Brass decor', 'LED bulbs', 'Corrugated boxes', 'Basmati rice', 'Surgical gloves'];

function useDebounced<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounced(query.trim(), 250);

  const { data: results = [], isFetching } = useSearchResults(debouncedQuery);
  const { data: categories = [] } = useCategories();
  const tree = useMemo(() => buildCategoryTree(categories), [categories]);

  const matchingCategories = useMemo(() => {
    const q = debouncedQuery.toLowerCase();
    if (q.length < 2) return [];
    return categories.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 4);
  }, [categories, debouncedQuery]);

  // Start with an empty query every time the overlay opens.
  const [wasOpen, setWasOpen] = useState(isOpen);
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (isOpen) setQuery('');
  }

  useEffect(() => {
    if (!isOpen) return;
    const id = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(id);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const submit = (term: string) => {
    const q = term.trim();
    if (!q) return;
    onClose();
    router.push(`/products?q=${encodeURIComponent(q)}`);
  };

  const showResults = debouncedQuery.length >= 2;
  const isSearching = isFetching || query.trim() !== debouncedQuery;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4"
          role="dialog"
          aria-modal="true"
          aria-label="Search"
        >
          <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-[2px]" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.16 }}
            className="relative w-full max-w-2xl bg-white rounded-xl elev-xl overflow-hidden"
          >
            <form
              onSubmit={(e) => { e.preventDefault(); submit(query); }}
              className="flex items-center gap-3 px-5 h-16 border-b border-ink-100"
            >
              <Search size={20} aria-hidden className="text-ink-400 shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, categories, suppliers"
                aria-label="Search"
                className="flex-1 text-base text-ink-900 placeholder:text-ink-400 outline-none bg-transparent"
              />
              {query && (
                <button type="button" onClick={() => setQuery('')} aria-label="Clear search" className="p-1.5 rounded-sm hover:bg-ink-50">
                  <X size={16} aria-hidden className="text-ink-400" />
                </button>
              )}
              <button type="button" onClick={onClose} className="hidden sm:inline-flex px-2 py-1 text-[11px] text-ink-500 border border-ink-200 rounded-sm font-medium">
                Esc
              </button>
            </form>

            <div className="max-h-[60vh] overflow-y-auto">
              {showResults ? (
                <div className="p-2">
                  {matchingCategories.length > 0 && (
                    <div className="mb-2">
                      <p className="px-3 pt-2 pb-1 text-xs font-medium text-ink-400">Categories</p>
                      {matchingCategories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/products?category=${cat.slug}`}
                          onClick={onClose}
                          className="flex items-center justify-between px-3 py-2 rounded-md text-sm text-ink-800 hover:bg-ink-50"
                        >
                          {cat.name}
                          {cat.productCount > 0 && <span className="text-xs text-ink-400 tabular">{cat.productCount} products</span>}
                        </Link>
                      ))}
                    </div>
                  )}

                  <p className="px-3 pt-2 pb-1 text-xs font-medium text-ink-400">Products</p>
                  {isSearching && results.length === 0 ? (
                    <div className="space-y-1 p-1">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="flex items-center gap-3 px-2 py-2">
                          <Skeleton className="w-11 h-11" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-3.5 w-2/3" />
                            <Skeleton className="h-3 w-1/3" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : results.length > 0 ? (
                    <>
                      {results.slice(0, 6).map((product) => (
                        <Link
                          key={product.id}
                          href={`/products/${product.id}`}
                          onClick={onClose}
                          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-ink-50"
                        >
                          <div className="w-11 h-11 rounded-sm bg-ink-50 overflow-hidden shrink-0 border border-ink-100">
                            <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-ink-900 truncate">{product.name}</p>
                            <p className="text-xs text-ink-400 truncate">{product.supplier.name}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-semibold text-ink-900 tabular">{formatPrice(product.price)}</p>
                            <p className="text-xs text-ink-400 tabular">MOQ {product.moq}</p>
                          </div>
                        </Link>
                      ))}
                      <button
                        type="button"
                        onClick={() => submit(query)}
                        className="w-full flex items-center justify-between px-3 py-2.5 mt-1 rounded-md text-sm font-medium text-brand-600 hover:bg-brand-50"
                      >
                        See all results for &ldquo;{debouncedQuery}&rdquo;
                        <CornerDownLeft size={14} aria-hidden />
                      </button>
                    </>
                  ) : (
                    <div className="px-3 py-10 text-center">
                      <p className="text-sm font-medium text-ink-800">No products match &ldquo;{debouncedQuery}&rdquo;</p>
                      <p className="mt-1 text-sm text-ink-500">Try a shorter term, or browse a category below.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-5 space-y-6">
                  <div>
                    <p className="text-xs font-medium text-ink-400 mb-2">Popular with buyers</p>
                    <div className="flex flex-wrap gap-2">
                      {SUGGESTED_SEARCHES.map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => setQuery(term)}
                          className="px-3 h-8 text-sm border border-ink-200 rounded-sm text-ink-700 hover:border-ink-300 hover:bg-ink-50"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-ink-400 mb-2">Browse categories</p>
                    <div className="grid grid-cols-2 gap-0.5">
                      {tree.slice(0, 10).map((cat) => {
                        const Icon = categoryIcon(cat.slug);
                        return (
                          <Link
                            key={cat.id}
                            href={`/products?category=${cat.slug}`}
                            onClick={onClose}
                            className="flex items-center gap-2.5 px-2.5 py-2 text-sm text-ink-700 hover:bg-ink-50 rounded-md"
                          >
                            <Icon size={16} aria-hidden className="text-ink-400" />
                            <span className="truncate">{cat.name}</span>
                          </Link>
                        );
                      })}
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
