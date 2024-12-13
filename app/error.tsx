'use client';

import { PrefetchLink } from '@/ui/prefetch-link';
import { Button } from '@/ui/shadcn/button';
import { useEffect } from 'react';

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto max-w-xl flex-auto text-center">
      <h1 className="mt-8 mb-8 text-4xl font-black">
        Oops, something went wrong!
      </h1>
      <Button variant="link" asChild>
        <PrefetchLink href="/">Try again</PrefetchLink>
      </Button>
    </main>
  );
}
