'use client';

import { PackageSearch } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { Button, EmptyState, Skeleton } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  variant?: 'default' | 'compact';
  onReset?: () => void;
}

export function ProductGrid({ products, loading, variant = 'default', onReset }: ProductGridProps) {
  const gridClass = variant === 'compact'
    ? 'grid grid-cols-1 xl:grid-cols-2 gap-3'
    : 'grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-5';

  if (loading) {
    return (
      <div className={gridClass} aria-busy="true" aria-label="Loading products">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className={cn('rounded-lg border border-ink-100 overflow-hidden', variant === 'compact' && 'flex gap-4 p-3')}>
            <Skeleton className={variant === 'compact' ? 'w-28 h-28 shrink-0' : 'aspect-square rounded-none'} />
            <div className={cn('space-y-2.5', variant === 'compact' ? 'flex-1 py-1' : 'p-4')}>
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-5 w-2/5" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon={<PackageSearch size={22} aria-hidden />}
        title="No products match these filters"
        description="Remove a filter or widen the price range to see more suppliers."
        action={onReset && <Button variant="secondary" onClick={onReset}>Clear all filters</Button>}
      />
    );
  }

  return (
    <div className={gridClass}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} variant={variant} />
      ))}
    </div>
  );
}
