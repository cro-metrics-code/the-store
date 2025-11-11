'use server';

import { getCartFromCookiesAction } from '@/actions/cart-actions';
import { cartSaveTax } from 'commerce-kit';

export const saveTaxIdAction = async ({ taxId }: { taxId: string }) => {
  const cart = await getCartFromCookiesAction();
  if (!cart) {
    throw new Error('No cart id found in cookies');
  }

  await cartSaveTax({ cartId: cart.cart.id, taxId });
};
