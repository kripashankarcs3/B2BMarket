'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Package, ShoppingCart, Heart, MessageCircle, Settings, CreditCard, Clock, TrendingUp, Users, DollarSign } from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/auth-context';
import { useWishlist } from '@/hooks/useWishlist';
import { formatPrice, formatDate } from '@/lib/utils';
import { ORDER_STATUS_STYLES } from '@/lib/constants';

const quickActions = [
  { label: 'Browse Products', href: '/products', icon: ShoppingCart, color: 'text-apple-blue' },
  { label: 'View Cart', href: '/cart', icon: ShoppingCart, color: 'text-emerald-500' },
  { label: 'Wishlist', href: '/wishlist', icon: Heart, color: 'text-red-400' },
  { label: 'Messages', href: '/dashboard/messages', icon: MessageCircle, color: 'text-purple-400' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: orders = [] } = useOrders();
  const { items: wishlistItems } = useWishlist();
  const activeOrders = orders.filter((o) => !['delivered', 'cancelled'].includes(o.status));

  return (
    <div className="pt-24 sm:pt-28 pb-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-apple-gray-900">Dashboard</h1>
          <p className="text-sm text-apple-gray-400 mt-1">
            Welcome back, {user?.name || 'Guest'}! Here&apos;s your overview.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[10px] bg-apple-blue/10 flex items-center justify-center">
                <ShoppingCart size={18} className="text-apple-blue" />
              </div>
              <div>
                <p className="text-2xl font-bold text-apple-gray-900">{activeOrders.length}</p>
                <p className="text-xs text-apple-gray-400">Active Orders</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[10px] bg-emerald-50 flex items-center justify-center">
                <DollarSign size={18} className="text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-apple-gray-900">{formatPrice(orders.reduce((sum, o) => sum + o.total, 0))}</p>
                <p className="text-xs text-apple-gray-400">Total Spent</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[10px] bg-red-50 flex items-center justify-center">
                <Heart size={18} className="text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-apple-gray-900">{wishlistItems.length}</p>
                <p className="text-xs text-apple-gray-400">Wishlist</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[10px] bg-purple-50 flex items-center justify-center">
                <MessageCircle size={18} className="text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-apple-gray-900">0</p>
                <p className="text-xs text-apple-gray-400">Messages</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-apple-gray-900">Recent Orders</h3>
                {orders.length > 5 && (
                  <Link href="/dashboard/orders" className="text-xs font-medium text-apple-blue hover:text-apple-blue-dark">
                    View All
                  </Link>
                )}
              </div>
              <div className="space-y-3">
                {orders.slice(0, 5).map((order) => {
                  const statusStyle = ORDER_STATUS_STYLES[order.status] || ORDER_STATUS_STYLES.pending;
                  return (
                    <div key={order.id} className="flex items-center justify-between py-3 border-b border-apple-gray-50 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-[8px] bg-apple-gray-50 flex items-center justify-center">
                          <Package size={16} className="text-apple-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-apple-gray-900">#{order.id.slice(0, 8)}</p>
                          <p className="text-xs text-apple-gray-400">{order.supplierName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-apple-gray-400">{formatDate(order.createdAt)}</span>
                        <Badge variant={statusStyle.variant as any} size="sm">{statusStyle.label}</Badge>
                        <span className="text-sm font-semibold text-apple-gray-900">{formatPrice(order.total)}</span>
                      </div>
                    </div>
                  );
                })}
                {orders.length === 0 && (
                  <p className="text-sm text-apple-gray-400 text-center py-8">No orders yet</p>
                )}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <h3 className="text-base font-semibold text-apple-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {quickActions.map((action) => (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="flex items-center gap-3 p-3 rounded-[10px] hover:bg-apple-gray-50 apple-transition group"
                  >
                    <div className="w-9 h-9 rounded-[8px] bg-apple-gray-50 flex items-center justify-center group-hover:bg-white apple-transition">
                      <action.icon size={16} className={action.color} />
                    </div>
                    <span className="text-sm font-medium text-apple-gray-700">{action.label}</span>
                  </Link>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
