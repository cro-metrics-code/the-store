'use client';

import type { MappedProduct } from 'commerce-kit';
import { usePostHog } from 'posthog-js/react';
import { useEffect } from 'react';

export const SearchTracker = ({
  query,
  results,
}: {
  query: string;
  results: MappedProduct[] | null;
}) => {
  const posthog = usePostHog();

  useEffect(() => {
    posthog?.capture('search_performed', {
      search_query: query,
      results_count: results?.length ?? 0,
      has_results: (results?.length ?? 0) > 0,
    });
  }, [query, results, posthog]);

  return null;
};
