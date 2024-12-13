import { ShoppingCartIcon } from '@/ui/assets/shopping-cart-icon';
import { PrefetchLink } from '@/ui/prefetch-link';

export const CartEmpty = async () => (
  <div className="flex max-h-80 flex-1 flex-col items-center justify-center gap-4">
    <div className="flex flex-col items-center justify-center space-y-2 text-center">
      <ShoppingCartIcon className="h-12 w-12 text-neutral-500" />
      <h2 className="text-2xl font-bold tracking-tight">Your cart is empty</h2>
      <p className="text-neutral-500">
        Looks like you haven't added anything to your cart yet.
      </p>
    </div>
    <PrefetchLink
      className="inline-flex h-10 items-center justify-center rounded-md bg-neutral-900 px-6 text-sm font-medium text-neutral-50 shadow transition-colors hover:bg-neutral-900/90 focus-visible:ring-1 focus-visible:ring-neutral-950 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
      href="/"
    >
      Continue shopping
    </PrefetchLink>
  </div>
);
