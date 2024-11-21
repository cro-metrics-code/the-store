'use client';
import { useContext } from 'react';
import { AmplitudeContext } from '@/context/AmplitudeContext';

export const TestHeadlines = () => {
  const contextData = useContext(AmplitudeContext);
  const variant = contextData?.experiment.variant('sample-feature-experiment');

  return (
    <>
      <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
        {variant?.value === 'on' ?
          'Discover our Curated Collection'
        : 'Discover our Beautiful Collection'}
      </h2>
      <p className="text-pretty text-neutral-600">
        Explore our carefully selected products for your home and lifestyle.
      </p>
    </>
  );
};
