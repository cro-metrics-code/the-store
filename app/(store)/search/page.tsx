import { env } from '../../../env/client';
import { Search } from '@/lib/api';
import { ProductList } from '@/ui/products/product-list';
import { ProductNotFound } from '@/ui/products/product-not-found';
import { RedirectType, redirect } from 'next/navigation';
import type { Metadata } from 'next/types';

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

export default async function SearchPage(props: {
  searchParams: Promise<{
    q?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams.q;

  if (!query) {
    return redirect('/', RedirectType.replace);
  }

  const products = await Search.searchProducts(query);

  return (
    <main>
      <h1 className="text-3xl font-bold leading-none tracking-tight text-foreground">
        {`Searching for "${query}"`}
      </h1>
      {products?.length ?
        <ProductList products={products} />
      : <ProductNotFound query={query} />}
    </main>
  );
}
