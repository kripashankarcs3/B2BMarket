import Link from 'next/link';
import { Search, ShieldCheck } from 'lucide-react';
import { Container } from '@/components/ui';
import { HeroSlider, type HeroImage } from './HeroSlider';

const POPULAR_SEARCHES = ['PVC Pipe', 'LED Bulb', 'Car Battery', 'Cotton Fabric', 'Spices'];

// Photos from Wikimedia Commons; authors and licences are listed in public/hero/credits.json.
const HERO_IMAGES: HeroImage[] = [
  { src: '/hero/container-terminal.jpg', alt: 'Container terminal with stacked shipping containers and freight trucks' },
  { src: '/hero/factory-floor.jpg', alt: 'Worker handling aluminium profiles on a factory line' },
  { src: '/hero/port-cranes.jpg', alt: 'Cargo barge moored beside container cranes at a port' },
  { src: '/hero/cutting-machine.jpg', alt: 'Automated cutting machine on a factory production line' },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#e7eefb_0%,#f3f7fd_100%)] pt-16">
      <Container className="relative z-10 pb-8 pt-10 sm:pt-12 lg:pb-28 lg:pt-14">
        <div className="max-w-[34rem]">
          <p className="inline-flex items-center gap-2 rounded-full bg-brand-100/80 px-3.5 py-1.5 text-sm font-medium text-brand-800">
            <ShieldCheck size={16} aria-hidden />
            India&apos;s B2B sourcing platform
          </p>

          <h1 className="mt-5 text-[2.4rem] font-semibold leading-[1.1] text-brand-900 sm:text-5xl lg:text-[3.3rem]">
            Wholesale Sourcing Made Simple
          </h1>
          <p className="mt-4 max-w-[44ch] text-lg leading-relaxed text-ink-600">
            Connect with verified Indian manufacturers, compare prices, and buy in bulk with GST invoice.
          </p>

          <form action="/products" method="get" role="search" className="mt-7">
            <label htmlFor="hero-search" className="sr-only">Search products</label>
            <div className="flex items-center gap-2 rounded-xl border border-ink-200 bg-white p-1.5 shadow-[0_6px_24px_rgba(36,51,138,0.08)] focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-600/10">
              <Search size={20} aria-hidden className="ml-3 shrink-0 text-ink-400" />
              <input
                id="hero-search"
                name="q"
                type="search"
                placeholder="Search products, e.g. PVC Pipe, LED Bulb"
                className="h-12 min-w-0 flex-1 bg-transparent text-[15px] text-ink-900 placeholder:text-ink-400 outline-none"
              />
              <button type="submit" className="h-12 rounded-lg bg-brand-700 px-6 text-[15px] font-semibold text-white hover:bg-brand-800 sm:px-8">
                Search
              </button>
            </div>
          </form>

          <div className="mt-5 flex flex-wrap items-center gap-x-1.5 gap-y-2 text-sm">
            <span className="mr-1 font-semibold text-ink-900">Popular:</span>
            {POPULAR_SEARCHES.map((term) => (
              <Link
                key={term}
                href={`/products?q=${encodeURIComponent(term)}`}
                className="rounded-full border border-ink-200 bg-white/70 px-3.5 py-1.5 text-ink-700 hover:border-brand-500 hover:text-brand-700"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
      </Container>

      <HeroSlider images={HERO_IMAGES} />
    </section>
  );
}
