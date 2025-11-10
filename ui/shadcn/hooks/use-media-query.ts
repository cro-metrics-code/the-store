import { useEffect, useState } from 'react';

export const useMediaQuery = (query: string) => {
  const [value, setValue] = useState(false);

  useEffect(() => {
    const onChange = (event: MediaQueryListEvent) => {
      setValue(event.matches);
    };

    const result = matchMedia(query);
    result.addEventListener('change', onChange);
    setTimeout(() => {
      setValue(result.matches);
    }, 0);

    return () => result.removeEventListener('change', onChange);
  }, [query]);

  return value;
};
