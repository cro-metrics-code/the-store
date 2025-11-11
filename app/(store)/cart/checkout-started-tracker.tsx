'use client';

import type { Cart } from 'commerce-kit';
import { usePostHog } from 'posthog-js/react';
import { useEffect } from 'react';

export const CheckoutStartedTracker = ({ cart }: { cart: Cart }) => {
  const posthog = usePostHog();

  useEffect(() => {
    const totalItems = cart.lines.reduce((acc, line) => acc + line.quantity, 0);
    const totalValue = cart.lines.reduce(
      (acc, line) =>
        acc + (line.product.default_price.unit_amount ?? 0) * line.quantity,
      0,
    );

    posthog?.capture('checkout_started', {
      cart_id: cart.cart.id,
      total_items: totalItems,
      total_value: totalValue,
      currency: cart.cart.currency,
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
