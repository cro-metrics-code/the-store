'use client';

import { usePostHog } from 'posthog-js/react';
import { useEffect } from 'react';

const GlobalError = ({
  error,
  reset,
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
    <html lang="en">
      <body>
        <h2>Something went wrong!</h2>
        <p>{error.message}</p>
        {(error.digest || error.stack) && (
          <details>
            <summary>More details</summary>
            {error.digest && <p>{error.digest}</p>}
            {error.stack && <pre>{error.stack}</pre>}
          </details>
        )}
        <button type="button" onClick={() => reset()}>
          Try again
        </button>
      </body>
    </html>
  );
};

export default GlobalError;
