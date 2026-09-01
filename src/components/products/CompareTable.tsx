'use client';

import { X, Star, Check, Minus } from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

interface CompareTableProps {
  products: Product[];
  onRemove: (productId: string) => void;
}

export function CompareTable({ products, onRemove }: CompareTableProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-[16px] bg-apple-gray-50 flex items-center justify-center mb-4">
          <X size={24} className="text-apple-gray-300" />
        </div>
        <p className="text-base font-medium text-apple-gray-900 mb-1">No products to compare</p>
        <p className="text-sm text-apple-gray-400">Add products from the product page to compare them side by side</p>
      </div>
    );
  }

  const allSpecs = Array.from(new Set(products.flatMap((p) => p.specifications.map((s) => s.label))));

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${products.length}, 1fr)` }}>
          <div className="sticky left-0 bg-white z-10" />

          {products.map((product) => (
            <div key={product.id} className="text-center relative">
              <button
                onClick={() => onRemove(product.id)}
                className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white border border-apple-gray-200 flex items-center justify-center hover:bg-apple-gray-50 apple-transition z-10"
              >
                <X size={14} className="text-apple-gray-400" />
              </button>
              <div className="aspect-square rounded-[16px] bg-apple-gray-50 overflow-hidden mb-4">
                <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
              </div>
              <h4 className="text-sm font-medium text-apple-gray-900 mb-2 line-clamp-2">{product.name}</h4>
              <p className="text-lg font-bold text-apple-gray-900 mb-2">{formatPrice(product.price)}</p>
              <div className="flex items-center justify-center gap-1 mb-3">
                <Star size={12} className="fill-amber-400 text-amber-400" />
                <span className="text-xs text-apple-gray-500">{product.rating}</span>
              </div>
              <Badge variant={product.inStock ? 'success' : 'danger'} size="sm">
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </Badge>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h4 className="text-sm font-semibold text-apple-gray-900 mb-4">Specifications</h4>
          <div className="space-y-1">
            {allSpecs.map((specLabel) => (
              <div
                key={specLabel}
                className="grid gap-4 py-3 px-4 rounded-[12px] even:bg-apple-gray-50"
                style={{ gridTemplateColumns: `200px repeat(${products.length}, 1fr)` }}
              >
                <span className="text-sm text-apple-gray-500 sticky left-0 bg-inherit">{specLabel}</span>
                {products.map((product) => {
                  const spec = product.specifications.find((s) => s.label === specLabel);
                  return (
                    <span key={product.id} className="text-sm font-medium text-apple-gray-900 text-center">
                      {spec?.value || <Minus size={14} className="text-apple-gray-300 mx-auto" />}
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h4 className="text-sm font-semibold text-apple-gray-900 mb-4">Certifications</h4>
          <div className="space-y-1">
            {Array.from(new Set(products.flatMap((p) => p.certifications))).map((cert) => (
              <div
                key={cert}
                className="grid gap-4 py-3 px-4 rounded-[12px] even:bg-apple-gray-50"
                style={{ gridTemplateColumns: `200px repeat(${products.length}, 1fr)` }}
              >
                <span className="text-sm text-apple-gray-500 sticky left-0 bg-inherit">{cert}</span>
                {products.map((product) => (
                  <span key={product.id} className="text-center">
                    {product.certifications.includes(cert) ? (
                      <Check size={16} className="text-emerald-500 mx-auto" />
                    ) : (
                      <Minus size={14} className="text-apple-gray-300 mx-auto" />
                    )}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
