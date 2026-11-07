import type { Metadata } from 'next';
import Link from 'next/link';
import { BadgeCheck, Clock, MapPin, Star, Building2 } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { mapSupplier } from '@/lib/mappers/supplier.mapper';
import { Container, EmptyState } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { Supplier } from '@/types';

export const metadata: Metadata = {
  title: 'Suppliers',
  description: 'GST-verified Indian manufacturers, wholesalers and traders, by city.',
};

const PAGE_SIZE = 30;
const CURRENT_YEAR = new Date().getFullYear();

interface SuppliersPageProps {
  searchParams: Promise<{ city?: string; verified?: string; page?: string }>;
}

function hrefFor(params: { city?: string; verified?: boolean; page?: number }) {
  const qs = new URLSearchParams();
  if (params.city) qs.set('city', params.city);
  if (params.verified) qs.set('verified', '1');
  if (params.page && params.page > 1) qs.set('page', String(params.page));
  const query = qs.toString();
  return query ? `/suppliers?${query}` : '/suppliers';
}

export default async function SuppliersPage({ searchParams }: SuppliersPageProps) {
  const { city, verified: verifiedParam, page: pageParam } = await searchParams;
  const verified = verifiedParam === '1';
  const page = Math.max(1, Number(pageParam) || 1);

  const where = {
    ...(city ? { city } : {}),
    ...(verified ? { isVerified: true } : {}),
  };

  const [cityRows, total, rows] = await Promise.all([
    prisma.supplier.groupBy({ by: ['city'], _count: { _all: true }, orderBy: { city: 'asc' } }),
    prisma.supplier.count({ where }),
    prisma.supplier.findMany({
      where,
      include: { certifications: true },
      orderBy: [{ isPremium: 'desc' }, { rating: 'desc' }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);
  const suppliers = rows.map(mapSupplier) as Supplier[];
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="pt-16 pb-16">
      <div className="bg-ink-50 border-b border-ink-100">
        <Container className="py-8 sm:py-10">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink-900">
            {city ? `Suppliers in ${city}` : 'Suppliers'}
          </h1>
          <p className="mt-2 text-[15px] text-ink-500 max-w-2xl">
            Manufacturers, wholesalers and traders across {cityRows.length} Indian cities. Open a profile to see
            their catalogue, certifications and response time.
          </p>

          <div className="mt-6 flex flex-wrap gap-2" role="list" aria-label="Filter by city">
            <Link
              role="listitem"
              href={hrefFor({ verified })}
              aria-current={!city ? 'page' : undefined}
              className={cn(
                'h-8 px-3 inline-flex items-center rounded-sm border text-sm transition-smooth',
                !city ? 'bg-ink-900 border-ink-900 text-white' : 'bg-white border-ink-200 text-ink-700 hover:border-ink-300'
              )}
            >
              All cities
            </Link>
            {cityRows.map((row) => {
              const active = row.city === city;
              return (
                <Link
                  key={row.city}
                  role="listitem"
                  href={hrefFor({ city: row.city, verified })}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'h-8 px-3 inline-flex items-center gap-1.5 rounded-sm border text-sm transition-smooth',
                    active ? 'bg-ink-900 border-ink-900 text-white' : 'bg-white border-ink-200 text-ink-700 hover:border-ink-300'
                  )}
                >
                  {row.city}
                  <span className={cn('text-xs tabular', active ? 'text-white/70' : 'text-ink-400')}>{row._count._all}</span>
                </Link>
              );
            })}
          </div>
        </Container>
      </div>

      <Container className="pt-8">
        <div className="flex items-center justify-between gap-4 mb-5">
          <p className="text-sm text-ink-500 tabular">{total} suppliers</p>
          <Link
            href={hrefFor({ city, verified: !verified })}
            aria-pressed={verified}
            className={cn(
              'inline-flex items-center gap-1.5 h-8 px-3 rounded-sm border text-sm font-medium transition-smooth',
              verified ? 'bg-leaf-50 border-leaf-600/30 text-leaf-700' : 'border-ink-200 text-ink-700 hover:bg-ink-50'
            )}
          >
            <BadgeCheck size={15} aria-hidden /> Verified only
          </Link>
        </div>

        {suppliers.length === 0 ? (
          <EmptyState
            icon={<Building2 size={22} aria-hidden />}
            title="No suppliers here yet"
            description="Try another city or turn off the verified filter."
            action={<Link href="/suppliers" className="text-sm font-medium text-brand-600 hover:underline underline-offset-4">Show all suppliers</Link>}
          />
        ) : (
          <ul className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {suppliers.map((supplier) => (
              <li key={supplier.id}>
                <Link
                  href={`/suppliers/${supplier.id}`}
                  className="group flex h-full gap-4 rounded-lg border border-ink-100 bg-white p-4 hover-lift"
                >
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md border border-ink-100 bg-ink-50">
                    {supplier.logo && <img src={supplier.logo} alt="" loading="lazy" className="h-full w-full object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="font-semibold text-ink-900 leading-snug line-clamp-2 group-hover:text-brand-700">{supplier.name}</h2>
                      {supplier.premium && (
                        <span className="shrink-0 px-1.5 py-0.5 rounded-sm bg-accent-50 border border-accent-500/40 text-[11px] font-medium text-accent-700">
                          Premium
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 flex items-center gap-1 text-sm text-ink-500">
                      <MapPin size={13} aria-hidden className="shrink-0" />
                      <span className="truncate">{supplier.location}</span>
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-600">
                      <span className="inline-flex items-center gap-1 tabular">
                        <Star size={12} aria-hidden className="fill-accent-500 text-accent-500" />
                        {supplier.rating.toFixed(1)} <span className="text-ink-400">({supplier.reviewCount})</span>
                      </span>
                      <span className="tabular">{CURRENT_YEAR - supplier.yearEstablished} yrs</span>
                      <span className="tabular">{supplier.productCount} products</span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-500">
                      {supplier.verified && (
                        <span className="inline-flex items-center gap-1 font-medium text-leaf-700">
                          <BadgeCheck size={13} aria-hidden /> GST verified
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1">
                        <Clock size={12} aria-hidden /> {supplier.responseTime}
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {totalPages > 1 && (
          <nav aria-label="Pagination" className="mt-10 flex items-center justify-between gap-4 border-t border-ink-100 pt-6 text-sm">
            {page > 1 ? (
              <Link href={hrefFor({ city, verified, page: page - 1 })} className="h-9 px-3 inline-flex items-center rounded-sm border border-ink-200 font-medium text-ink-700 hover:bg-ink-50">
                Previous
              </Link>
            ) : <span />}
            <p className="text-ink-500 tabular">Page <span className="font-medium text-ink-900">{page}</span> of {totalPages}</p>
            {page < totalPages ? (
              <Link href={hrefFor({ city, verified, page: page + 1 })} className="h-9 px-3 inline-flex items-center rounded-sm border border-ink-200 font-medium text-ink-700 hover:bg-ink-50">
                Next
              </Link>
            ) : <span />}
          </nav>
        )}
      </Container>
    </div>
  );
}
