'use server';

import {
  clearCartCookie,
  getCartCookieJson,
  setCartCookieJson,
} from '@/lib/cart';
import PostHogClient from '@/lib/posthog';
import {
  cartAdd,
  cartChangeQuantity,
  cartCount,
  cartCreate,
  cartGet,
  cartSetQuantity,
} from 'commerce-kit';
import { updateTag } from 'next/cache';
import { cookies } from 'next/headers';

// Helper to get PostHog distinct ID from cookies
const getDistinctId = async () => {
  const cookieStore = await cookies();
  const phCookie = cookieStore
    .getAll()
    .find((c) => c.name.startsWith('ph_') && c.name.endsWith('_posthog'));
  if (phCookie?.value) {
    try {
      const parsed = JSON.parse(decodeURIComponent(phCookie.value)) as {
        distinct_id?: string;
      };
      return parsed.distinct_id;
    } catch {
      return undefined;
    }
  }
  return undefined;
};

export const getCartFromCookiesAction = async () => {
  const cartJson = await getCartCookieJson();
  if (!cartJson) return null;

  const cart = await cartGet(cartJson.id);
  return cart ?? null;
};

export const findOrCreateCartIdFromCookiesAction = async () => {
  const cart = await getCartFromCookiesAction();
  if (cart) return cart;

  const newCart = await cartCreate();
  setCartCookieJson({
    id: newCart.id,
    linesCount: 0,
  });
  updateTag(`cart-${newCart.id}`);

  return newCart.id;
};

export const clearCartCookieAction = async () => {
  const cookie = await getCartCookieJson();
  if (!cookie) return;

  clearCartCookie();
  updateTag(`cart-${cookie.id}`);
  // FIXME not ideal, revalidate per domain instead (multi-tenant)
  updateTag('admin-orders');
};

export const addToCartAction = async (formData: FormData) => {
  const productId = formData.get('productId');
  if (!productId || typeof productId !== 'string')
    throw new Error('Invalid product ID');

  const cart = await getCartFromCookiesAction();

  const updatedCart = await cartAdd({
    productId,
    cartId: cart?.cart.id,
  });

  if (updatedCart) {
    setCartCookieJson({
      id: updatedCart.id,
      linesCount: cartCount(updatedCart.metadata),
    });

    updateTag(`cart-${updatedCart.id}`);
  }
};

export const increaseQuantity = async (productId: string) => {
  const posthogClient = PostHogClient();
  const cart = await getCartFromCookiesAction();
  if (!cart) throw new Error('Cart not found');

  const product = cart.lines.find((line) => line.product.id === productId);
  const oldQuantity = product?.quantity ?? 0;

  await cartChangeQuantity({
    productId,
    cartId: cart.cart.id,
    operation: 'INCREASE',
  });

  // Track quantity increase
  if (product) {
    const distinctId = await getDistinctId();
    posthogClient.capture({
      distinctId: distinctId ?? `anonymous-${cart.cart.id}`,
      event: 'cart_item_quantity_increased',
      properties: {
        product_id: product.product.id,
        product_name: product.product.name,
        product_variant: product.product.metadata.variant,
        old_quantity: oldQuantity,
        new_quantity: oldQuantity + 1,
        price: product.product.default_price.unit_amount,
        currency: product.product.default_price.currency,
      },
    });
  }
};

export const decreaseQuantity = async (productId: string) => {
  const posthogClient = PostHogClient();
  const cart = await getCartFromCookiesAction();
  if (!cart) throw new Error('Cart not found');

  const product = cart.lines.find((line) => line.product.id === productId);
  const oldQuantity = product?.quantity ?? 0;

  await cartChangeQuantity({
    productId,
    cartId: cart.cart.id,
    operation: 'DECREASE',
  });

  // Track quantity decrease
  if (product) {
    const distinctId = await getDistinctId();
    posthogClient.capture({
      distinctId: distinctId ?? `anonymous-${cart.cart.id}`,
      event: 'cart_item_quantity_decreased',
      properties: {
        product_id: product.product.id,
        product_name: product.product.name,
        product_variant: product.product.metadata.variant,
        old_quantity: oldQuantity,
        new_quantity: Math.max(0, oldQuantity - 1),
        price: product.product.default_price.unit_amount,
        currency: product.product.default_price.currency,
      },
    });
  }
};

export const setQuantity = async ({
  productId,
  cartId,
  quantity,
}: {
  productId: string;
  cartId: string;
  quantity: number;
}) => {
  const cart = await getCartFromCookiesAction();
  if (!cart) throw new Error('Cart not found');

  await cartSetQuantity({ productId, cartId, quantity });
};
