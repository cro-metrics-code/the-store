'use client';

import { useEffect } from 'react';
import { cookieExists } from '@/lib/cookie';
interface SuccessSideEffectsProps {
  id: string;
  revenue: number;
  count: number;
}

export const SuccessSideEffects = ({
  id,
  revenue,
  count,
}: SuccessSideEffectsProps) => {
  useEffect(() => {
    if (cookieExists('clientSideRevenue')) return;

    function removeListeners() {
      window.removeEventListener(
        'abtasty_trackingInitialized',
        sendTransaction,
      );
      document.removeEventListener(
        'abtasty_resetActionTracking',
        removeListeners,
      );
    }

    function sendTransaction() {
      window.abtasty!.send('transaction', {
        icn: count, //Number of items
        ta: 'Purchase',
        tc: 'USD',
        tid: id, //Transaction ID
        tr: revenue / 100, //Transaction Revenue
      });

      removeListeners();
    }

    if (
      window?.ABTasty?.eventState?.trackingInitialized?.status === 'complete'
    ) {
      sendTransaction();
    } else {
      window.addEventListener('abtasty_trackingInitialized', sendTransaction);
      document.addEventListener('abtasty_resetActionTracking', removeListeners);
    }

    return () => {
      removeListeners();
    };
  }, [id, revenue, count]);

  return null;
};
