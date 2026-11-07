import Link from 'next/link';
import { ArrowRight, LayoutGrid } from 'lucide-react';
import { Container } from '@/components/ui';
import type { RootCategory } from '@/lib/landing';

export function CategoryTiles({ categories }: { categories: RootCategory[] }) {
  const shown = categories.filter((c) => c.products > 0 && c.image).slice(0, 7);
  if (shown.length === 0) return null;

  return (
    <section className="bg-white pb-14 pt-14 sm:pb-16 sm:pt-16">
      <Container>
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold text-ink-900 sm:text-[1.75rem]">Shop by Category</h2>
          <Link href="/products" className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-brand-700 hover:text-brand-800">
            <span>View All<span className="hidden sm:inline"> Categories</span></span>
            <ArrowRight size={16} aria-hidden />
          </Link>
        </div>

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8 sm:gap-4">
          {shown.map((cat) => (
            <li key={cat.slug}>
              <Link
                href={`/products?category=${cat.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-xl border border-ink-100 bg-white text-center shadow-[0_2px_6px_rgba(19,25,39,0.05)] hover:border-brand-200 hover:shadow-md"
              >
                <div className="aspect-[4/3] overflow-hidden bg-ink-50">
                  <img
                    src={cat.image}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <span className="flex flex-1 items-center justify-center px-3 py-3 text-sm font-medium leading-snug text-ink-900 group-hover:text-brand-700">
                  {cat.name}
                </span>
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/products"
              className="group flex h-full flex-col overflow-hidden rounded-xl border border-ink-100 bg-white text-center shadow-[0_2px_6px_rgba(19,25,39,0.05)] hover:border-brand-200 hover:shadow-md"
            >
              <span className="flex aspect-[4/3] items-center justify-center bg-brand-50 text-brand-700">
                <LayoutGrid size={40} strokeWidth={1.4} aria-hidden />
              </span>
              <span className="flex flex-1 items-center justify-center px-3 py-3 text-sm font-medium leading-snug text-ink-900 group-hover:text-brand-700">
                More Categories
              </span>
            </Link>
          </li>
        </ul>
      </Container>
    </section>
  );
}
