'use client';

import { useEffect, useState } from 'react';
import defaultScreens from 'tailwindcss/defaultTheme';

type Screens = typeof defaultScreens.screens;

const screens: Screens = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export const useBreakpoint = (
  breakpoint: keyof typeof screens,
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
