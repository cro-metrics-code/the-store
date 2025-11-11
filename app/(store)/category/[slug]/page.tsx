import { env } from '@/env';
import { deslugify } from '@/lib/utils';
import { ProductList } from '@/ui/products/product-list';
import { productBrowse } from 'commerce-kit';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next/types';

export const generateMetadata = async (props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
  const params = await props.params;
  const products = await productBrowse({
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

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

const CategoryPage = async (props: CategoryPageProps) => {
  const params = await props.params;
  const products = await productBrowse({
    first: 100,
    filter: { category: params.slug },
  });

  if (products.length === 0) {
    return notFound();
  }

  return (
    <main className="pb-8">
      <h1 className="text-foreground text-3xl leading-none font-bold tracking-tight">
        {deslugify(params.slug)}
        <div className="text-muted-foreground text-lg font-semibold">
          Category
        </div>
      </h1>
      <ProductList products={products} />
    </main>
  );
};

export default CategoryPage;
