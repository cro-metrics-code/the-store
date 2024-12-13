import { env } from '../../../../env/client';
import { deslugify } from '@/lib/utils';
import { ProductList } from '@/ui/products/product-list';
import * as Commerce from 'commerce-kit';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next/types';

export const generateMetadata = async (props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
  const params = await props.params;
  const products = await Commerce.productBrowse({
    first: 100,
    filter: { category: params.slug },
  });

  if (products.length === 0) {
    return notFound();
  }

  return {
    title: `${deslugify(params.slug)} Category · The Store`,
    alternates: { canonical: `${env.NEXT_PUBLIC_URL}/category/${params.slug}` },
  };
};

export default async function CategoryPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const products = await Commerce.productBrowse({
    first: 100,
    filter: { category: params.slug },
  });

  if (products.length === 0) {
    return notFound();
  }

  return (
    <main className="pb-8">
      <h1 className="text-3xl font-bold leading-none tracking-tight text-foreground">
        {deslugify(params.slug)}
        <div className="text-lg font-semibold text-muted-foreground">
          Category
        </div>
      </h1>
      <ProductList products={products} />
    </main>
  );
}
