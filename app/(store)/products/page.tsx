import { env } from '@/env/client';
import { ProductList } from '@/ui/products/product-list';
import * as Commerce from 'commerce-kit';
import type { Metadata } from 'next/types';

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: 'All Products · The Store',
    alternates: { canonical: `${env.NEXT_PUBLIC_URL}/products` },
  };
};

export default async function AllProductsPage() {
  const products = await Commerce.productBrowse({ first: 100 });

  return (
    <main className="pb-8">
      <h1 className="text-3xl font-bold leading-none tracking-tight text-foreground">
        All Products
      </h1>
      <ProductList products={products} />
    </main>
  );
}
