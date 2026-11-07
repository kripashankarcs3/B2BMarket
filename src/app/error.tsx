'use client';

import { useEffect } from 'react';
import { Button, ButtonLink, Container } from '@/components/ui';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="pt-32 pb-24 max-w-xl text-center">
      <h1 className="font-display text-3xl font-semibold text-ink-900">This page didn&apos;t load</h1>
      <p className="mt-3 text-[15px] text-ink-500">
        Something went wrong on our side. Try again; if it keeps happening, email hello@b2bmarket.com
        {error.digest ? ` with reference ${error.digest}` : ''}.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <Button onClick={reset}>Try again</Button>
        <ButtonLink href="/" variant="secondary">Go to home page</ButtonLink>
      </div>
    </Container>
  );
}
