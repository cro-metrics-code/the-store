import { getCartFromCookiesAction } from '@/actions/cart-actions';
import { formatMoney, formatProductName } from '@/lib/utils';
import { PrefetchLink } from '@/ui/prefetch-link';
import { Button } from '@/ui/shadcn/button';
import * as Commerce from 'commerce-kit';
import { calculateCartTotalNetWithoutShipping } from 'commerce-kit';
import Image from 'next/image';
import { CartAsideContainer } from './cart-aside';
import { CartModalAddSideEffect } from './cart-side-effect';

export default async function CartModalPage(props: {
  searchParams: Promise<{ add?: string }>;
}) {
  const searchParams = await props.searchParams;
  const originalCart = await getCartFromCookiesAction();
  const cart = await Commerce.cartAddOptimistic({
    add: searchParams.add,
    cart: originalCart,
  });

  if (!cart || cart.lines.length === 0) {
    return null;
  }

  const currency = cart.lines[0]?.product.default_price.currency ?? 'USD';
  const total = calculateCartTotalNetWithoutShipping(cart);

  return (
    <CartAsideContainer>
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-700">
            Shopping cart
          </h2>
          <PrefetchLink
            replace
            href="/cart"
            className="text-muted-foreground text-sm underline"
          >
            Open full view
          </PrefetchLink>
        </div>

        <div className="mt-8">
          <ul className="-my-6 divide-y divide-neutral-200">
            {cart.lines.map((line) => (
              <li
                key={line.product.id}
                className="grid grid-cols-[4rem_1fr_max-content] grid-rows-[auto_auto] gap-x-4 gap-y-2 py-6"
              >
                {line.product.images[0] ?
                  <div className="col-span-1 row-span-2 bg-neutral-100">
                    <Image
                      className="aspect-square rounded-md object-cover"
                      src={line.product.images[0]}
                      width={80}
                      height={80}
                      alt=""
                    />
                  </div>
                : <div className="col-span-1 row-span-2" />}

                <h3 className="-mt-1 leading-tight font-semibold">
                  {formatProductName(
                    line.product.name,
                    line.product.metadata.variant,
                  )}
                </h3>
                <p className="text-sm leading-none font-medium">
                  {formatMoney({
                    amount: line.product.default_price.unit_amount ?? 0,
                    currency: line.product.default_price.currency,
                  })}
                </p>
                <p className="text-muted-foreground self-end text-sm font-medium">
                  Quantity: {line.quantity}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-neutral-200 px-4 py-6 sm:px-6">
        <div
          id="cart-overlay-description"
          className="flex justify-between text-base font-medium text-neutral-900"
        >
          <p>Total</p>
          <p>
            {formatMoney({
              amount: total,
              currency,
            })}
          </p>
        </div>
        <p className="mt-0.5 text-sm text-neutral-500">
          Shipping and taxes will be added at the next step
        </p>
        <Button
          asChild={true}
          size={'lg'}
          className="mt-6 w-full rounded-full text-lg"
        >
          <PrefetchLink href="/cart">Go to payment</PrefetchLink>
        </Button>
      </div>
      {searchParams.add && (
        <CartModalAddSideEffect productId={searchParams.add} />
      )}
    </CartAsideContainer>
  );
}
