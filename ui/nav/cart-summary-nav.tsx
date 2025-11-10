import { getCartFromCookiesAction } from '@/actions/cart-actions';
import { formatMoney } from '@/lib/utils';
import { PrefetchLink } from '@/ui/prefetch-link';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/ui/shadcn/tooltip';
import { calculateCartTotalNetWithoutShipping } from 'commerce-kit';
import { ShoppingBagIcon } from 'lucide-react';
import { Suspense } from 'react';

const CartFallback = () => (
  <div className="h-6 w-6 opacity-30">
    <ShoppingBagIcon />
  </div>
);

export const CartSummaryNav = () => {
  return (
    <Suspense fallback={<CartFallback />}>
      <CartSummaryNavInner />
    </Suspense>
  );
};

const CartSummaryNavInner = async () => {
  const cart = await getCartFromCookiesAction();
  if (!cart) {
    return <CartFallback />;
  }
  if (!cart.lines.length) {
    return <CartFallback />;
  }

  const total = calculateCartTotalNetWithoutShipping(cart);
  const totalItems = cart.lines.reduce((acc, line) => acc + line.quantity, 0);

  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <div>
            <PrefetchLink
              href="/cart-overlay"
              scroll={false}
              className="relative block h-6 w-6"
              prefetch={true}
            >
              <ShoppingBagIcon />
              <span className="absolute right-0 bottom-0 inline-flex h-5 w-5 translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full border-2 bg-white text-center text-xs">
                <span className="sr-only">Items in cart: </span>
                {totalItems}
              </span>
              <span className="sr-only">
                Total:{' '}
                {formatMoney({
                  amount: total,
                  currency: cart.cart.currency,
                })}
              </span>
            </PrefetchLink>
          </div>
        </TooltipTrigger>
        <TooltipContent side="left" sideOffset={25}>
          <p>Items in cart: {totalItems}</p>
          <p>
            Total:{' '}
            {formatMoney({
              amount: total,
              currency: cart.cart.currency,
            })}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
