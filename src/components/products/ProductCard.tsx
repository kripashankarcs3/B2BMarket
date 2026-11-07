'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, Star, BadgeCheck, MapPin } from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact' | 'horizontal';
}

function placeholderFor(product: Product, size: number) {
  return `https://placehold.co/${size}x${size}/ebedf1/687184?text=${encodeURIComponent(product.name[0] ?? '?')}`;
}

export function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [imgError, setImgError] = useState(false);
  const image = imgError || !product.images[0] ? placeholderFor(product, 400) : product.images[0];
  const city = product.supplier?.location?.split(',')[0];

  const saveButton = (className: string, size: number) => (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); setIsSaved((saved) => !saved); }}
      aria-label={isSaved ? 'Remove from saved' : 'Save product'}
      aria-pressed={isSaved}
      className={className}
    >
      <Heart size={size} aria-hidden className={cn('transition-smooth', isSaved ? 'fill-red-500 text-red-500' : 'text-ink-500')} />
    </button>
  );

  if (variant === 'horizontal' || variant === 'compact') {
    return (
      <Link
        href={`/products/${product.id}`}
        className="group flex gap-4 p-3 bg-white rounded-lg border border-ink-100 hover-lift"
      >
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-md bg-ink-50 overflow-hidden shrink-0">
          <img src={image} alt="" loading="lazy" className="w-full h-full object-cover" onError={() => setImgError(true)} />
        </div>
        <div className="flex-1 min-w-0 py-0.5 flex flex-col">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-medium text-ink-900 line-clamp-2 group-hover:text-brand-700">{product.name}</h3>
            {saveButton('p-1 rounded-sm hover:bg-ink-50 shrink-0', 15)}
          </div>
          <p className="text-xs text-ink-500 mt-0.5 truncate">{product.supplier?.name}</p>
          <div className="mt-auto flex items-end justify-between gap-2 pt-2">
            <p className="text-[15px] font-semibold text-ink-900 tabular">
              {formatPrice(product.price)}
              <span className="text-xs font-normal text-ink-400"> / {product.unit}</span>
            </p>
            <p className="text-xs text-ink-500 tabular">MOQ {product.moq}</p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex h-full flex-col bg-white rounded-lg border border-ink-100 overflow-hidden hover-lift"
    >
      <div className="relative aspect-square bg-ink-50 overflow-hidden">
        <img
          src={image}
          alt=""
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          onError={() => setImgError(true)}
        />
        {!product.inStock && (
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-sm bg-white/95 text-[11px] font-medium text-red-700">
            Out of stock
          </span>
        )}
        {saveButton(
          'absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 flex items-center justify-center elev-sm opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100 transition-smooth',
          15
        )}
      </div>

      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <p className="text-xs text-ink-400 truncate">{product.category?.name}</p>
        <h3 className="mt-1 text-sm font-medium text-ink-900 leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-brand-700">
          {product.name}
        </h3>

        <p className="mt-2.5 text-base sm:text-lg font-semibold text-ink-900 tabular leading-none">
          {formatPrice(product.price)}
          <span className="text-xs font-normal text-ink-400"> / {product.unit}</span>
        </p>
        <p className="mt-1.5 text-xs text-ink-600 tabular">
          Min. order <span className="font-medium text-ink-900">{product.moq} {product.unit}</span>
        </p>

        <div className="flex-1 min-h-3" aria-hidden />
        <div className="pt-3 border-t border-ink-100 flex items-center justify-between gap-2 text-xs">
          <span className="flex min-w-0 items-center gap-1 text-ink-500">
            {product.supplier?.verified ? (
              <BadgeCheck size={14} aria-label="Verified supplier" className="shrink-0 text-leaf-600" />
            ) : (
              <MapPin size={13} aria-hidden className="shrink-0" />
            )}
            <span className="truncate">{city ?? product.supplier?.name}</span>
          </span>
          {product.reviewCount > 0 && (
            <span className="flex shrink-0 items-center gap-0.5 text-ink-600 tabular">
              <Star size={12} aria-hidden className="fill-accent-500 text-accent-500" />
              {product.rating.toFixed(1)}
              <span className="text-ink-400">({product.reviewCount})</span>
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
