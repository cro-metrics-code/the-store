import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    STRIPE_SECRET_KEY: z.string(),
    STRIPE_CURRENCY: z.string(),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),
    ENABLE_STRIPE_TAX: z
      .string()
      .optional()
      .transform((str) => !!str),
  },
  client: {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string(),
    NEXT_PUBLIC_URL: z.string().url(),
    NEXT_PUBLIC_DEV_URL: z.string().url(),
    NEXT_PUBLIC_POSTHOG_KEY: z.string(),
    NEXT_PUBLIC_POSTHOG_HOST: z.string().url(),
    NEXT_PUBLIC_POSTHOG_PROXY_PATH: z.string(),
    NEXT_PUBLIC_NEWSLETTER_ENDPOINT: z.string().url().optional(),
  },
  experimental__runtimeEnv: {
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
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    NEXT_PUBLIC_POSTHOG_PROXY_PATH: process.env.NEXT_PUBLIC_POSTHOG_PROXY_PATH,
    NEXT_PUBLIC_NEWSLETTER_ENDPOINT:
      process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT,
  },
});
