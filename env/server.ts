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
  experimental__runtimeEnv: {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_CURRENCY: process.env.STRIPE_CURRENCY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    ENABLE_STRIPE_TAX: process.env.ENABLE_STRIPE_TAX,
  },
});
