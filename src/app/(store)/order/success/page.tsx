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

  return (
    <article className="max-w-3xl pb-32">
      <ClearCookieClientComponent
        cartId={order.order.id}
        cookieId={cookie?.id}
      />
      <h1 className="mt-4 inline-flex items-center text-3xl font-bold leading-none tracking-tight">
        Order Confirmation
        <PaymentStatus status={order.order.status} />
      </h1>
      <p className="mt-2">
        Thank you! You'll find the details of your order below.
      </p>
      <dl className="mt-12 space-y-2 text-sm">
        <dt className="font-semibold text-foreground">Order Number</dt>
        <dd className="text-accent-foreground">{order.order.id.slice(3)}</dd>
      </dl>

      <h2 className="sr-only">Products in this order</h2>
      <ul className="my-8 divide-y border-y">
        {order.lines.map((line) => (
          <li key={line.product.id} className="py-8">
            <article className="grid grid-cols-[auto,1fr] grid-rows-[repeat(auto,3)] justify-start gap-x-4 sm:gap-x-8">
              <h3 className="row-start-1 font-semibold leading-none text-neutral-700">
                {formatProductName(
                  line.product.name,
                  line.product.metadata.variant,
                )}
              </h3>
              {line.product.images.map((image) => (
                <Image
                  key={image}
                  className="col-start-1 row-span-3 row-start-1 mt-0.5 w-16 rounded-lg object-cover object-center transition-opacity sm:mt-0 sm:w-32"
                  src={image}
                  width={128}
                  height={128}
                  alt=""
                />
              ))}
              <div className="prose row-start-2 text-secondary-foreground">
                <Markdown source={line.product.description || ''} />
              </div>
              <footer className="row-start-3 mt-2 self-end">
                <dl className="grid grid-cols-[max-content,auto] gap-2 sm:grid-cols-3">
                  <div className="max-sm:col-span-2 max-sm:grid max-sm:grid-cols-subgrid">
                    <dt className="text-sm font-semibold text-foreground">
                      Price
                    </dt>
                    <dd className="text-sm text-accent-foreground">
                      {formatMoney({
                        amount: line.product.default_price.unit_amount ?? 0,
                        currency: line.product.default_price.currency,
                      })}
                    </dd>
                  </div>

                  <div className="max-sm:col-span-2 max-sm:grid max-sm:grid-cols-subgrid">
                    <dt className="text-sm font-semibold text-foreground">
                      Quantity
                    </dt>
                    <dd className="text-sm text-accent-foreground">
                      {line.quantity}
                    </dd>
                  </div>

                  <div className="max-sm:col-span-2 max-sm:grid max-sm:grid-cols-subgrid">
                    <dt className="text-sm font-semibold text-foreground">
                      Total
                    </dt>
                    <dd className="text-sm text-accent-foreground">
                      {formatMoney({
                        amount:
                          (line.product.default_price.unit_amount ?? 0) *
                          line.quantity,
                        currency: line.product.default_price.currency,
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
              <h3 className="row-start-1 font-semibold leading-none text-neutral-700">
                {order.shippingRate.display_name}
              </h3>
              <div className="col-start-1 row-span-3 row-start-1 mt-0.5 w-16 sm:mt-0 sm:w-32" />
              <footer className="row-start-3 mt-2 self-end">
                <dl className="grid grid-cols-[max-content,auto] gap-2 sm:grid-cols-3">
                  <div className="max-sm:col-span-2 max-sm:grid max-sm:grid-cols-subgrid">
                    <dt className="text-sm font-semibold text-foreground">
                      Price
                    </dt>
                    <dd className="text-sm text-accent-foreground">
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
            <h3 className="font-semibold leading-none text-neutral-700">
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
          {!isDigital(order.lines) && order.order.shipping?.address && (
            <div>
              <h3 className="font-semibold leading-none text-neutral-700">
                Shipping Address
              </h3>
              <p className="mt-3 text-sm">
                {[
                  order.order.shipping.name,
                  order.order.shipping.address.line1,
                  order.order.shipping.address.line2,
                  order.order.shipping.address.postal_code,
                  order.order.shipping.address.city,
                  order.order.shipping.address.state,
                  findMatchingCountry(order.order.shipping.address?.country)
                    ?.label,
                  '\n',
                  order.order.shipping.phone,
                  order.order.receipt_email,
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

          {order.order.payment_method?.billing_details.address && (
            <div>
              <h3 className="font-semibold leading-none text-neutral-700">
                Billing Address
              </h3>
              <p className="mt-3 text-sm">
                {[
                  order.order.payment_method.billing_details.name,
                  order.order.payment_method.billing_details.address.line1,
                  order.order.payment_method.billing_details.address.line2,
                  order.order.payment_method.billing_details.address
                    .postal_code,
                  order.order.payment_method.billing_details.address.city,
                  order.order.payment_method.billing_details.address.state,
                  findMatchingCountry(
                    order.order.payment_method?.billing_details?.address
                      ?.country,
                  )?.label,
                  '\n',
                  order.order.payment_method.billing_details.phone,
                  order.order.receipt_email,
                ]
                  .filter(Boolean)
                  .map((line) => (
                    <Fragment key={line}>
                      {line}
                      <br />
                    </Fragment>
                  ))}
                {order.order.metadata.taxId &&
                  `Tax ID: ${order.order.metadata.taxId}`}
              </p>
            </div>
          )}

          {order.order.payment_method?.type === 'card' &&
            order.order.payment_method.card && (
              <div className="border-t pt-8 sm:col-span-2">
                <h3 className="font-semibold leading-none text-neutral-700">
                  Payment Method
                </h3>
                <p className="mt-3 text-sm">
                  {order.order.payment_method.card.brand &&
                    order.order.payment_method.card.brand in paymentMethods && (
                      <Image
                        src={
                          paymentMethods[
                            order.order.payment_method.card
                              .brand as keyof typeof paymentMethods
                          ]
                        }
                        className="mr-1 inline-block w-6 align-text-bottom"
                        alt=""
                      />
                    )}
                  <span className="sr-only">Card brand</span>
                  <span className="capitalize">
                    {order.order.payment_method.card.display_brand}
                  </span>
                </p>
                <p className="mt-1.5 text-sm tabular-nums">
                  <span className="sr-only">Card number ending in </span>
                  <span aria-hidden>••••</span>
                  {order.order.payment_method.card.last4}
                </p>
              </div>
            )}

          <div className="col-span-2 grid grid-cols-2 gap-8 border-t pt-8">
            <h3 className="font-semibold leading-none text-neutral-700">
              Total
            </h3>
            <p>
              {formatMoney({
                amount: order.order.amount_received,
                currency: order.order.currency,
              })}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};

export default OrderDetailsPage;
