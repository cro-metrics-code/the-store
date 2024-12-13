import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  client: {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string(),
    NEXT_PUBLIC_URL: z.string().url(),
    NEXT_PUBLIC_DEV_URL: z.string().url(),
    NEXT_PUBLIC_NEWSLETTER_ENDPOINT: z.string().optional(),
    NEXT_PUBLIC_AMPLITUDE_API_KEY: z.string(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_DEV_URL: process.env.NEXT_PUBLIC_DEV_URL,
    NEXT_PUBLIC_URL:
      process.env.NEXT_PUBLIC_DEV_URL ||
      `https://${
        process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' ?
          process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
        : process.env.NEXT_PUBLIC_VERCEL_URL
      }`,
    NEXT_PUBLIC_NEWSLETTER_ENDPOINT:
      process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT,
    NEXT_PUBLIC_AMPLITUDE_API_KEY: process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY,
  },
});
