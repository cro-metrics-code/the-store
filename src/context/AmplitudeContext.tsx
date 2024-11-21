'use client';
import { env } from '@/env/client';
import { init, setUserId, track } from '@amplitude/analytics-browser';
import { Experiment, ExperimentClient } from '@amplitude/experiment-js-client';
import { type ReactNode, createContext, useEffect } from 'react';

export interface AmplitudeContextState {
  setUser: (id: string) => void;
  trackEvent: (name: string, data?: Record<string, unknown>) => void;
  experiment: ExperimentClient;
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
  const experiment = Experiment.initializeWithAmplitudeAnalytics(
    env.NEXT_PUBLIC_SANDBOX_API_KEY,
  );
  useEffect(() => {
    init(env.NEXT_PUBLIC_AMPLITUDE_API_KEY, undefined, {
      autocapture: true,
    });

    const startSDK = async () => {
      await experiment.start();
    };

    startSDK();
  }, [experiment]);

  return (
    <AmplitudeContext.Provider
      value={{
        setUser: (id) => {
          setUserId(id);
        },
        trackEvent: (name, data) => {
          track(name, data);
        },
        experiment,
      }}
    >
      {children}
    </AmplitudeContext.Provider>
  );
};
