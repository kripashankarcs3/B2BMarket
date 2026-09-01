'use client';

import { motion } from 'framer-motion';
import { ProductCard } from './ProductCard';
import { products } from '@/lib/data';
import type { Product } from '@/types';

interface RelatedProductsProps {
  currentProductId: string;
  categoryId: string;
}

export function RelatedProducts({ currentProductId, categoryId }: RelatedProductsProps) {
  const related = products
    .filter((p) => p.categoryId === categoryId && p.id !== currentProductId)
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <div>
      <h3 className="text-xl font-bold text-apple-gray-900 mb-6">Related Products</h3>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
      >
        {related.map((product) => (
          <motion.div
            key={product.id}
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
