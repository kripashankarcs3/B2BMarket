'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BarChart3, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui';
import { CompareTable } from '@/components/products';
import { useCompare } from '@/hooks/useCompare';

export default function ComparePage() {
  const { items, removeItem } = useCompare();

  if (items.length === 0) {
    return (
      <div className="pt-28 pb-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-16 h-16 rounded-full bg-ink-50 flex items-center justify-center mx-auto mb-4">
              <BarChart3 size={28} className="text-ink-300" />
            </div>
            <h2 className="text-xl font-semibold text-ink-900 mb-2">Nothing to compare</h2>
            <p className="text-sm text-ink-400 mb-6">Add products to compare their specifications side by side.</p>
            <Link href="/products">
              <Button>Browse Products</Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 sm:pt-28 pb-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-ink-900">Compare Products</h1>
          <p className="text-sm text-ink-400 mt-1">{items.length} products selected</p>
        </motion.div>

        <CompareTable products={items} onRemove={removeItem} />
      </div>
    </div>
  );
}
