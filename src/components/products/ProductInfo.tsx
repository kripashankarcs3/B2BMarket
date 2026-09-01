'use client';

import { useState } from 'react';
import { Minus, Plus, ShoppingCart, Heart, Share2, Shield, Truck, RotateCcw, Star, Check } from 'lucide-react';
import { Button, Badge, Select } from '@/components/ui';
import { cn, formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(product.moq);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const total = product.price * quantity;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="info" size="sm">{product.category.name}</Badge>
            {product.supplier.verified && <Badge variant="success" size="sm"><Shield size={10} /> Verified</Badge>}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-apple-gray-900 leading-tight">{product.name}</h1>
          <p className="text-sm text-apple-gray-400 mt-1">by {product.supplier.name}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={16} className={i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'fill-apple-gray-100 text-apple-gray-100'} />
            ))}
          </div>
          <span className="text-sm font-medium text-apple-gray-700">{product.rating}</span>
          <span className="text-sm text-apple-gray-400">({product.reviewCount} reviews)</span>
        </div>
        <span className="text-apple-gray-200">·</span>
        <span className="text-sm text-apple-gray-400">{product.moq}+ {product.unit} (MOQ)</span>
      </div>

      <div className="text-3xl sm:text-4xl font-bold text-apple-gray-900">
        {formatPrice(product.price)}
        <span className="text-base font-normal text-apple-gray-400"> / {product.unit}</span>
      </div>

      <p className="text-sm text-apple-gray-500 leading-relaxed">{product.shortDescription}</p>

      <div className="flex flex-wrap gap-2">
        {product.tags.map((tag) => (
          <span key={tag} className="px-3 py-1 text-xs bg-apple-gray-50 text-apple-gray-500 rounded-full">{tag}</span>
        ))}
      </div>

      <div className="border-t border-apple-gray-100 pt-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-apple-gray-700 mb-2">Quantity ({product.unit})</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(product.moq, quantity - product.moq))}
                disabled={quantity <= product.moq}
                className="w-10 h-10 rounded-[10px] border border-apple-gray-200 flex items-center justify-center hover:bg-apple-gray-50 disabled:opacity-40 apple-transition"
              >
                <Minus size={16} className="text-apple-gray-500" />
              </button>
              <div className="flex-1 max-w-[120px]">
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(product.moq, Number(e.target.value) || product.moq))}
                  className="w-full text-center px-3 py-2 border border-apple-gray-200 rounded-[10px] text-sm font-medium text-apple-gray-900 focus:outline-none focus:ring-2 focus:ring-apple-blue/20 focus:border-apple-blue"
                />
              </div>
              <button
                onClick={() => setQuantity(quantity + product.moq)}
                className="w-10 h-10 rounded-[10px] border border-apple-gray-200 flex items-center justify-center hover:bg-apple-gray-50 apple-transition"
              >
                <Plus size={16} className="text-apple-gray-500" />
              </button>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-apple-gray-400">Total</p>
            <p className="text-xl font-bold text-apple-gray-900">{formatPrice(total)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-emerald-600">
          <Check size={16} />
          In stock ({product.stockCount.toLocaleString()} {product.unit})
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button size="lg" fullWidth icon={<ShoppingCart size={18} />}>
          Add to Cart
        </Button>
        <Button size="lg" variant="secondary" fullWidth>
          Request Quote
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-[10px] text-sm apple-transition',
            isWishlisted ? 'bg-red-50 text-red-600' : 'hover:bg-apple-gray-50 text-apple-gray-500'
          )}
        >
          <Heart size={16} className={isWishlisted ? 'fill-red-500 text-red-500' : ''} />
          {isWishlisted ? 'Saved' : 'Save to Wishlist'}
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-[10px] text-sm text-apple-gray-500 hover:bg-apple-gray-50 apple-transition">
          <Share2 size={16} />
          Share
        </button>
      </div>

      <div className="border-t border-apple-gray-100 pt-6 grid grid-cols-3 gap-4">
        {[
          { icon: Shield, label: 'Trade Assurance', desc: 'Payment protection' },
          { icon: Truck, label: 'Free Shipping', desc: 'On orders over $5,000' },
          { icon: RotateCcw, label: 'Easy Returns', desc: 'Within 30 days' },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="text-center">
              <Icon size={20} className="mx-auto mb-2 text-apple-gray-400" />
              <p className="text-xs font-medium text-apple-gray-700">{item.label}</p>
              <p className="text-[10px] text-apple-gray-400">{item.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
