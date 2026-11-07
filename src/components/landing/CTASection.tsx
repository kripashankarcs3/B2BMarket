import { Check } from 'lucide-react';
import { ButtonLink, Container } from '@/components/ui';

const points = [
  'List your catalogue free, with bulk price slabs',
  'Get enquiries from buyers across India',
  'Get paid on dispatch, with GST invoicing built in',
];

export function CTASection() {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <Container>
        <div className="rounded-xl bg-brand-700 px-6 py-10 sm:px-10 sm:py-12 lg:px-14 grid lg:grid-cols-[1.3fr_1fr] gap-8 lg:gap-12 items-center">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white leading-tight text-balance">
              Manufacture or trade? Sell to businesses across India.
            </h2>
            <ul className="mt-6 space-y-2.5">
              {points.map((point) => (
                <li key={point} className="flex items-start gap-2.5 text-[15px] text-brand-100">
                  <Check size={18} aria-hidden className="mt-0.5 shrink-0 text-accent-500" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3 lg:items-start xl:justify-end">
            <ButtonLink href="/auth/register" variant="inverse" size="lg">Start selling</ButtonLink>
            <a
              href="mailto:hello@b2bmarket.com?subject=Selling%20on%20B2BMarket"
              className="inline-flex h-12 items-center justify-center px-5 rounded-md border border-white/30 text-[15px] font-medium text-white hover:bg-white/10 transition-smooth"
            >
              Talk to our seller team
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
