import { env } from '@/env';
import type { PosthogBootstrapData } from './getServerBootstrapData';

const BOOTSTRAP_ENDPOINT = '/api/posthog/bootstrap';

const getServerEndpoint = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const baseUrl =
    isProduction ?
      env.NEXT_PUBLIC_URL
    : (env.NEXT_PUBLIC_DEV_URL ?? env.NEXT_PUBLIC_URL);

  return new URL(BOOTSTRAP_ENDPOINT, baseUrl).toString();
};

export const getBootstrapData = async (): Promise<PosthogBootstrapData> => {
  const endpoint =
    typeof window === 'undefined' ? getServerEndpoint() : BOOTSTRAP_ENDPOINT;

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
