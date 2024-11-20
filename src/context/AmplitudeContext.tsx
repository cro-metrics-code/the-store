'use client';
import { env } from '@/env/client';
import { init, setUserId, track } from '@amplitude/analytics-browser';
import { type ReactNode, createContext, useEffect } from 'react';

export interface AmplitudeContextState {
  setUser: (id: string) => void;
  trackEvent: (name: string, data?: Record<string, unknown>) => void;
}

export const AmplitudeContext = createContext<
  AmplitudeContextState | undefined
>(undefined);

interface AmplitudeContextProviderProps {
  readonly children: ReactNode;
}

export const AmplitudeContextProvider = ({
  children,
}: AmplitudeContextProviderProps) => {
  useEffect(() => {
    init(env.NEXT_PUBLIC_AMPLITUDE_API_KEY, undefined, {
      autocapture: true,
    });
  }, []);

  return (
    <AmplitudeContext.Provider
      value={{
        setUser: (id) => {
          setUserId(id);
        },
        trackEvent: (name, data) => {
          track(name, data);
        },
      }}
    >
      {children}
    </AmplitudeContext.Provider>
  );
};
