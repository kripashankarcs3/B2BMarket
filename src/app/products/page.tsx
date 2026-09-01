'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Grid3X3, List } from 'lucide-react';
import { ProductGrid, ProductFilters } from '@/components/products';
import { Button } from '@/components/ui';
import { useProducts } from '@/hooks/useProducts';
import { cn } from '@/lib/utils';
import type { FilterState } from '@/types';

const sortOptions = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest First' },
];

export default function ProductsPage() {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [0, 1000000],
    suppliers: [],
    certifications: [],
    minRating: 0,
    sortBy: 'recommended',
    search: '',
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data, isLoading } = useProducts({
    search: filters.search || undefined,
    category: filters.categories[0],
    minPrice: filters.priceRange[0] > 0 ? filters.priceRange[0] : undefined,
    maxPrice: filters.priceRange[1] < 1000000 ? filters.priceRange[1] : undefined,
    minRating: filters.minRating > 0 ? filters.minRating : undefined,
    sortBy: filters.sortBy !== 'recommended' ? filters.sortBy : undefined,
  });
  const products = data?.products ?? [];

  return (
    <div className="pt-24 sm:pt-28 pb-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <p className="text-xs font-semibold text-apple-blue uppercase tracking-[0.2em] mb-2">Products</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-apple-gray-900">Browse Products</h1>
          <p className="text-sm text-apple-gray-400 mt-1">
            {isLoading ? 'Loading...' : `${products.length} products found across global suppliers`}
          </p>
        </motion.div>

        <div className="flex gap-6 lg:gap-8">
          <ProductFilters
            filters={filters}
            onChange={setFilters}
            totalResults={products.length}
          />

          <div className="flex-1 min-w-0">
            <div className="hidden lg:flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 border border-apple-gray-200 rounded-[10px] p-0.5">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn('p-1.5 rounded-[8px] apple-transition', viewMode === 'grid' ? 'bg-apple-gray-100 text-apple-gray-900' : 'text-apple-gray-400 hover:text-apple-gray-600')}
                  >
                    <Grid3X3 size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn('p-1.5 rounded-[8px] apple-transition', viewMode === 'list' ? 'bg-apple-gray-100 text-apple-gray-900' : 'text-apple-gray-400 hover:text-apple-gray-600')}
                  >
                    <List size={16} />
                  </button>
                </div>
                <span className="text-sm text-apple-gray-400">{products.length} results</span>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-sm text-apple-gray-500">Sort by:</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as FilterState['sortBy'] })}
                  className="text-sm border border-apple-gray-200 rounded-[10px] px-3 py-1.5 bg-white text-apple-gray-700 focus:outline-none focus:ring-2 focus:ring-apple-blue/20 appearance-none cursor-pointer"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-6 h-6 border-2 border-apple-blue border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <ProductGrid products={products} variant={viewMode === 'list' ? 'compact' : 'default'} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
