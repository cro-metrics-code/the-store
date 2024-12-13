'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/ui/shadcn/button';
import { Loader2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

export const AddToCartButton = ({
  productId,
  disabled,
  className,
}: {
  productId: string;
  disabled?: boolean;
  className?: string;
}) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const isDisabled = disabled || pending;

  return (
    <Button
      id="button-add-to-cart"
      size="lg"
      type="submit"
      className={cn('relative rounded-full text-lg', className)}
      onClick={async (e) => {
        if (isDisabled) {
          e.preventDefault();
          return;
        }
        startTransition(() => router.push(`/cart-overlay?add=${productId}`));
      }}
      aria-disabled={isDisabled}
    >
      <span
        className={cn(
          'transition-opacity ease-in',
          pending ? 'opacity-0' : 'opacity-100',
        )}
      >
        {disabled ? 'Out of Stock' : 'Add to Cart'}
      </span>
      <span
        className={cn(
          'pointer-events-none absolute z-10 transition-opacity ease-out',
          pending ? 'opacity-100' : 'opacity-0',
        )}
      >
        <Loader2Icon className="h-4 w-4 animate-spin" />
      </span>
    </Button>
  );
};
