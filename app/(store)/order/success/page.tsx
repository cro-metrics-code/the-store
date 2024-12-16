import { getCartCookieJson } from '@/lib/cart';
import { findMatchingCountry } from '@/lib/countries';
import { formatMoney, formatProductName } from '@/lib/utils';
import { paymentMethods } from '@/ui/checkout/checkout-card';
import { ClearCookieClientComponent } from '@/ui/checkout/clear-cookie-client-component';
import { Markdown } from '@/ui/markdown';
import * as Commerce from 'commerce-kit';
import type { Metadata } from 'next';
import Image from 'next/image';
import { Fragment } from 'react';
import { PaymentStatus } from './payment-status';
import { SuccessSideEffects } from '@/app/(store)/order/success/success-side-effects';

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: 'Order Success · The Store',
  };
};

const OrderDetailsPage = async (props: {
  searchParams: Promise<{
    payment_intent?: string | string[] | undefined | null;
    payment_intent_client_secret?: string | string[] | undefined | null;
  }>;
}) => {
  const searchParams = await props.searchParams;
  if (
    typeof searchParams.payment_intent !== 'string' ||
    typeof searchParams.payment_intent_client_secret !== 'string'
  ) {
    return <div>Invalid order details</div>;
  }
  const order = await Commerce.orderGet(searchParams.payment_intent);

  if (!order) {
    return <div>Order not found</div>;
  }
  const cookie = await getCartCookieJson();

  const isDigital = (lines: Commerce.Order['lines']) => {
    return lines.some(({ product }) => Boolean(product.metadata.digitalAsset));
  };

  const {
    order: {
      id,
      status,
      amount_received,
      currency,
      metadata,
      receipt_email,
      shipping,
      payment_method,
    },
    lines: orderLines,
  } = order;

  return (
    <article className="max-w-3xl pb-32">
      <ClearCookieClientComponent cartId={id} cookieId={cookie?.id} />
      <h1 className="mt-4 inline-flex items-center text-3xl leading-none font-bold tracking-tight">
        Order Confirmation
        <PaymentStatus status={status} />
      </h1>
      <p className="mt-2">
        Thank you! You'll find the details of your order below.
      </p>
      <dl className="mt-12 space-y-2 text-sm">
        <dt className="text-foreground font-semibold">Order Number</dt>
        <dd className="text-accent-foreground">{id.slice(3)}</dd>
      </dl>

      <h2 className="sr-only">Products in this order</h2>
      <ul className="my-8 divide-y border-y">
        {orderLines.map(({ product, quantity }) => (
          <li key={product.id} className="py-8">
            <article className="grid grid-cols-[auto,1fr] grid-rows-[repeat(auto,3)] justify-start gap-x-4 sm:gap-x-8">
              <h3 className="row-start-1 leading-none font-semibold text-neutral-700">
                {formatProductName(product.name, product.metadata.variant)}
              </h3>
              {product.images.map((image) => (
                <Image
                  key={image}
                  className="col-start-1 row-span-3 row-start-1 mt-0.5 w-16 rounded-lg object-cover object-center transition-opacity sm:mt-0 sm:w-32"
                  src={image}
                  width={128}
                  height={128}
                  alt=""
                />
              ))}
              <div className="prose text-secondary-foreground row-start-2">
                <Markdown source={product.description || ''} />
              </div>
              <footer className="row-start-3 mt-2 self-end">
                <dl className="grid grid-cols-[max-content,auto] gap-2 sm:grid-cols-3">
                  <div className="max-sm:col-span-2 max-sm:grid max-sm:grid-cols-subgrid">
                    <dt className="text-foreground text-sm font-semibold">
                      Price
                    </dt>
                    <dd className="text-accent-foreground text-sm">
                      {formatMoney({
                        amount: product.default_price.unit_amount ?? 0,
                        currency: product.default_price.currency,
                      })}
                    </dd>
                  </div>

                  <div className="max-sm:col-span-2 max-sm:grid max-sm:grid-cols-subgrid">
                    <dt className="text-foreground text-sm font-semibold">
                      Quantity
                    </dt>
                    <dd className="text-accent-foreground text-sm">
                      {quantity}
                    </dd>
                  </div>

                  <div className="max-sm:col-span-2 max-sm:grid max-sm:grid-cols-subgrid">
                    <dt className="text-foreground text-sm font-semibold">
                      Total
                    </dt>
                    <dd className="text-accent-foreground text-sm">
                      {formatMoney({
                        amount:
                          (product.default_price.unit_amount ?? 0) * quantity,
                        currency: product.default_price.currency,
                      })}
                    </dd>
                  </div>
                </dl>
              </footer>
            </article>
          </li>
        ))}
        {order.shippingRate?.fixed_amount && (
          <li className="py-8">
            <article className="grid grid-cols-[auto,1fr] grid-rows-[repeat(auto,3)] justify-start gap-x-4 sm:gap-x-8">
              <h3 className="row-start-1 leading-none font-semibold text-neutral-700">
                {order.shippingRate.display_name}
              </h3>
              <div className="col-start-1 row-span-3 row-start-1 mt-0.5 w-16 sm:mt-0 sm:w-32" />
              <footer className="row-start-3 mt-2 self-end">
                <dl className="grid grid-cols-[max-content,auto] gap-2 sm:grid-cols-3">
                  <div className="max-sm:col-span-2 max-sm:grid max-sm:grid-cols-subgrid">
                    <dt className="text-foreground text-sm font-semibold">
                      Price
                    </dt>
                    <dd className="text-accent-foreground text-sm">
                      {formatMoney({
                        amount: order.shippingRate.fixed_amount.amount ?? 0,
                        currency: order.shippingRate.fixed_amount.currency,
                      })}
                    </dd>
                  </div>
                </dl>
              </footer>
            </article>
          </li>
        )}
      </ul>

      <div className="pl-20 sm:pl-40">
        <h2 className="sr-only">Order Details</h2>
        {isDigital(order.lines) && (
          <div className="mb-8">
            <h3 className="leading-none font-semibold text-neutral-700">
              Digital Asset
            </h3>
            <ul className="mt-3">
              {order.lines
                .filter((line) => line.product.metadata.digitalAsset)
                .map((line) => {
                  return (
                    <li key={line.product.id} className="text-sm">
                      <a
                        href={line.product.metadata.digitalAsset}
                        target="_blank"
                        download={true}
                        rel="noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {line.product.name}
                      </a>
                    </li>
                  );
                })}
            </ul>
          </div>
        )}
        <div className="grid gap-8 sm:grid-cols-2">
          {!isDigital(orderLines) && shipping?.address && (
            <div>
              <h3 className="leading-none font-semibold text-neutral-700">
                Shipping Address
              </h3>
              <p className="mt-3 text-sm">
                {[
                  shipping.name,
                  shipping.address.line1,
                  shipping.address.line2,
                  shipping.address.postal_code,
                  shipping.address.city,
                  shipping.address.state,
                  findMatchingCountry(shipping.address?.country)?.label,
                  '\n',
                  shipping.phone,
                  receipt_email,
                ]
                  .filter(Boolean)
                  .map((line) => (
                    <Fragment key={line}>
                      {line}
                      <br />
                    </Fragment>
                  ))}
              </p>
            </div>
          )}

          {payment_method?.billing_details.address && (
            <div>
              <h3 className="leading-none font-semibold text-neutral-700">
                Billing Address
              </h3>
              <p className="mt-3 text-sm">
                {[
                  payment_method.billing_details.name,
                  payment_method.billing_details.address.line1,
                  payment_method.billing_details.address.line2,
                  payment_method.billing_details.address.postal_code,
                  payment_method.billing_details.address.city,
                  payment_method.billing_details.address.state,
                  findMatchingCountry(
                    payment_method.billing_details.address.country,
                  )?.label,
                  '\n',
                  payment_method.billing_details.phone,
                  receipt_email,
                ]
                  .filter(Boolean)
                  .map((line) => (
                    <Fragment key={line}>
                      {line}
                      <br />
                    </Fragment>
                  ))}
                {metadata.taxId && `Tax ID: ${metadata.taxId}`}
              </p>
            </div>
          )}

          {payment_method?.type === 'card' && payment_method.card && (
            <div className="border-t pt-8 sm:col-span-2">
              <h3 className="leading-none font-semibold text-neutral-700">
                Payment Method
              </h3>
              <p className="mt-3 text-sm">
                {payment_method.card.brand &&
                  payment_method.card.brand in paymentMethods && (
                    <Image
                      src={
                        paymentMethods[
                          payment_method.card
                            .brand as keyof typeof paymentMethods
                        ]
                      }
                      className="mr-1 inline-block w-6 align-text-bottom"
                      alt=""
                    />
                  )}
                <span className="sr-only">Card brand</span>
                <span className="capitalize">
                  {payment_method.card.display_brand}
                </span>
              </p>
              <p className="mt-1.5 text-sm tabular-nums">
                <span className="sr-only">Card number ending in </span>
                <span aria-hidden>••••</span>
                {payment_method.card.last4}
              </p>
            </div>
          )}

          <div className="col-span-2 grid grid-cols-2 gap-8 border-t pt-8">
            <h3 className="leading-none font-semibold text-neutral-700">
              Total
            </h3>
            <p>
              {formatMoney({
                amount: amount_received,
                currency,
              })}
            </p>
          </div>
        </div>
      </div>
      <SuccessSideEffects
        id={id}
        revenue={amount_received}
        count={orderLines.length}
      />
    </article>
  );
};

export default OrderDetailsPage;
