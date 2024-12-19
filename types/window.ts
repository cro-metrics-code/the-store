import type {
  ABTastyClickTrackingFn,
  ABTastyStartTestFn,
  ABTastyReloadFn,
  UnlockABTastyFn,
  ABTasty,
  ABTastySend,
} from '@/types/abtasty';

declare global {
  interface Window {
    ABTasty: ABTasty;
    abtasty: ABTastySend;
    ABTastyClickTracking: ABTastyClickTrackingFn;
    ABTastyReload: ABTastyReloadFn;
    ABTastyStartTest: ABTastyStartTestFn;
    lockABTastyTag: boolean;
    unlockABTasty: UnlockABTastyFn;
    // Either it's a built in event...
    addEventListener<T extends keyof WindowEventMap>(
      type: T,
      listener: (event: WindowEventMap[T]) => void,
      options?: boolean | AddEventListenerOptions,
    ): void;
    // ... or it's a custom event ...
    addEventListener<C>(
      type: string,
      listener: (event: CustomEvent<C>) => void,
      options?: boolean | AddEventListenerOptions,
    ): void;

    removeEventListener<T>(
      type: string,
      listener: (event: CustomEvent<T>) => void,
    ): void;
  }
}
