'use client';

import { motion } from 'framer-motion';
import { Search, Shield, Truck, HeadphonesIcon } from 'lucide-react';
import Link from 'next/link';

const stats = [
  { value: '12M+', label: 'Products' },
  { value: '200K+', label: 'Suppliers' },
  { value: '190+', label: 'Countries' },
  { value: '98%', label: 'Satisfaction' },
];

const features = [
  { icon: Shield, label: 'Verified Suppliers', desc: 'Trade assurance protection' },
  { icon: Truck, label: 'Global Shipping', desc: 'Door-to-door delivery' },
  { icon: HeadphonesIcon, label: '24/7 Support', desc: 'Multi-language support' },
];

export function Hero() {
  return (
    <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center bg-gradient-to-b from-apple-gray-50 to-white overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-apple-blue/5 to-transparent blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-emerald-400/5 to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24 sm:pt-28 pb-16 sm:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-apple-blue-light rounded-full text-xs font-medium text-apple-blue mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-apple-blue animate-pulse" />
              Trusted by 200,000+ businesses worldwide
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-apple-gray-900 leading-[1.1] mb-6 text-balance">
              Source Premium
              <span className="block text-apple-blue mt-2">B2B Products</span>
              with Confidence
            </h1>

            <p className="text-lg sm:text-xl text-apple-gray-400 leading-relaxed mb-8 max-w-lg text-balance">
              Connect with verified suppliers worldwide. Access millions of products with AI-powered search, trade assurance, and seamless logistics.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-apple-blue text-white rounded-[16px] font-medium text-base hover:bg-apple-blue-dark apple-transition ios-shadow"
              >
                <Search size={20} />
                Explore Products
              </Link>
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center px-8 py-4 bg-white border border-apple-gray-200 text-apple-gray-900 rounded-[16px] font-medium text-base hover:bg-apple-gray-50 apple-transition"
              >
                Start Selling
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-6 sm:gap-8">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                  className="text-center sm:text-left"
                >
                  <p className="text-2xl sm:text-3xl font-bold text-apple-gray-900">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-apple-gray-400">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <div className="relative aspect-[4/3] rounded-[24px] overflow-hidden ios-shadow-xl bg-gradient-to-br from-apple-gray-50 to-white border border-apple-gray-100">
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80"
                alt="B2B Marketplace"
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-3 mb-4">
                  {features.map((feat, i) => {
                    const Icon = feat.icon;
                    return (
                      <div key={i} className="flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur-md rounded-[12px] shadow-sm">
                        <Icon size={16} className="text-apple-blue" />
                        <span className="text-xs font-medium text-apple-gray-700">{feat.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-[20px] bg-white ios-shadow-lg flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-500">98%</p>
                <p className="text-[10px] text-apple-gray-400">On-time</p>
              </div>
            </div>
            <div className="absolute -top-6 -right-6 w-28 h-28 rounded-[20px] bg-white ios-shadow-lg flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-bold text-apple-blue">24/7</p>
                <p className="text-[10px] text-apple-gray-400">Support</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
