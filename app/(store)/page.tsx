import { env } from '@/env/client';
import AccessoriesImage from '@/images/accessories.jpg';
import ApparelImage from '@/images/apparel.jpg';
import { CategoryBox } from '@/ui/category-box';
import { PrefetchLink } from '@/ui/prefetch-link';
import { ProductList } from '@/ui/products/product-list';
import * as Commerce from 'commerce-kit';
import Image from 'next/image';
import type { Metadata } from 'next/types';

export const metadata = {
  alternates: { canonical: env.NEXT_PUBLIC_URL },
} satisfies Metadata;

export default async function Home() {
  const products = await Commerce.productBrowse({ first: 6 });

  return (
    <main>
      <section className="rounded bg-neutral-100 py-8 sm:py-12">
        <div className="mx-auto grid grid-cols-1 items-center justify-items-center gap-8 px-8 sm:px-16 md:grid-cols-2">
          <div className="max-w-md space-y-4">
            <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
              Discover our Curated Collection
            </h2>
            <p className="text-pretty text-neutral-600">
              Explore our carefully selected products for your home and
              lifestyle.
            </p>
            <PrefetchLink
              className="inline-flex h-10 items-center justify-center rounded-full bg-neutral-900 px-6 font-medium text-neutral-50 transition-colors hover:bg-neutral-900/90 focus:outline-none focus:ring-1 focus:ring-neutral-950"
              href="/category/accessories"
            >
              Shop Now
            </PrefetchLink>
          </div>
          <Image
            alt="WHAT!? Headphones"
            loading="eager"
            priority={true}
            className="rounded"
            height={450}
            width={450}
            src="https://files.stripe.com/links/MDB8YWNjdF8xT2h0c2dHUzhsNjk1YTBYfGZsX3Rlc3RfRFZxWXF0Sm03R0ZyWjZ6b2ZQU3JwUmJm00UgPN6U7P"
            style={{
              objectFit: 'cover',
            }}
            sizes="(max-width: 640px) 70vw, 450px"
          />
        </div>
      </section>

      <ProductList products={products} />

      <section className="w-full py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {[
            { categorySlug: 'accessories', src: AccessoriesImage },
            { categorySlug: 'apparel', src: ApparelImage },
          ].map(({ categorySlug, src }) => (
            <CategoryBox
              key={categorySlug}
              categorySlug={categorySlug}
              src={src}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
