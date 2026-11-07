import { BadgeCheck, Layers, MessagesSquare, ReceiptText } from 'lucide-react';
import { Container, SectionHeader } from '@/components/ui';

const BENEFITS = [
  {
    icon: BadgeCheck,
    title: 'Verified suppliers',
    body: 'Buy from manufacturers and traders whose GST registration has been checked.',
  },
  {
    icon: Layers,
    title: 'Bulk price slabs',
    body: 'See the price per unit at every quantity before you decide how much to order.',
  },
  {
    icon: MessagesSquare,
    title: 'Talk to suppliers',
    body: 'Ask about samples, lead time and customisation, and negotiate directly in chat.',
  },
  {
    icon: ReceiptText,
    title: 'GST-ready buying',
    body: 'HSN code and GST rate on every listing, and a GST invoice for input tax credit.',
  },
];

export function WhyUs() {
  return (
    <section className="bg-ink-50 py-14 sm:py-16">
      <Container>
        <SectionHeader
          title="Why buyers use B2BMarket"
          description="Built for businesses that buy in volume."
          className="mb-8"
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map(({ icon: Icon, title, body }) => (
            <li key={title} className="rounded-xl border border-ink-200 bg-white p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <Icon size={24} strokeWidth={1.6} aria-hidden />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-ink-900">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{body}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
