'use client';

import { Suspense, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, LayoutGrid, List, X } from 'lucide-react';
import { ProductGrid, ProductFilters } from '@/components/products';
import { DEFAULT_FILTERS } from '@/components/products/ProductFilters';
import { Container } from '@/components/ui';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { SORT_OPTIONS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { FilterState } from '@/types';

const PAGE_SIZE = 24;
const SORT_VALUES = SORT_OPTIONS.map((o) => o.value) as string[];

function readFilters(params: URLSearchParams): FilterState {
  const sort = params.get('sort') ?? 'recommended';
  const category = params.get('category');
  return {
    ...DEFAULT_FILTERS,
    search: params.get('q') ?? '',
    categories: category ? [category] : [],
    priceRange: [Number(params.get('min')) || 0, Number(params.get('max')) || 1000000],
    minRating: Number(params.get('rating')) || 0,
    sortBy: (SORT_VALUES.includes(sort) ? sort : 'recommended') as FilterState['sortBy'],
  };
}

function ProductsView() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filters = useMemo(() => readFilters(params), [params]);
  const page = Math.max(1, Number(params.get('page')) || 1);

  const { data: categories = [] } = useCategories();
  const activeCategory = categories.find((c) => c.slug === filters.categories[0]);

  const { data, isLoading, isError, refetch } = useProducts({
    search: filters.search || undefined,
    category: filters.categories[0],
    minPrice: filters.priceRange[0] > 0 ? filters.priceRange[0] : undefined,
    maxPrice: filters.priceRange[1] < 1000000 ? filters.priceRange[1] : undefined,
    minRating: filters.minRating > 0 ? filters.minRating : undefined,
    sortBy: filters.sortBy !== 'recommended' ? filters.sortBy : undefined,
    page,
    pageSize: PAGE_SIZE,
  });
  const products = data?.products ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 0;

  const navigate = (next: FilterState, nextPage = 1) => {
    const qs = new URLSearchParams();
    if (next.search) qs.set('q', next.search);
    if (next.categories[0]) qs.set('category', next.categories[0]);
    if (next.priceRange[0] > 0) qs.set('min', String(next.priceRange[0]));
    if (next.priceRange[1] < 1000000) qs.set('max', String(next.priceRange[1]));
    if (next.minRating > 0) qs.set('rating', String(next.minRating));
    if (next.sortBy !== 'recommended') qs.set('sort', next.sortBy);
    if (nextPage > 1) qs.set('page', String(nextPage));
    const query = qs.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const goToPage = (nextPage: number) => {
    navigate(filters, nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const title = filters.search
    ? `Results for “${filters.search}”`
    : activeCategory?.name ?? 'All products';

  return (
    <div className="pt-16 pb-16">
      <div className="bg-ink-50 border-b border-ink-100">
        <Container className="py-8 sm:py-10">
          <nav aria-label="Breadcrumb" className="text-sm text-ink-500 mb-3">
            <ol className="flex items-center gap-1.5">
              <li><Link href="/" className="hover:text-ink-900">Home</Link></li>
              <li aria-hidden>/</li>
              <li><Link href="/products" className="hover:text-ink-900">Products</Link></li>
              {activeCategory && (
                <>
                  <li aria-hidden>/</li>
                  <li className="text-ink-900 truncate" aria-current="page">{activeCategory.name}</li>
                </>
              )}
            </ol>
          </nav>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink-900">{title}</h1>
          <p className="mt-2 text-[15px] text-ink-500">
            {activeCategory?.description ?? 'Wholesale prices from verified Indian suppliers. Prices exclude GST.'}
          </p>
          {filters.search && (
            <button
              type="button"
              onClick={() => navigate({ ...filters, search: '' })}
              className="mt-4 inline-flex items-center gap-1.5 h-8 px-3 rounded-sm bg-white border border-ink-200 text-sm text-ink-700 hover:border-ink-300"
            >
              Search: {filters.search}
              <X size={14} aria-hidden />
              <span className="sr-only">Clear search</span>
            </button>
          )}
        </Container>
      </div>

      <Container className="pt-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
          <ProductFilters filters={filters} onChange={(next) => navigate(next)} totalResults={total} />

          <div className="flex-1 min-w-0">
            <div className="hidden lg:flex items-center justify-between mb-5">
              <p className="text-sm text-ink-500 tabular" aria-live="polite">
                {isLoading ? 'Loading products…' : `${total.toLocaleString('en-IN')} products`}
              </p>
              <div className="flex items-center gap-3">
                <label htmlFor="sort" className="text-sm text-ink-500">Sort by</label>
                <select
                  id="sort"
                  value={filters.sortBy}
                  onChange={(e) => navigate({ ...filters, sortBy: e.target.value as FilterState['sortBy'] })}
                  className="h-9 text-sm border border-ink-200 rounded-sm px-2.5 bg-white text-ink-800 cursor-pointer"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <div className="flex items-center border border-ink-200 rounded-sm p-0.5" role="group" aria-label="Layout">
                  {([
                    { mode: 'grid', icon: LayoutGrid, label: 'Grid view' },
                    { mode: 'list', icon: List, label: 'List view' },
                  ] as const).map(({ mode, icon: Icon, label }) => (
                    <button
                      key={mode}
                      type="button"
                      aria-label={label}
                      aria-pressed={viewMode === mode}
                      onClick={() => setViewMode(mode)}
                      className={cn('p-1.5 rounded-[4px]', viewMode === mode ? 'bg-ink-900 text-white' : 'text-ink-400 hover:text-ink-700')}
                    >
                      <Icon size={16} aria-hidden />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {isError ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-800">
                Products could not be loaded. Check your connection and{' '}
                <button type="button" onClick={() => refetch()} className="font-medium underline underline-offset-4">try again</button>.
              </div>
            ) : (
              <ProductGrid
                products={products}
                loading={isLoading}
                variant={viewMode === 'list' ? 'compact' : 'default'}
                onReset={() => navigate({ ...DEFAULT_FILTERS })}
              />
            )}

            {totalPages > 1 && (
              <nav aria-label="Pagination" className="mt-10 flex items-center justify-between gap-4 border-t border-ink-100 pt-6">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => goToPage(page - 1)}
                  className="inline-flex items-center gap-1.5 h-9 px-3 rounded-sm border border-ink-200 text-sm font-medium text-ink-700 hover:bg-ink-50 disabled:opacity-40 disabled:pointer-events-none"
                >
                  <ChevronLeft size={16} aria-hidden /> Previous
                </button>
                <p className="text-sm text-ink-500 tabular">
                  Page <span className="font-medium text-ink-900">{page}</span> of {totalPages}
                </p>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => goToPage(page + 1)}
                  className="inline-flex items-center gap-1.5 h-9 px-3 rounded-sm border border-ink-200 text-sm font-medium text-ink-700 hover:bg-ink-50 disabled:opacity-40 disabled:pointer-events-none"
                >
                  Next <ChevronRight size={16} aria-hidden />
                </button>
              </nav>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="pt-16 min-h-[60vh]" />}>
      <ProductsView />
    </Suspense>
  );
}
