'use client';

import { useState, useEffect } from 'react';

import defaultScreens from 'tailwindcss/defaultTheme';
import resolveConfig from 'tailwindcss/resolveConfig';
import type { KeyValuePair } from 'tailwindcss/types/config.js';

import tailwindConfig from '@/tailwind.config';

const fullConfig = resolveConfig(tailwindConfig);

type Screens = KeyValuePair<string, string>;

const screens: Screens = (fullConfig.theme?.screens ||
  defaultScreens) as Screens;

export const useBreakpoint = (
  breakpoint: keyof typeof defaultScreens,
  defaultValue = false,
) => {
  const [match, setMatch] = useState(defaultValue);

  useEffect(() => {
    if (!('matchMedia' in window)) return undefined;

    const query = window.matchMedia(`(min-width: ${screens[breakpoint]})`);

    const handler = () => {
      if (query.matches !== match) {
        setMatch(query.matches);
      }
    };

    handler();
    query.addEventListener('change', handler);
    return () => {
      query.removeEventListener('change', handler);
    };
  });

  return match;
};
