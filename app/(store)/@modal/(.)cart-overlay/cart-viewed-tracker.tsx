'use client';

import { usePostHog } from 'posthog-js/react';
import { useEffect } from 'react';
import type Stripe from 'stripe';

interface CartViewedTrackerProps {
  cart: {
    cart: {
      id?: string;
      currency?: string;
    };
    lines: {
      product: {
        id: string;
        name: string;
        default_price: Pick<Stripe.Price, 'unit_amount' | 'currency'>;
      };
      quantity: number;
    }[];
  };
}

export const CartViewedTracker = ({ cart }: CartViewedTrackerProps) => {
  const posthog = usePostHog();

  useEffect(() => {
    const cartId = cart.cart.id;
    const currency = cart.cart.currency;

    if (!posthog || !cartId || !currency) {
      return;
    }

    const totalItems = cart.lines.reduce((acc, line) => acc + line.quantity, 0);
    const totalValue = cart.lines.reduce(
      (acc, line) =>
        acc + (line.product.default_price.unit_amount ?? 0) * line.quantity,
      0,
    );

    posthog.capture('cart_viewed', {
      cart_id: cartId,
      total_items: totalItems,
      total_value: totalValue,
      currency,
      products: cart.lines.map((line) => ({
        product_id: line.product.id,
        product_name: line.product.name,
        quantity: line.quantity,
        price: line.product.default_price.unit_amount,
      })),
    });
  }, [cart, posthog]);

  return null;
};
