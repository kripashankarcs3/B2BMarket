'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, Star, Check } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { cn } from '@/lib/utils';
import { buildCategoryTree } from '@/lib/categories';
import { useCategories } from '@/hooks/useCategories';
import { SORT_OPTIONS } from '@/lib/constants';
import type { FilterState } from '@/types';

export const DEFAULT_FILTERS: FilterState = {
  categories: [],
  priceRange: [0, 1000000],
  suppliers: [],
  certifications: [],
  minRating: 0,
  sortBy: 'recommended',
  search: '',
};

interface ProductFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  totalResults: number;
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="py-5 border-t border-ink-100 first:border-t-0 first:pt-0">
      <legend className="sr-only">{title}</legend>
      <p className="text-sm font-semibold text-ink-900 mb-3" aria-hidden>{title}</p>
      {children}
    </fieldset>
  );
}

export function ProductFilters({ filters, onChange, totalResults }: ProductFiltersProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { data: categories = [] } = useCategories();
  const tree = useMemo(() => buildCategoryTree(categories), [categories]);

  const selectedSlug = filters.categories[0];
  const selectedRoot = tree.find((root) => root.slug === selectedSlug || root.children.some((c) => c.slug === selectedSlug));

  const update = (patch: Partial<FilterState>) => onChange({ ...filters, ...patch });
  const selectCategory = (slug?: string) => update({ categories: slug ? [slug] : [] });

  const activeCount =
    (filters.categories.length > 0 ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000000 ? 1 : 0);

  const categoryButton = (slug: string | undefined, label: string, active: boolean, depth = 0) => (
    <button
      type="button"
      onClick={() => selectCategory(slug)}
      aria-pressed={active}
      className={cn(
        'w-full flex items-center gap-2 py-1.5 pr-2 rounded-sm text-sm text-left transition-smooth',
        depth ? 'pl-5' : 'pl-2',
        active ? 'bg-brand-50 text-brand-700 font-medium' : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900'
      )}
    >
      <span className="flex-1 truncate">{label}</span>
      {active && <Check size={14} aria-hidden className="shrink-0" />}
    </button>
  );

  const filterContent = (
    <div>
      <FilterGroup title="Category">
        <div className="space-y-0.5 max-h-[340px] overflow-y-auto -mx-1 px-1">
          {categoryButton(undefined, 'All categories', !selectedSlug)}
          {selectedRoot ? (
            <>
              {categoryButton(selectedRoot.slug, selectedRoot.name, selectedRoot.slug === selectedSlug)}
              {selectedRoot.children.map((child) => (
                <div key={child.id}>{categoryButton(child.slug, child.name, child.slug === selectedSlug, 1)}</div>
              ))}
            </>
          ) : (
            tree.map((root) => <div key={root.id}>{categoryButton(root.slug, root.name, false)}</div>)
          )}
        </div>
      </FilterGroup>

      <FilterGroup title="Price per unit (₹)">
        <div className="flex items-center gap-2">
          <Input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Min"
            aria-label="Minimum price"
            value={filters.priceRange[0] || ''}
            onChange={(e) => update({ priceRange: [Number(e.target.value) || 0, filters.priceRange[1]] })}
            wrapperClassName="flex-1"
          />
          <span className="text-ink-300 text-sm" aria-hidden>–</span>
          <Input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Max"
            aria-label="Maximum price"
            value={filters.priceRange[1] === 1000000 ? '' : filters.priceRange[1]}
            onChange={(e) => update({ priceRange: [filters.priceRange[0], Number(e.target.value) || 1000000] })}
            wrapperClassName="flex-1"
          />
        </div>
      </FilterGroup>

      <FilterGroup title="Product rating">
        <div className="space-y-0.5">
          {[4, 3].map((stars) => {
            const active = filters.minRating === stars;
            return (
              <button
                key={stars}
                type="button"
                aria-pressed={active}
                onClick={() => update({ minRating: active ? 0 : stars })}
                className={cn(
                  'w-full flex items-center gap-2 px-2 py-1.5 rounded-sm text-sm transition-smooth',
                  active ? 'bg-brand-50 text-brand-700 font-medium' : 'text-ink-600 hover:bg-ink-50'
                )}
              >
                <Star size={14} aria-hidden className="fill-accent-500 text-accent-500" />
                {stars}.0 and above
                {active && <Check size={14} aria-hidden className="ml-auto" />}
              </button>
            );
          })}
        </div>
      </FilterGroup>

      {activeCount > 0 && (
        <Button variant="secondary" size="sm" fullWidth onClick={() => onChange({ ...DEFAULT_FILTERS, sortBy: filters.sortBy, search: filters.search })}>
          Clear filters
        </Button>
      )}
    </div>
  );

  return (
    <>
      <aside aria-label="Filters" className="hidden lg:block w-[248px] shrink-0">
        <div className="sticky top-24">{filterContent}</div>
      </aside>

      <div className="lg:hidden flex items-center gap-3 mb-4 w-full">
        <Button variant="secondary" size="sm" onClick={() => setIsMobileOpen(true)} icon={<SlidersHorizontal size={15} aria-hidden />}>
          Filters{activeCount > 0 && ` (${activeCount})`}
        </Button>
        <span className="text-sm text-ink-500 tabular">{totalResults} results</span>
        <select
          value={filters.sortBy}
          aria-label="Sort by"
          onChange={(e) => update({ sortBy: e.target.value as FilterState['sortBy'] })}
          className="ml-auto h-8 text-sm border border-ink-200 rounded-sm px-2 bg-white text-ink-700"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Filters"
          >
            <div className="absolute inset-0 bg-ink-900/40" onClick={() => setIsMobileOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white flex flex-col"
            >
              <div className="flex items-center justify-between px-5 h-16 border-b border-ink-100 shrink-0">
                <h2 className="text-base font-semibold">Filters</h2>
                <button type="button" onClick={() => setIsMobileOpen(false)} aria-label="Close filters" className="p-2 rounded-sm hover:bg-ink-50">
                  <X size={20} aria-hidden className="text-ink-500" />
                </button>
              </div>
              <div className="flex-1 p-5 overflow-y-auto">{filterContent}</div>
              <div className="p-4 border-t border-ink-100 shrink-0">
                <Button fullWidth onClick={() => setIsMobileOpen(false)}>Show {totalResults} results</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
