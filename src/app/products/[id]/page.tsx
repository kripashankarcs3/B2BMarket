'use client';

import { use } from 'react';
import { motion } from 'framer-motion';
import { Shield, MapPin, Clock, Star, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { ProductGallery, ProductInfo, ProductSpecs, ProductReviews, RelatedProducts } from '@/components/products';
import { Badge, Button } from '@/components/ui';
import { useProduct } from '@/hooks/useProducts';

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params);
  const { data: product, isLoading, isError, error } = useProduct(id);

  if (isLoading) {
    return (
      <div className="pt-28 pb-16 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-28 pb-16 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
      </div>
    );
  }

  const supplier = product.supplier;

  return (
    <div className="pt-24 sm:pt-28 pb-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <nav className="flex items-center gap-2 text-sm text-ink-400 mb-6">
            <Link href="/" className="hover:text-brand-600">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-brand-600">Products</Link>
            <span>/</span>
            <Link href={`/products?category=${product.category.slug}`} className="hover:text-brand-600">{product.category.name}</Link>
            <span className="text-ink-300">/</span>
            <span className="text-ink-600 truncate">{product.name}</span>
          </nav>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ProductGallery images={product.images} productName={product.name} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <ProductInfo product={product} />
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-base font-semibold text-ink-900 mb-3">Description</h3>
              <p className="text-sm text-ink-500 leading-relaxed">{product.description}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <ProductSpecs specifications={product.specifications} certifications={product.certifications} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <ProductReviews productId={product.id} rating={product.rating} reviewCount={product.reviewCount} />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="sticky top-24 space-y-4">
              <div className="p-6 bg-white border border-ink-100 rounded-[20px] elev-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-[14px] overflow-hidden bg-ink-50 border border-ink-100">
                    <img src={supplier.logo} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <Link href={`/suppliers/${supplier.id}`} className="text-sm font-semibold text-ink-900 hover:text-brand-600 transition-smooth">
                      {supplier.name}
                    </Link>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex items-center gap-0.5">
                        <Star size={12} className="fill-amber-400 text-amber-400" />
                        <span className="text-xs font-medium text-ink-600">{supplier.rating}</span>
                      </div>
                      <span className="text-xs text-ink-400">({supplier.reviewCount})</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2.5 text-sm text-ink-500">
                    <MapPin size={15} className="shrink-0 text-ink-400" />
                    {supplier.location}
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-ink-500">
                    <Clock size={15} className="shrink-0 text-ink-400" />
                    Response: {supplier.responseTime}
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-ink-500">
                    <Shield size={15} className="shrink-0 text-emerald-500" />
                    {supplier.verified ? 'Verified Supplier' : 'Unverified'}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {supplier.certifications.slice(0, 4).map((cert) => (
                    <Badge key={cert} variant="info" size="sm">{cert}</Badge>
                  ))}
                </div>

                <div className="flex flex-col gap-2">
                  <Button fullWidth icon={<MessageCircle size={16} />}>
                    Contact Supplier
                  </Button>
                  <Button fullWidth variant="secondary">
                    Visit Store
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <RelatedProducts currentProductId={product.id} categoryId={product.categoryId} />
        </motion.div>
      </div>
    </div>
  );
}
