import { env } from '@/env';
import { getBootstrapData } from '@/lib/getBootstrapData';
import posthog from 'posthog-js';

const initPosthog = async () => {
  try {
    const bootstrap = await getBootstrapData();

    posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: env.NEXT_PUBLIC_POSTHOG_PROXY_PATH,
      ui_host: env.NEXT_PUBLIC_POSTHOG_HOST,
      defaults: '2025-05-24',
      person_profiles: 'always',
      capture_exceptions: true,
      bootstrap,
    });
  } catch (error) {
    console.error('Error loading experiments!', error);

    posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: env.NEXT_PUBLIC_POSTHOG_PROXY_PATH,
      ui_host: env.NEXT_PUBLIC_POSTHOG_HOST,
      defaults: '2025-05-24',
      person_profiles: 'always',
      capture_exceptions: true,
    });
  }
};

void initPosthog();
