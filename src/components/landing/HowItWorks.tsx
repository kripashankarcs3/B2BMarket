import { Container } from '@/components/ui';

const steps = [
  {
    title: 'Search or post a requirement',
    body: 'Find products by category or keyword, or tell suppliers what you need and in what quantity.',
  },
  {
    title: 'Compare quotes',
    body: 'See MOQ, bulk price slabs, lead time and supplier ratings side by side. Negotiate in chat.',
  },
  {
    title: 'Order with a GST invoice',
    body: 'Pay securely. Your payment is held until the supplier dispatches, and you get an input-credit-ready invoice.',
  },
  {
    title: 'Track delivery',
    body: 'Follow the shipment to your warehouse with courier tracking, and rate the supplier when it lands.',
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 sm:py-20 bg-ink-50 border-y border-ink-100">
      <Container>
        <div className="max-w-2xl mb-10">
          <h2 className="font-display text-2xl sm:text-[2rem] font-semibold text-ink-900 leading-tight">
            How buying works
          </h2>
          <p className="mt-2 text-[15px] text-ink-500 leading-relaxed">
            From first search to delivered stock, in four steps.
          </p>
        </div>

        <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {steps.map((step, i) => (
            <li key={step.title} className="relative">
              <div className="flex items-center gap-3 mb-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-900 text-white text-sm font-semibold tabular">
                  {i + 1}
                </span>
                {i < steps.length - 1 && <span aria-hidden className="hidden lg:block h-px flex-1 bg-ink-200" />}
              </div>
              <h3 className="font-semibold text-ink-900">{step.title}</h3>
              <p className="mt-1.5 text-sm text-ink-500 leading-relaxed max-w-[30ch]">{step.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
