'use client';

import { env } from '@/env/client';
import { invariant } from '@/lib/invariant';
import { Elements } from '@stripe/react-stripe-js';
import { type StripeElementsOptions, loadStripe } from '@stripe/stripe-js';
import { type ReactNode, useMemo } from 'react';

export const StripeElementsContainer = ({
  children,
  clientSecret,
  publishableKey,
  stripeAccount,
}: {
  children: ReactNode;
  clientSecret?: string;
  publishableKey?: string;
  stripeAccount?: string;
}) => {
  const stripePublishableKey =
    publishableKey || env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  invariant(stripePublishableKey, 'Stripe publishable key is required');

  const stripePromise = useMemo(
    () => loadStripe(stripePublishableKey, { stripeAccount }),
    [stripePublishableKey, stripeAccount],
  );

  if (!clientSecret) {
    return null;
  }

  const options = {
    clientSecret: clientSecret,
    appearance: {
      variables: {
        fontFamily: `ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
        fontSizeSm: '0.875rem',
        colorDanger: 'hsl(0 84.2% 60.2%)',
      },
    },
    locale: 'auto',
  } satisfies StripeElementsOptions;

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
};
