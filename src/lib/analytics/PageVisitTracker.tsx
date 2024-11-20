'use client';

import { useAmplitudeContext } from '@/hooks/useAmplitudeContext';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export const PageVisitTracker = () => {
  const pathname = usePathname();
  const { trackEvent } = useAmplitudeContext();

  useEffect(() => {
    trackEvent('Visit page', { pathname });
  }, [trackEvent, pathname]);

  return null;
};
