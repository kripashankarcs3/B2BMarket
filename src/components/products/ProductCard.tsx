'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, Star, Shield, Eye } from 'lucide-react';
import { Badge } from '@/components/ui';
import { cn, formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact' | 'horizontal';
}

export function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (variant === 'horizontal') {
    console.log('🔍 [ProductCard] href product.id:', product.id);
    return (
      <Link
        href={`/products/${product.id}`}
        className="group flex gap-4 p-3 bg-white rounded-[16px] border border-apple-gray-100 ios-shadow-sm hover-lift"
      >
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-[12px] bg-apple-gray-50 overflow-hidden shrink-0">
          <img
            src={imgError ? `https://placehold.co/200x200/e8e8ed/86868b?text=${product.name[0]}` : product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 apple-transition"
            onError={() => setImgError(true)}
          />
        </div>
        <div className="flex-1 min-w-0 py-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-medium text-apple-gray-900 line-clamp-2">{product.name}</h3>
            <button
              onClick={(e) => { e.preventDefault(); setIsWishlisted(!isWishlisted); }}
              className="p-1 rounded-full hover:bg-apple-gray-50 shrink-0"
            >
              <Heart size={14} className={cn('apple-transition', isWishlisted ? 'fill-red-500 text-red-500' : 'text-apple-gray-300')} />
            </button>
          </div>
          <p className="text-xs text-apple-gray-400 mt-0.5">{product.supplier.name}</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-0.5">
              <Star size={11} className="fill-amber-400 text-amber-400" />
              <span className="text-xs text-apple-gray-500">{product.rating}</span>
            </div>
            <span className="text-xs text-apple-gray-400">({product.reviewCount})</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div>
              <p className="text-sm font-semibold text-apple-gray-900">{formatPrice(product.price)}</p>
              <p className="text-[10px] text-apple-gray-400">MOQ: {product.moq} {product.unit}</p>
            </div>
            <div className="flex items-center gap-1">
              {product.supplier.verified && <Shield size={12} className="text-emerald-500" />}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block bg-white rounded-[16px] border border-apple-gray-100 ios-shadow-sm hover-lift overflow-hidden"
      onClick={() => console.log('🔍 [ProductCard Clicked] id:', product.id, 'href:', `/products/${product.id}`)}
    >
      <div className="relative aspect-square bg-apple-gray-50 overflow-hidden">
        <img
          src={imgError ? `https://placehold.co/400x400/e8e8ed/86868b?text=${product.name[0]}` : product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 apple-transition duration-700"
          onError={() => setImgError(true)}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.02] apple-transition" />

        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {product.featured && <Badge variant="info" size="sm">Featured</Badge>}
          {!product.inStock && <Badge variant="danger" size="sm">Out of Stock</Badge>}
        </div>

        <button
          onClick={(e) => { e.preventDefault(); setIsWishlisted(!isWishlisted); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 apple-transition hover:bg-white"
        >
          <Heart size={15} className={cn('apple-transition', isWishlisted ? 'fill-red-500 text-red-500' : 'text-apple-gray-500')} />
        </button>

        <div className="absolute bottom-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 apple-transition translate-y-1 group-hover:translate-y-0">
          <span className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white apple-transition">
            <ShoppingCart size={14} className="text-apple-gray-600" />
          </span>
          <span className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white apple-transition">
            <Eye size={14} className="text-apple-gray-600" />
          </span>
        </div>
      </div>

      <div className="p-4">
        <p className="text-xs text-apple-blue font-medium mb-1">{product.category.name}</p>
        <h3 className="text-sm font-medium text-apple-gray-900 line-clamp-2 mb-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-0.5">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span className="text-xs font-medium text-apple-gray-600">{product.rating}</span>
          </div>
          <span className="text-xs text-apple-gray-400">({product.reviewCount})</span>
          <span className="text-xs text-apple-gray-300">·</span>
          <span className="text-xs text-apple-gray-400">MOQ {product.moq}</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-base font-semibold text-apple-gray-900">{formatPrice(product.price)}</p>
            <p className="text-[10px] text-apple-gray-400">per {product.unit}</p>
          </div>
          <div className="flex items-center gap-1.5">
            {product.supplier.verified && <Shield size={14} className="text-emerald-500" />}
            <div className="flex items-center gap-1.5">
              <img src={product.supplier.logo} alt="" className="w-5 h-5 rounded-full object-cover" />
              <span className="text-xs text-apple-gray-500 truncate max-w-[80px]">{product.supplier.name}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
