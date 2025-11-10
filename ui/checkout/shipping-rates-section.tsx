import { cn, formatMoney } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/ui/shadcn/radio-group';
import type * as Commerce from 'commerce-kit';
import { useOptimistic, useTransition } from 'react';
import type Stripe from 'stripe';

export const ShippingRatesSection = ({
  shippingRates,
  value,
  onChange,
}: {
  shippingRates: Commerce.MappedShippingRate[];
  value: string | null | undefined;
  onChange: (value: string) => void;
}) => {
  const [isTransitioning, transition] = useTransition();
  const [optimisticValue, setOptimisticValue] = useOptimistic(value);
  const isPending = isTransitioning || optimisticValue !== value;

  return (
    <fieldset
      className={cn('grid gap-6 rounded-lg', { 'cursor-wait': isPending })}
    >
      <legend className="mb-2 text-sm font-medium whitespace-nowrap">
        Shipping method
      </legend>
      <RadioGroup
        className="xxs:grid-cols-3 grid max-w-md gap-4"
        value={optimisticValue ?? undefined}
        onValueChange={(newValue) => {
          transition(() => {
            setOptimisticValue(newValue);
            return onChange(newValue);
          });
        }}
      >
        {shippingRates.map((rate) => (
          <label
            key={rate.id}
            className={cn(
              'border-muted grid content-end items-end rounded-md border-2 px-2 py-2 transition-colors',
              `has-aria-checked:border-foreground/60`,
              isPending ? 'cursor-wait' : 'cursor-pointer hover:bg-neutral-50',
            )}
          >
            <RadioGroupItem value={rate.id} className="sr-only" />
            <p className="text-sm font-medium">{rate.display_name}</p>
            {rate.delivery_estimate && (
              <p className="text-muted-foreground text-xs">
                <FormatDeliveryEstimate estimate={rate.delivery_estimate} />
              </p>
            )}
            {rate.fixed_amount && (
              <p className="mt-0.5">
                {formatMoney({
                  amount: rate.fixed_amount.amount,
                  currency: rate.fixed_amount.currency,
                })}
              </p>
            )}
          </label>
        ))}
      </RadioGroup>
    </fieldset>
  );
};

export const FormatDeliveryEstimate = ({
  estimate,
}: {
  estimate: Commerce.MappedShippingRate['delivery_estimate'];
}) => {
  if (!estimate?.minimum && !estimate?.maximum) {
    return null;
  }

  if (estimate.minimum && !estimate.maximum) {
    return `At least ${deliveryUnitToText(estimate.minimum.value, estimate.minimum.unit)}`;
  }

  if (!estimate.minimum && estimate.maximum) {
    return `Up to ${deliveryUnitToText(estimate.maximum.value, estimate.maximum.unit)}`;
  }

  if (estimate.minimum && estimate.maximum) {
    if (estimate.minimum.value === estimate.maximum.value) {
      return deliveryUnitToText(estimate.minimum.value, estimate.minimum.unit);
    }

    if (estimate.minimum.unit === estimate.maximum.unit) {
      return `${estimate.minimum.value}–${deliveryUnitToText(estimate.maximum.value, estimate.maximum.unit)}`;
    }

    return `${deliveryUnitToText(estimate.minimum.value, estimate.minimum.unit)} – ${deliveryUnitToText(estimate.maximum.value, estimate.maximum.unit)}`;
  }

  return null;
};

const deliveryUnitToText = (
  value: number,
  unit:
    | Stripe.ShippingRate.DeliveryEstimate.Maximum.Unit
    | Stripe.ShippingRate.DeliveryEstimate.Minimum.Unit,
) => {
  switch (unit) {
    case 'business_day':
      return `${value} business ${value === 1 ? 'day' : 'days'}`;
    case 'day':
      return `${value} ${value === 1 ? 'day' : 'days'}`;
    case 'hour':
      return `${value} ${value === 1 ? 'hour' : 'hours'}`;
    case 'month':
      return `${value} ${value === 1 ? 'month' : 'months'}`;
    case 'week':
      return `${value} ${value === 1 ? 'week' : 'weeks'}`;
  }
};
