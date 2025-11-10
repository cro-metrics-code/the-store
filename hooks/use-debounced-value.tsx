'use client';

import { useDeferredValue, useEffect, useState } from 'react';

export const useDebouncedValue = <T,>(value: T, delay = 300) => {
  const [isPending, setIsPending] = useState(false);
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const pendingTimeout = setTimeout(() => {
      setIsPending(true);
    }, 0);
    const handler = setTimeout(() => {
      setIsPending(false);
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(pendingTimeout);
      setIsPending(false);
      clearTimeout(handler);
    };
  }, [value, delay]);

  return [isPending, useDeferredValue(debouncedValue)] as const;
};
