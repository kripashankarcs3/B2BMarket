'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Package, Award, Building2 } from 'lucide-react';

const stats = [
  { icon: Package, value: '12.4M+', label: 'Products Listed' },
  { icon: Building2, value: '200K+', label: 'Active Suppliers' },
  { icon: Award, value: '190+', label: 'Countries Served' },
  { icon: TrendingUp, value: '$45B+', label: 'Annual GMV' },
];

export function StatsSection() {
  return (
    <section className="py-20 sm:py-28 bg-apple-gray-900 text-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-[14px] bg-white/10 flex items-center justify-center mx-auto mb-4">
                  <Icon size={24} className="text-apple-blue" />
                </div>
                <p className="text-3xl sm:text-4xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm text-apple-gray-300">{stat.label}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
