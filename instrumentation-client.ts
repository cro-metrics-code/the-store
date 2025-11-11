import { env } from '@/env';
import posthog from 'posthog-js';

// Set up performance monitoring
performance.mark('app-init');

// Initialize analytics
console.log('Analytics initialized');

// Set up error tracking
window.addEventListener('error', (event) => {
  // Send to your error tracking service
  reportError(event.error);
});

posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
  api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
  defaults: '2025-05-24',
});
