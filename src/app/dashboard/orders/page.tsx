'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Package, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui';
import { useOrders } from '@/hooks/useOrders';
import { formatPrice, formatDate } from '@/lib/utils';
import { ORDER_STATUS_STYLES } from '@/lib/constants';

export default function OrdersPage() {
  const { data: orders = [], isLoading } = useOrders();

  return (
    <div className="pt-24 sm:pt-28 pb-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/dashboard" className="text-sm text-apple-gray-400 hover:text-apple-blue apple-transition inline-flex items-center gap-1 mb-4">
            <ChevronRight size={14} className="rotate-180" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-apple-gray-900">Orders</h1>
          <p className="text-sm text-apple-gray-400 mt-1">{orders.length} total orders</p>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-apple-blue border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <Package size={40} className="mx-auto text-apple-gray-200 mb-4" />
            <h2 className="text-lg font-semibold text-apple-gray-900 mb-2">No orders yet</h2>
            <p className="text-sm text-apple-gray-400">Your orders will appear here once you make a purchase.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order, index) => {
              const statusStyle = ORDER_STATUS_STYLES[order.status] || ORDER_STATUS_STYLES.pending;
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="bg-white border border-apple-gray-100 rounded-[16px] p-5 ios-shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-[10px] bg-apple-gray-50 flex items-center justify-center">
                        <Package size={18} className="text-apple-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-apple-gray-900">#{order.id.slice(0, 8)}</p>
                        <p className="text-xs text-apple-gray-400">{order.supplierName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={statusStyle.variant as any} size="sm">{statusStyle.label}</Badge>
                      <span className="text-sm font-semibold text-apple-gray-900">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-apple-gray-50">
                    <span className="text-xs text-apple-gray-400">{formatDate(order.createdAt)}</span>
                    <span className="text-xs text-apple-gray-400">{order.items.length} items</span>
                    {order.tracking && (
                      <span className="text-xs text-apple-gray-400">Tracking: {order.tracking}</span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
