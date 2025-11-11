import { getCartFromCookiesAction } from '@/actions/cart-actions';
import { CheckoutCard } from '@/ui/checkout/checkout-card';
import type { Metadata } from 'next/types';
import { CheckoutStartedTracker } from './checkout-started-tracker';

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: 'Shopping cart · The Store',
  };
};

export default async function CartPage() {
  const cart = await getCartFromCookiesAction();
  if (!cart) {
    return null;
  }

  return (
    <>
      <CheckoutCard cart={cart} />
      <CheckoutStartedTracker cart={cart} />
    </>
  );
}
