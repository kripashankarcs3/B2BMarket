'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, Minus, Plus, Trash2, ArrowRight, Shield, Truck, RotateCcw } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice } = useCart();

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [items]);

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
              <ShoppingCart size={28} className="text-ink-300" />
            </div>
            <h2 className="text-xl font-semibold text-ink-900 mb-2">Your cart is empty</h2>
            <p className="text-sm text-ink-400 mb-6">Looks like you haven&apos;t added any products yet.</p>
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
          <h1 className="text-3xl sm:text-4xl font-bold text-ink-900">Shopping Cart</h1>
          <p className="text-sm text-ink-400 mt-1">{totalItems} items in your cart</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-3">
            {items.map((item, index) => (
              <motion.div
                key={item.product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white border border-ink-100 rounded-[16px] p-4 sm:p-5 elev-sm"
              >
                <div className="flex gap-4">
                  <Link href={`/products/${item.product.id}`} className="shrink-0">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[12px] overflow-hidden bg-ink-50 border border-ink-100">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="min-w-0">
                        <p className="text-xs text-brand-600 font-medium mb-0.5">{item.product.category.name}</p>
                        <Link href={`/products/${item.product.id}`} className="text-sm font-semibold text-ink-900 hover:text-brand-600 transition-smooth line-clamp-1">
                          {item.product.name}
                        </Link>
                        <p className="text-xs text-ink-400 mt-0.5">{item.product.supplier.name}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="p-1.5 rounded-[8px] hover:bg-red-50 text-ink-300 hover:text-red-400 transition-smooth shrink-0"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-[8px] border border-ink-200 flex items-center justify-center hover:bg-ink-50 transition-smooth text-ink-600"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-10 text-center text-sm font-medium text-ink-900 tabular-nums">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-[8px] border border-ink-200 flex items-center justify-center hover:bg-ink-50 transition-smooth text-ink-600"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-semibold text-ink-900">{formatPrice(item.product.price * item.quantity)}</p>
                        <p className="text-xs text-ink-400">{formatPrice(item.product.price)} each</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <Card>
                <h3 className="text-base font-semibold text-ink-900 mb-4">Order Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-ink-500">
                    <span>Subtotal</span>
                    <span className="font-medium text-ink-900">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-ink-500">
                    <span>Shipping</span>
                    <span className="font-medium text-emerald-600">Free</span>
                  </div>
                  <div className="flex justify-between text-ink-500">
                    <span>Estimated Tax</span>
                    <span className="font-medium text-ink-900">TBD</span>
                  </div>
                  <div className="border-t border-ink-100 pt-3 flex justify-between">
                    <span className="font-semibold text-ink-900">Total</span>
                    <span className="font-semibold text-ink-900">{formatPrice(subtotal)}</span>
                  </div>
                </div>
                <Button fullWidth size="lg" className="mt-6">
                  Proceed to Checkout
                  <ArrowRight size={18} />
                </Button>
              </Card>

              <Card>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Shield size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-ink-900">Trade Assurance</p>
                      <p className="text-xs text-ink-400">Protected from payment to delivery</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Truck size={16} className="text-brand-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-ink-900">Free shipping</p>
                      <p className="text-xs text-ink-400">On orders over ₹5,00,000</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <RotateCcw size={16} className="text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-ink-900">30-day returns</p>
                      <p className="text-xs text-ink-400">Not satisfied? Return within 30 days</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
