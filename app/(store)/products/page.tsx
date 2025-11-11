import { env } from '@/env';
import { ProductList } from '@/ui/products/product-list';
import { productBrowse } from 'commerce-kit';
import type { Metadata } from 'next/types';

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: 'All Products · The Store',
    alternates: { canonical: `${env.NEXT_PUBLIC_URL}/products` },
  };
};

const AllProductsPage = async () => {
  const products = await productBrowse({ first: 100 });

  return (
    <main className="pb-8">
      <h1 className="text-foreground text-3xl leading-none font-bold tracking-tight">
        All Products
      </h1>
      <ProductList products={products} />
    </main>
  );
};

export default AllProductsPage;
