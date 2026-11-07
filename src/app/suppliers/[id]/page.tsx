'use client';

import { use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, MapPin, Clock, Star, Mail, Phone, Globe, Check, Building2, Users, Calendar, MessageCircle } from 'lucide-react';
import { Badge, Button, Card } from '@/components/ui';
import { ProductCard } from '@/components/products';
import { useSupplier } from '@/hooks/useSuppliers';
import { useProducts } from '@/hooks/useProducts';

export default function SupplierDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params);
  const { data: supplier, isLoading } = useSupplier(id);
  const { data: productsData } = useProducts({ supplierId: id });
  const products = productsData?.products ?? [];

  if (isLoading) {
    return (
      <div className="pt-28 pb-16 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="pt-28 pb-16 text-center">
        <h1 className="text-2xl font-bold">Supplier not found</h1>
      </div>
    );
  }

  return (
    <div className="pt-24 sm:pt-28 pb-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.nav
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-ink-400 mb-6"
        >
          <Link href="/" className="hover:text-brand-600">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-brand-600">Suppliers</Link>
          <span className="text-ink-300">/</span>
          <span className="text-ink-600 truncate">{supplier.name}</span>
        </motion.nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative h-48 sm:h-64 rounded-[24px] overflow-hidden mb-8 bg-gradient-to-br from-brand-600/10 to-emerald-400/10 border border-ink-100"
        >
          {supplier.coverImage && (
            <img src={supplier.coverImage} alt="" className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-start gap-5"
            >
              <div className="w-20 h-20 rounded-[16px] overflow-hidden bg-white border border-ink-100 elev-sm shrink-0 -mt-12 relative z-10">
                <img src={supplier.logo} alt={supplier.name} className="w-full h-full object-cover" />
              </div>
              <div className="pt-1">
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-ink-900">{supplier.name}</h1>
                  {supplier.verified && (
                    <Badge variant="success" size="sm">
                      <Check size={12} className="mr-0.5" /> Verified
                    </Badge>
                  )}
                  {supplier.premium && (
                    <Badge variant="info" size="sm">Premium</Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-ink-500">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-ink-400" />
                    {supplier.location}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star size={14} className="fill-amber-400 text-amber-400" />
                    <span className="font-medium text-ink-700">{supplier.rating}</span>
                    <span>({supplier.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm text-ink-500 leading-relaxed"
            >
              {supplier.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <h3 className="text-base font-semibold text-ink-900 mb-4">Company Information</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 bg-ink-50 rounded-[12px]">
                    <Calendar size={16} className="text-ink-400 mb-2" />
                    <p className="text-xs text-ink-400">Year Established</p>
                    <p className="text-sm font-semibold text-ink-900 mt-0.5">{supplier.yearEstablished}</p>
                  </div>
                  <div className="p-4 bg-ink-50 rounded-[12px]">
                    <Users size={16} className="text-ink-400 mb-2" />
                    <p className="text-xs text-ink-400">Employees</p>
                    <p className="text-sm font-semibold text-ink-900 mt-0.5">{supplier.employees}</p>
                  </div>
                  <div className="p-4 bg-ink-50 rounded-[12px]">
                    <Building2 size={16} className="text-ink-400 mb-2" />
                    <p className="text-xs text-ink-400">Products</p>
                    <p className="text-sm font-semibold text-ink-900 mt-0.5">{supplier.productCount}</p>
                  </div>
                  <div className="p-4 bg-ink-50 rounded-[12px]">
                    <Clock size={16} className="text-ink-400 mb-2" />
                    <p className="text-xs text-ink-400">Response Time</p>
                    <p className="text-sm font-semibold text-ink-900 mt-0.5">{supplier.responseTime}</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {supplier.certifications.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <h3 className="text-base font-semibold text-ink-900 mb-3">Certifications</h3>
                  <div className="flex flex-wrap gap-2">
                    {supplier.certifications.map((cert: string) => (
                      <Badge key={cert} variant="info">{cert}</Badge>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-xl font-bold text-ink-900 mb-4">Products ({products.length})</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} variant="horizontal" />
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24 space-y-4">
              <Card>
                <h3 className="text-base font-semibold text-ink-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <a href={`mailto:${supplier.contactEmail}`} className="flex items-center gap-3 text-sm text-ink-500 hover:text-brand-600 transition-smooth">
                    <Mail size={15} className="shrink-0 text-ink-400" />
                    {supplier.contactEmail}
                  </a>
                  <a href={`tel:${supplier.contactPhone}`} className="flex items-center gap-3 text-sm text-ink-500 hover:text-brand-600 transition-smooth">
                    <Phone size={15} className="shrink-0 text-ink-400" />
                    {supplier.contactPhone}
                  </a>
                  <a href={supplier.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-ink-500 hover:text-brand-600 transition-smooth">
                    <Globe size={15} className="shrink-0 text-ink-400" />
                    {new URL(supplier.website).hostname}
                  </a>
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  <Button fullWidth icon={<MessageCircle size={16} />}>Send Inquiry</Button>
                  <Button fullWidth variant="secondary" icon={<Mail size={16} />}>Send Email</Button>
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
