'use client';

import type { MappedProduct } from 'commerce-kit';
import { usePostHog } from 'posthog-js/react';
import { useEffect } from 'react';

export const ProductViewedTracker = ({
  product,
}: {
  product: MappedProduct;
}) => {
  const posthog = usePostHog();

  useEffect(() => {
    posthog?.capture('product_viewed', {
      product_id: product.id,
      product_name: product.name,
      product_variant: product.metadata.variant,
      product_category: product.metadata.category,
      product_slug: product.metadata.slug,
      price: product.default_price.unit_amount,
      currency: product.default_price.currency,
      in_stock: product.metadata.stock > 0,
      stock_level: product.metadata.stock,
    });
  }, [product, posthog]);

  return null;
};
