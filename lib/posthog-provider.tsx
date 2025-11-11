'use client';

import { env } from '@/env';
import type { PosthogBootstrapData } from '@/lib/getBootstrapData';
import { usePathname, useSearchParams } from 'next/navigation';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { useEffect, type ReactNode } from 'react';

const PostHogPageView = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      let url = window.origin + pathname;
      if (searchParams && searchParams.toString()) {
        url = url + `?${searchParams.toString()}`;
      }
      posthog.capture('$pageview', {
        $current_url: url,
      });
    }
  }, [pathname, searchParams]);

  return null;
};

interface PHProviderProps {
  children: ReactNode;
  bootstrapData: PosthogBootstrapData;
}

export const PHProvider = ({ children, bootstrapData }: PHProviderProps) => {
  if (typeof window !== 'undefined') {
    posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: env.NEXT_PUBLIC_POSTHOG_PROXY_PATH,
      ui_host: env.NEXT_PUBLIC_POSTHOG_HOST,
      person_profiles: 'always',
      debug: true,
      bootstrap: bootstrapData,
    });
  }

  return (
    <PostHogProvider client={posthog}>
      <PostHogPageView />
      {children}
    </PostHogProvider>
  );
};
