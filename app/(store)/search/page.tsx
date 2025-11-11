import { env } from '@/env';
import { searchProducts } from '@/lib/api';
import { ProductList } from '@/ui/products/product-list';
import { ProductNotFound } from '@/ui/products/product-not-found';
import { RedirectType, redirect } from 'next/navigation';
import type { Metadata } from 'next/types';
import { SearchTracker } from './search-tracker';

export const generateMetadata = async (props: {
  searchParams: Promise<{
    q?: string;
  }>;
}): Promise<Metadata> => {
  const searchParams = await props.searchParams;
  return {
    title: `Search: ${searchParams.q} · The Store`,
    alternates: { canonical: `${env.NEXT_PUBLIC_URL}/search` },
  };
};

const SearchPage = async (props: {
  searchParams: Promise<{
    q?: string;
  }>;
}) => {
  const searchParams = await props.searchParams;
  const query = searchParams.q;

  if (!query) {
    return redirect('/', RedirectType.replace);
  }

  const products = await searchProducts(query);

  return (
    <main>
      <SearchTracker query={query} results={products} />
      <h1 className="text-foreground text-3xl leading-none font-bold tracking-tight">
        {`Searching for "${query}"`}
      </h1>
      {products?.length ?
        <ProductList products={products} />
      : <ProductNotFound query={query} />}
    </main>
  );
};

export default SearchPage;
