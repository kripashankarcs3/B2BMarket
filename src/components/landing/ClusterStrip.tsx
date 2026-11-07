import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { Container, SectionHeader } from '@/components/ui';
import type { Cluster } from '@/lib/landing';

export function ClusterStrip({ clusters }: { clusters: Cluster[] }) {
  if (clusters.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 bg-white">
      <Container>
        <SectionHeader
          title="Buy where it's made"
          description="Each manufacturing hub has its own speciality. Go straight to the suppliers there."
          action={{ label: 'All supplier cities', href: '/suppliers' }}
        />
        <ul className="grid grid-cols-2 md:grid-cols-4 border-t border-l border-ink-100">
          {clusters.map((cluster) => (
            <li key={cluster.city} className="border-b border-r border-ink-100">
              <Link href={`/suppliers?city=${encodeURIComponent(cluster.city)}`} className="group block h-full p-4 sm:p-5 hover:bg-ink-50">
                <span className="flex items-center gap-1.5 font-medium text-ink-900 group-hover:text-brand-700">
                  <MapPin size={15} aria-hidden className="text-accent-600 shrink-0" />
                  {cluster.city}
                  <span className="text-xs font-normal text-ink-400">{cluster.state}</span>
                </span>
                <span className="mt-1 block text-sm text-ink-500">{cluster.specialty}</span>
                <span className="mt-2 block text-sm font-medium text-ink-800 tabular">{cluster.suppliers} suppliers</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
