'use client';

import { env } from '@/env';
import type { PosthogBootstrapData } from '@/lib/getBootstrapData';
import { usePathname, useSearchParams } from 'next/navigation';
import posthog from 'posthog-js';
import { PostHogProvider, usePostHog } from 'posthog-js/react';
import { useEffect, useRef, type ReactNode } from 'react';

const PostHogPageView = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ph = usePostHog();

  useEffect(() => {
    if (pathname && ph) {
      let url = window.origin + pathname;
      if (searchParams && searchParams.toString()) {
        url = url + `?${searchParams.toString()}`;
      }
      ph.capture('$pageview', {
        $current_url: url,
      });
    }
  }, [pathname, searchParams, ph]);

  return null;
};

interface PHProviderProps {
  children: ReactNode;
  bootstrapData: PosthogBootstrapData;
}

export const PHProvider = ({ children, bootstrapData }: PHProviderProps) => {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: env.NEXT_PUBLIC_POSTHOG_PROXY_PATH,
        ui_host: env.NEXT_PUBLIC_POSTHOG_HOST,
        person_profiles: 'always',
        debug: true,
        bootstrap: bootstrapData,
      });
      initialized.current = true;
    }
  }, [bootstrapData]);

  return (
    <PostHogProvider client={posthog}>
      <PostHogPageView />
      {children}
    </PostHogProvider>
  );
};
