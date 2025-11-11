import { productBrowse } from 'commerce-kit';
import { unstable_cache } from 'next/cache';
import { simpleSearch } from './simple-search';

export const searchProducts = unstable_cache(
  async (query: string) => {
    const products = await productBrowse({ first: 100 });
    const searchResults = simpleSearch(products, query);
    return searchResults
      .map((sr) => products.find((p) => p.id === sr.id))
      .filter(Boolean);
  },
  ['search', 'products'],
  {
    tags: ['search', 'products'],
  },
);
