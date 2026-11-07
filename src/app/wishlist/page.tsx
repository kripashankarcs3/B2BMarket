'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui';
import { ProductCard } from '@/components/products';
import { useWishlist } from '@/hooks/useWishlist';

export default function WishlistPage() {
  const { items, removeItem } = useWishlist();

  if (items.length === 0) {
    return (
      <div className="pt-28 pb-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <Heart size={28} className="text-red-300" />
            </div>
            <h2 className="text-xl font-semibold text-ink-900 mb-2">Your wishlist is empty</h2>
            <p className="text-sm text-ink-400 mb-6">Save your favorite products for later.</p>
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
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-ink-900">My Wishlist</h1>
            <p className="text-sm text-ink-400 mt-1">{items.length} saved items</p>
          </div>
          {items.length > 0 && (
            <Button variant="ghost" size="sm">
              Clear All
            </Button>
          )}
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative group"
            >
              <button
                onClick={() => removeItem(product.id)}
                className="absolute top-3 right-3 z-10 p-2 rounded-[8px] bg-white/80 backdrop-blur-sm border border-ink-100 opacity-0 group-hover:opacity-100 transition-smooth hover:bg-red-50 hover:text-red-400 text-ink-400"
              >
                <Trash2 size={14} />
              </button>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
