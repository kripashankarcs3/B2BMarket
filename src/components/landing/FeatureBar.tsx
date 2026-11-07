import { ShieldCheck, PackageOpen, FileText, Truck } from 'lucide-react';
import { Container } from '@/components/ui';

const nf = new Intl.NumberFormat('en-IN');

/** White bar that overlaps the bottom edge of the hero. */
export function FeatureBar({ verifiedSuppliers }: { verifiedSuppliers: number }) {
  const features = [
    { icon: ShieldCheck, title: 'Verified Suppliers', body: `${nf.format(verifiedSuppliers)} GST-verified businesses` },
    { icon: PackageOpen, title: 'Bulk & Wholesale', body: 'Price slabs on large orders' },
    { icon: FileText, title: 'GST Invoicing', body: 'Input tax credit eligible' },
    { icon: Truck, title: 'Pan-India Delivery', body: 'Reliable & trackable shipping' },
  ];

  return (
    <div className="relative z-20 -mt-12">
      <Container>
        <ul className="grid grid-cols-1 rounded-2xl border border-ink-100 bg-white shadow-[0_10px_30px_rgba(36,51,138,0.10)] sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, body }, i) => (
            <li
              key={title}
              className={`flex items-center gap-4 px-6 py-5 ${i > 0 ? 'border-t border-ink-100 sm:border-t-0' : ''} ${i % 2 === 1 ? 'sm:border-l' : ''} ${i >= 2 ? 'sm:border-t' : ''} lg:border-t-0 lg:border-l border-ink-100 ${i === 0 ? 'lg:border-l-0' : ''}`}
            >
              <Icon size={34} strokeWidth={1.4} aria-hidden className="shrink-0 text-brand-800" />
              <div>
                <p className="font-semibold text-ink-900">{title}</p>
                <p className="text-sm text-ink-500">{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
