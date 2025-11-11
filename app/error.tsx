'use client';

import { PrefetchLink } from '@/ui/prefetch-link';
import { Button } from '@/ui/shadcn/button';
import { usePostHog } from 'posthog-js/react';
import { useEffect } from 'react';

const Error = ({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  const posthog = usePostHog();

  useEffect(() => {
    console.error(error);

    posthog.capture('error_occurred', {
      error_message: error.message,
      error_name: error.name,
      error_stack: error.stack,
      error_digest: error.digest,
      page_url: window.location.href,
    });
  }, [error, posthog]);

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
};

export default Error;
