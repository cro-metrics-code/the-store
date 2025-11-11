import { env } from '@/env';
import posthog from 'posthog-js';

posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
  api_host: '/ph-collect',
  ui_host: 'https://us.posthog.com',
  defaults: '2025-05-24',
  person_profiles: 'always',
  capture_exceptions: true, // This enables capturing exceptions using Error Tracking, set to false if you don't want this
  debug: true,
});
