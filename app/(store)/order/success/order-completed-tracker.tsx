'use client';

import type { Order } from 'commerce-kit';
import { usePostHog } from 'posthog-js/react';
import { useEffect } from 'react';

export const OrderCompletedTracker = ({ order }: { order: Order }) => {
  const posthog = usePostHog();

  useEffect(() => {
    const totalItems = order.lines.reduce(
      (acc, line) => acc + line.quantity,
      0,
    );

    posthog?.capture('order_completed', {
      order_id: order.order.id,
      payment_intent_id: order.order.id,
      total_amount: order.order.amount_received,
      currency: order.order.currency,
      total_items: totalItems,
      status: order.order.status,
      receipt_email: order.order.receipt_email,
      products: order.lines.map((line) => ({
        product_id: line.product.id,
        product_name: line.product.name,
        variant: line.product.metadata.variant,
        category: line.product.metadata.category,
        quantity: line.quantity,
        price: line.product.default_price.unit_amount,
      })),
      shipping_country: order.order.shipping?.address?.country,
      billing_country:
        order.order.payment_method?.billing_details?.address?.country,
      has_digital_items: order.lines.some((line) =>
        Boolean(line.product.metadata.digitalAsset),
      ),
    });

    // Identify user by email if available
    if (order.order.receipt_email) {
      posthog?.identify(order.order.receipt_email, {
        email: order.order.receipt_email,
        name: order.order.shipping?.name,
      });
    }
  }, [order, posthog]);

  return null;
};
