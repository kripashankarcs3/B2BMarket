'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, ChevronDown, Star, Search } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { cn } from '@/lib/utils';
import { categories } from '@/lib/data';
import type { FilterState } from '@/types';

interface ProductFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  totalResults: number;
}

const sortOptions = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest First' },
];

export function ProductFilters({ filters, onChange, totalResults }: ProductFiltersProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['category', 'price', 'rating']);

  const toggleSection = (name: string) => {
    setExpandedSections((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
  };

  const updateFilter = (key: keyof FilterState, value: unknown) => {
    onChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onChange({
      categories: [],
      priceRange: [0, 1000000],
      suppliers: [],
      certifications: [],
      minRating: 0,
      sortBy: 'recommended',
      search: '',
    });
  };

  const hasActiveFilters = filters.categories.length > 0 || filters.minRating > 0 || filters.priceRange[0] > 0 || filters.priceRange[1] < 1000000;

  const filterContent = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-apple-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="text-xs text-apple-blue hover:text-apple-blue-dark">
            Clear all
          </button>
        )}
      </div>

      <div>
        <Input
          placeholder="Search in results..."
          icon={<Search size={16} />}
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <button
          onClick={() => toggleSection('category')}
          className="flex items-center justify-between w-full py-2 text-sm font-medium text-apple-gray-900"
        >
          Category
          <ChevronDown size={16} className={cn('apple-transition', expandedSections.includes('category') && 'rotate-180')} />
        </button>
        <AnimatePresence>
          {expandedSections.includes('category') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden space-y-1"
            >
              {categories.map((cat) => (
                <label
                  key={cat.id}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-[10px] cursor-pointer apple-transition',
                    filters.categories.includes(cat.id) ? 'bg-apple-blue-light text-apple-blue' : 'hover:bg-apple-gray-50 text-apple-gray-600'
                  )}
                >
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(cat.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        updateFilter('categories', [...filters.categories, cat.id]);
                      } else {
                        updateFilter('categories', filters.categories.filter((c) => c !== cat.id));
                      }
                    }}
                    className="sr-only"
                  />
                  <div className={cn(
                    'w-4 h-4 rounded-md border-2 flex items-center justify-center apple-transition',
                    filters.categories.includes(cat.id) ? 'border-apple-blue bg-apple-blue' : 'border-apple-gray-200'
                  )}>
                    {filters.categories.includes(cat.id) && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm">{cat.name}</span>
                  <span className="ml-auto text-xs text-apple-gray-400">{cat.productCount.toLocaleString()}</span>
                </label>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="border-t border-apple-gray-100" />

      <div className="space-y-1">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full py-2 text-sm font-medium text-apple-gray-900"
        >
          Price Range
          <ChevronDown size={16} className={cn('apple-transition', expandedSections.includes('price') && 'rotate-180')} />
        </button>
        <AnimatePresence>
          {expandedSections.includes('price') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.priceRange[0] || ''}
                  onChange={(e) => updateFilter('priceRange', [Number(e.target.value) || 0, filters.priceRange[1]])}
                  wrapperClassName="flex-1"
                />
                <span className="text-apple-gray-300 text-sm">-</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.priceRange[1] === 1000000 ? '' : filters.priceRange[1]}
                  onChange={(e) => updateFilter('priceRange', [filters.priceRange[0], Number(e.target.value) || 1000000])}
                  wrapperClassName="flex-1"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="border-t border-apple-gray-100" />

      <div className="space-y-1">
        <button
          onClick={() => toggleSection('rating')}
          className="flex items-center justify-between w-full py-2 text-sm font-medium text-apple-gray-900"
        >
          Minimum Rating
          <ChevronDown size={16} className={cn('apple-transition', expandedSections.includes('rating') && 'rotate-180')} />
        </button>
        <AnimatePresence>
          {expandedSections.includes('rating') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden space-y-1"
            >
              {[4, 3, 2, 1].map((star) => (
                <button
                  key={star}
                  onClick={() => updateFilter('minRating', filters.minRating === star ? 0 : star)}
                  className={cn(
                    'flex items-center gap-2 w-full px-3 py-2 rounded-[10px] text-sm apple-transition',
                    filters.minRating === star ? 'bg-apple-blue-light text-apple-blue' : 'hover:bg-apple-gray-50 text-apple-gray-600'
                  )}
                >
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: star }).map((_, i) => (
                      <Star key={i} size={14} className={cn(filters.minRating === star ? 'fill-apple-blue text-apple-blue' : 'fill-apple-gray-200 text-apple-gray-200')} />
                    ))}
                  </div>
                  <span className="text-apple-gray-400">& up</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden lg:block w-[280px] shrink-0">
        <div className="sticky top-24">
          {filterContent}
        </div>
      </div>

      <div className="lg:hidden flex items-center gap-3 mb-4">
        <Button variant="secondary" size="sm" onClick={() => setIsMobileOpen(true)} icon={<SlidersHorizontal size={16} />}>
          Filters {hasActiveFilters && `(${filters.categories.length + (filters.minRating > 0 ? 1 : 0)})`}
        </Button>
        <div className="text-sm text-apple-gray-400">{totalResults} results</div>
        <div className="ml-auto">
          <select
            value={filters.sortBy}
            onChange={(e) => updateFilter('sortBy', e.target.value)}
            className="text-sm border border-apple-gray-200 rounded-[10px] px-3 py-1.5 bg-white text-apple-gray-700 focus:outline-none focus:ring-2 focus:ring-apple-blue/20"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white"
            >
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-apple-gray-100">
                <h2 className="text-base font-semibold">Filters</h2>
                <button onClick={() => setIsMobileOpen(false)} className="p-1.5 rounded-full hover:bg-apple-gray-50">
                  <X size={20} className="text-apple-gray-400" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto h-[calc(100%-64px)]">
                {filterContent}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
