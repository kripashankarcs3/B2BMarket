import Link from 'next/link';
import { BadgeCheck, Clock, MapPin, Star } from 'lucide-react';
import { Container, SectionHeader } from '@/components/ui';
import type { Supplier } from '@/types';

const CURRENT_YEAR = new Date().getFullYear();

export function FeaturedSuppliers({ suppliers }: { suppliers: Supplier[] }) {
  if (suppliers.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 bg-white border-t border-ink-100">
      <Container>
        <SectionHeader
          title="Verified suppliers"
          description="GST-verified manufacturers and traders with a record of on-time dispatch."
          action={{ label: 'All suppliers', href: '/suppliers' }}
        />

        <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {suppliers.map((supplier) => {
            const years = CURRENT_YEAR - supplier.yearEstablished;
            return (
              <li key={supplier.id}>
                <Link
                  href={`/suppliers/${supplier.id}`}
                  className="group flex h-full flex-col rounded-lg border border-ink-100 bg-white p-5 hover-lift"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md border border-ink-100 bg-ink-50">
                      {supplier.logo && <img src={supplier.logo} alt="" className="h-full w-full object-cover" loading="lazy" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-ink-900 leading-snug line-clamp-2 group-hover:text-brand-700">
                        {supplier.name}
                      </h3>
                      <p className="mt-0.5 flex items-center gap-1 text-sm text-ink-500">
                        <MapPin size={13} aria-hidden className="shrink-0" />
                        <span className="truncate">{supplier.location}</span>
                      </p>
                    </div>
                  </div>

                  <dl className="mt-4 grid grid-cols-3 gap-2 rounded-md bg-ink-50 px-3 py-2.5 text-center">
                    <div>
                      <dt className="text-[11px] text-ink-400">Rating</dt>
                      <dd className="mt-0.5 flex items-center justify-center gap-1 text-sm font-semibold text-ink-900 tabular">
                        <Star size={12} aria-hidden className="fill-accent-500 text-accent-500" />
                        {supplier.rating.toFixed(1)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[11px] text-ink-400">In business</dt>
                      <dd className="mt-0.5 text-sm font-semibold text-ink-900 tabular">{years} yrs</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] text-ink-400">Products</dt>
                      <dd className="mt-0.5 text-sm font-semibold text-ink-900 tabular">{supplier.productCount}</dd>
                    </div>
                  </dl>

                  <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-ink-500">
                    {supplier.verified && (
                      <span className="inline-flex items-center gap-1 font-medium text-leaf-700">
                        <BadgeCheck size={14} aria-hidden /> GST verified
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1">
                      <Clock size={13} aria-hidden /> Replies {supplier.responseTime.toLowerCase()}
                    </span>
                  </div>

                  {supplier.certifications.length > 0 && (
                    <ul className="mt-auto pt-4 flex flex-wrap gap-1.5">
                      {supplier.certifications.slice(0, 3).map((cert) => (
                        <li key={cert} className="px-2 py-0.5 rounded-sm border border-ink-200 text-[11px] text-ink-600">
                          {cert}
                        </li>
                      ))}
                    </ul>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
