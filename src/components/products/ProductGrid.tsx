'use client';

import { motion } from 'framer-motion';
import { ProductCard } from './ProductCard';
import type { Product } from '@/types';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  variant?: 'default' | 'compact';
}

export function ProductGrid({ products, loading, variant = 'default' }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-[16px] border border-apple-gray-100 overflow-hidden animate-pulse">
            <div className="aspect-square bg-apple-gray-50" />
            <div className="p-4 space-y-3">
              <div className="h-3 bg-apple-gray-50 rounded-full w-1/3" />
              <div className="h-4 bg-apple-gray-50 rounded-full w-2/3" />
              <div className="h-3 bg-apple-gray-50 rounded-full w-1/2" />
              <div className="flex justify-between">
                <div className="h-5 bg-apple-gray-50 rounded-full w-1/4" />
                <div className="h-5 bg-apple-gray-50 rounded-full w-1/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-[16px] bg-apple-gray-50 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-apple-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <p className="text-base font-medium text-apple-gray-900 mb-1">No products found</p>
        <p className="text-sm text-apple-gray-400">Try adjusting your filters or search terms</p>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
    >
      {products.map((product) => (
        <motion.div
          key={product.id}
          variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
          layout
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}
