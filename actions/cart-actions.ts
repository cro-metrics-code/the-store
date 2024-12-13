'use server';

import {
  clearCartCookie,
  getCartCookieJson,
  setCartCookieJson,
} from '@/lib/cart';
import * as Commerce from 'commerce-kit';
import { expireTag } from 'next/cache';

export const getCartFromCookiesAction = async () => {
  const cartJson = await getCartCookieJson();
  if (!cartJson) return null;

  const cart = await Commerce.cartGet(cartJson.id);
  return cart ?? null;
};

export const findOrCreateCartIdFromCookiesAction = async () => {
  const cart = await getCartFromCookiesAction();
  if (cart) return cart;

  const newCart = await Commerce.cartCreate();
  setCartCookieJson({
    id: newCart.id,
    linesCount: 0,
  });
  expireTag(`cart-${newCart.id}`);

  return newCart.id;
};

export const clearCartCookieAction = async () => {
  const cookie = await getCartCookieJson();
  if (!cookie) return;

  clearCartCookie();
  expireTag(`cart-${cookie.id}`);
  // FIXME not ideal, revalidate per domain instead (multi-tenant)
  expireTag('admin-orders');
};

export const addToCartAction = async (formData: FormData) => {
  const productId = formData.get('productId');
  if (!productId || typeof productId !== 'string')
    throw new Error('Invalid product ID');

  const cart = await getCartFromCookiesAction();

  const updatedCart = await Commerce.cartAdd({
    productId,
    cartId: cart?.cart.id,
  });

  if (updatedCart) {
    setCartCookieJson({
      id: updatedCart.id,
      linesCount: Commerce.cartCount(updatedCart.metadata),
    });

    expireTag(`cart-${updatedCart.id}`);
  }
};

export const increaseQuantity = async (productId: string) => {
  const cart = await getCartFromCookiesAction();
  if (!cart) throw new Error('Cart not found');

  await Commerce.cartChangeQuantity({
    productId,
    cartId: cart.cart.id,
    operation: 'INCREASE',
  });
};

export const decreaseQuantity = async (productId: string) => {
  const cart = await getCartFromCookiesAction();
  if (!cart) throw new Error('Cart not found');

  await Commerce.cartChangeQuantity({
    productId,
    cartId: cart.cart.id,
    operation: 'DECREASE',
  });
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

  await Commerce.cartSetQuantity({ productId, cartId, quantity });
};
