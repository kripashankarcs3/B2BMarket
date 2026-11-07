import { Search } from 'lucide-react';
import { ButtonLink, Container } from '@/components/ui';

export default function NotFound() {
  return (
    <Container className="pt-32 pb-24 max-w-xl text-center">
      <p className="font-display text-6xl font-semibold text-brand-600 tabular">404</p>
      <h1 className="mt-4 font-display text-3xl font-semibold text-ink-900">This page doesn&apos;t exist</h1>
      <p className="mt-3 text-[15px] text-ink-500">
        The link may be old, or the product may no longer be listed. Search the catalogue or go back to the home page.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <ButtonLink href="/products" icon={<Search size={16} aria-hidden />}>Browse products</ButtonLink>
        <ButtonLink href="/" variant="secondary">Go to home page</ButtonLink>
      </div>
    </Container>
  );
}
