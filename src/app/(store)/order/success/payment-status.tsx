import { Badge } from '@/ui/shadcn/badge';
import type { PaymentIntent } from '@stripe/stripe-js';
import type { ComponentProps } from 'react';

export const PaymentStatus = async ({
  status,
}: {
  status: PaymentIntent.Status;
}) => {
  const statusToVariant = {
    canceled: 'destructive',
    processing: 'secondary',
    requires_action: 'destructive',
    requires_capture: 'destructive',
    requires_confirmation: 'destructive',
    requires_payment_method: 'destructive',
    succeeded: 'default',
  } satisfies Record<
    PaymentIntent.Status,
    ComponentProps<typeof Badge>['variant']
  >;

  const statusMap = {
    canceled: 'canceled',
    processing: 'Processing',
    requires_action: 'Requires Action',
    requires_capture: 'Requires Capture',
    requires_confirmation: 'Requires Confirmation',
    requires_payment_method: 'Requires Payment Method',
    succeeded: 'Succeeded',
  } as const;

  return (
    <Badge className="ml-2 capitalize" variant={statusToVariant[status]}>
      {statusMap[status]}
    </Badge>
  );
};
