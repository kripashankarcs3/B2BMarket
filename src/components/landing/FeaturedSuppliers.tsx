'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Shield, Star, MapPin, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui';
import { suppliers } from '@/lib/data';

export function FeaturedSuppliers() {
  const featured = suppliers.filter((s) => s.premium);

  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs font-semibold text-apple-blue uppercase tracking-[0.2em] mb-3"
            >
              Trusted Suppliers
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl font-bold text-apple-gray-900"
            >
              Verified Premium Suppliers
            </motion.h2>
          </div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5"
        >
          {featured.map((supplier) => (
            <motion.div
              key={supplier.id}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
            >
              <Link
                href={`/suppliers/${supplier.id}`}
                className="group block bg-white border border-apple-gray-100 rounded-[20px] ios-shadow-sm hover-lift overflow-hidden"
              >
                <div className="h-32 sm:h-40 relative overflow-hidden">
                  <img src={supplier.coverImage} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    {supplier.verified && <Badge variant="success" size="sm"><Shield size={10} /> Verified</Badge>}
                    {supplier.premium && <Badge variant="premium" size="sm">Premium</Badge>}
                  </div>
                </div>
                <div className="p-5 sm:p-6 -mt-10 relative">
                  <div className="flex items-end gap-4 mb-4">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[14px] border-2 border-white ios-shadow overflow-hidden bg-white shrink-0">
                      <img src={supplier.logo} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 pt-8">
                      <h3 className="text-base sm:text-lg font-semibold text-apple-gray-900 truncate">{supplier.name}</h3>
                      <div className="flex items-center gap-3 text-xs text-apple-gray-400 mt-0.5">
                        <span className="flex items-center gap-1"><MapPin size={12} /> {supplier.location}</span>
                        <span className="flex items-center gap-1"><Star size={12} className="text-amber-400" /> {supplier.rating}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-apple-gray-400 line-clamp-2 mb-4">{supplier.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-apple-gray-400">
                      <span><strong className="text-apple-gray-700">{supplier.productCount.toLocaleString()}</strong> Products</span>
                      <span><strong className="text-apple-gray-700">{supplier.yearEstablished}</strong> Est.</span>
                      <span className="hidden sm:inline"><strong className="text-apple-gray-700">{supplier.responseTime}</strong> Response</span>
                    </div>
                    <ArrowRight size={16} className="text-apple-gray-300 group-hover:text-apple-blue group-hover:translate-x-0.5 apple-transition shrink-0" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
