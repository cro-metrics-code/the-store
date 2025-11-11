import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const isDefined = <T>(value: T | null | undefined): value is T =>
  value !== null && value !== undefined;

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const safeJsonParse = (str: string | null | undefined) => {
  if (str === null || str === undefined) {
    return null;
  }
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
};

type PromiseToTupleResult<T> = [Error, null] | [null, Awaited<T>];

export const unpackPromise = async <T extends Promise<unknown>>(
  promise: T,
): Promise<PromiseToTupleResult<T>> => {
  try {
    const result = await promise;
    return [null, result];
  } catch (maybeError) {
    const error =
      maybeError instanceof Error ? maybeError : new Error(String(maybeError));
    return [error, null];
  }
};

export const capitalize = (str: string) =>
  str[0] ? str[0].toUpperCase() + str.slice(1) : '';

export const deslugify = (slug: string) => {
  return slug
    .split('-')
    .map((part) => capitalize(part))
    .join(' ');
};

export const formatProductName = (name: string, variant?: string) => {
  if (!variant) {
    return name;
  }
  return `${name} (${deslugify(variant)})`;
};

type ShippingRate = {
  fixed_amount?: {
    amount?: number;
  };
} | null;

interface Cart {
  cart: {
    amount: number;
    metadata?: {
      taxCalculationId?: string;
    };
  };
  lines: {
    product: {
      default_price?: {
        unit_amount?: number | null;
      };
    };
    quantity: number;
  }[];
  shippingRate?: ShippingRate;
}

export const calculateCartTotalPossiblyWithTax = (fullCart: Cart) => {
  const {
    cart: { amount, metadata },
    shippingRate,
  } = fullCart;
  if (metadata?.taxCalculationId) {
    return amount;
  }

  return (
    (shippingRate?.fixed_amount?.amount ?? 0) +
    calculateCartTotalNetWithoutShipping(fullCart)
  );
};

export const calculateCartTotalNetWithoutShipping = (cart: Cart) =>
  cart.lines.reduce(
    (total, { product: { default_price }, quantity }) =>
      total + (default_price?.unit_amount ?? 0) * quantity,
    0,
  );

interface Money {
  amount: number;
  currency: string;
}

export function invariant(
  condition: unknown,
  message: string,
): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

export const assertInteger = (value: number) => {
  invariant(Number.isInteger(value), 'Value must be an integer');
};

// https://docs.stripe.com/development-resources/currency-codes
const stripeCurrencies: Record<string, number> = {
  BIF: 0,
  CLP: 0,
  DJF: 0,
  GNF: 0,
  JPY: 0,
  KMF: 0,
  KRW: 0,
  MGA: 0,
  PYG: 0,
  RWF: 0,
  UGX: 0,
  VND: 0,
  VUV: 0,
  XAF: 0,
  XOF: 0,
  XPF: 0,
  BHD: 3,
  JOD: 3,
  KWD: 3,
  OMR: 3,
  TND: 3,
};

const getDecimalsForStripe = (currency: string) => {
  invariant(currency.length === 3, 'currency needs to be a 3-letter code');
  return stripeCurrencies[currency.toUpperCase()] ?? 2;
};

export const getDecimalFromStripeAmount = (
  amount: number,
  currency: string,
) => {
  assertInteger(amount);
  const decimals = getDecimalsForStripe(currency);
  const multiplier = 10 ** decimals;
  return Number.parseFloat((amount / multiplier).toFixed(decimals));
};

export const formatMoney = ({
  amount,
  currency,
  locale = 'en-US',
}: Money & { locale?: string }) =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(getDecimalFromStripeAmount(amount, currency));
