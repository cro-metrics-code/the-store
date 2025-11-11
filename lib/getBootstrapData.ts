import { env } from '@/env';
import type { PosthogBootstrapData } from './getServerBootstrapData';

const BOOTSTRAP_ENDPOINT = '/api/posthog/bootstrap';

export const getBootstrapData = async (): Promise<PosthogBootstrapData> => {
  const endpoint =
    typeof window === 'undefined' ?
      new URL(
        BOOTSTRAP_ENDPOINT,
        env.NEXT_PUBLIC_DEV_URL ?? env.NEXT_PUBLIC_URL,
      ).toString()
    : BOOTSTRAP_ENDPOINT;

  const response = await fetch(endpoint, {
    credentials: 'include',
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to load PostHog bootstrap data');
  }

  return (await response.json()) as PosthogBootstrapData;
};

export type { PosthogBootstrapData };
