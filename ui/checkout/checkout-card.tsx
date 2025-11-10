import amex from '@/images/payments/amex.svg';
import blik from '@/images/payments/blik.svg';
import google_pay from '@/images/payments/google_pay.svg';
import klarna from '@/images/payments/klarna.svg';
import link from '@/images/payments/link.svg';
import mastercard from '@/images/payments/mastercard.svg';
import p24 from '@/images/payments/p24.svg';
import visa from '@/images/payments/visa.svg';
import { isDefined } from '@/lib/utils';
import { StripePayment } from '@/ui/checkout/stripe-payment';
import * as Commerce from 'commerce-kit';

export const paymentMethods = {
  amex,
  blik,
  google_pay,
  klarna,
  link,
  mastercard,
  p24,
  visa,
};

export const CheckoutCard = async ({ cart }: { cart: Commerce.Cart }) => {
  const shippingRates = await Commerce.shippingBrowse();

  return (
    <section className="max-w-md pb-12">
      <h2 className="text-3xl leading-none font-bold tracking-tight">
        Checkout
      </h2>
      <p className="text-muted-foreground mt-2 mb-4 text-sm">
        Provide billing and shipping details below.
      </p>
      <StripePayment
        shippingRateId={cart.cart.metadata.shippingRateId}
        shippingRates={structuredClone(shippingRates)}
        allProductsDigital={cart.lines.every((line) =>
          isDefined(line.product.shippable) ? !line.product.shippable : false,
        )}
      />
    </section>
  );
};
