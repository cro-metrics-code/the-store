import { env } from '@/env';

import { cn, deslugify, formatMoney, formatProductName } from '@/lib/utils';

import { AddToCartButton } from '@/ui/add-to-cart-button';
import { JsonLd, mappedProductToJsonLd } from '@/ui/json-ld';
import { Markdown } from '@/ui/markdown';
import { PrefetchLink } from '@/ui/prefetch-link';
import { MainProductImage } from '@/ui/products/main-product-image';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/ui/shadcn/breadcrumb';
import { StickyBottom } from '@/ui/sticky-bottom';
import { productGet } from 'commerce-kit';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next/types';
import { ProductViewedTracker } from './product-viewed-tracker';

export const generateMetadata = async (props: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ variant?: string }>;
}): Promise<Metadata> => {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const variants = await productGet({ slug: params.slug });

  const selectedVariant = searchParams.variant || variants[0]?.metadata.variant;
  const product = variants.find(
    (variant) => variant.metadata.variant === selectedVariant,
  );
  if (!product) {
    return notFound();
  }

  const canonical = new URL(
    `${env.NEXT_PUBLIC_URL}/product/${product.metadata.slug}`,
  );
  if (selectedVariant) {
    canonical.searchParams.set('variant', selectedVariant);
  }

  const productName = formatProductName(product.name, product.metadata.variant);

  return {
    title: `${productName} · The Store`,
    description: product.description,
    alternates: { canonical },
  } satisfies Metadata;
};

interface SingleProductPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ variant?: string }>;
}

const SingleProductPage = async (props: SingleProductPageProps) => {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const variants = await productGet({ slug: params.slug });
  const selectedVariant = searchParams.variant || variants[0]?.metadata.variant;
  const product = variants.find(
    (variant) => variant.metadata.variant === selectedVariant,
  );

  if (!product) {
    return notFound();
  }

  const category = product.metadata.category;

  return (
    <article className="pb-12">
      <ProductViewedTracker product={product} />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              asChild
              className="inline-flex min-h-12 min-w-12 items-center justify-center"
            >
              <PrefetchLink href="/products">All Products</PrefetchLink>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {category && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  className="inline-flex min-h-12 min-w-12 items-center justify-center"
                  asChild
                >
                  <PrefetchLink href={`/category/${category}`}>
                    {deslugify(category)}
                  </PrefetchLink>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
          {selectedVariant && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{deslugify(selectedVariant)}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>

      <StickyBottom product={product}>
        <div className="mt-4 grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-5 lg:col-start-8">
            <h1 className="text-foreground text-3xl leading-none font-bold tracking-tight">
              {product.name}
            </h1>
            {product.default_price.unit_amount && (
              <p className="text-foreground/70 mt-2 text-2xl leading-none font-medium tracking-tight">
                {formatMoney({
                  amount: product.default_price.unit_amount,
                  currency: product.default_price.currency,
                })}
              </p>
            )}
            <div className="mt-2">
              {product.metadata.stock <= 0 && <div>Out of stock</div>}
            </div>
          </div>

          <div className="lg:col-span-7 lg:row-span-3 lg:row-start-1">
            <h2 className="sr-only">Images</h2>

            <div className="grid gap-4 lg:grid-cols-3 [&>*:first-child]:col-span-3">
              {product.images.map((image, idx) =>
                idx === 0 && !product.metadata.preview ?
                  <MainProductImage
                    key={image}
                    className="w-full rounded-lg bg-neutral-100 object-cover object-center transition-opacity"
                    src={image}
                    loading="eager"
                    priority
                    alt=""
                  />
                : <Image
                    key={image}
                    className="w-full rounded-lg bg-neutral-100 object-cover object-center transition-opacity"
                    src={image}
                    width={700 / 3}
                    height={700 / 3}
                    sizes="(max-width: 1024x) 33vw, (max-width: 1280px) 20vw, 225px"
                    loading="eager"
                    priority
                    alt=""
                  />,
              )}
            </div>
          </div>

          <div className="grid gap-8 lg:col-span-5">
            <section>
              <h2 className="sr-only">Description</h2>
              <div className="prose text-secondary-foreground">
                <Markdown source={product.description || ''} />
              </div>
            </section>

            {variants.length > 1 && (
              <div className="grid gap-2">
                <p className="text-base font-medium" id="variant-label">
                  Variant
                </p>
                <ul
                  className="grid grid-cols-3 gap-2"
                  aria-labelledby="variant-label"
                >
                  {variants.map((variant) => {
                    const isSelected =
                      selectedVariant === variant.metadata.variant;
                    return (
                      variant.metadata.variant && (
                        <li key={variant.id}>
                          <PrefetchLink
                            scroll={false}
                            prefetch={true}
                            href={`/product/${variant.metadata.slug}?variant=${variant.metadata.variant}`}
                            className={cn(
                              'flex h-16.5 cursor-pointer items-center justify-center gap-2 rounded-md border p-2 text-center transition-colors hover:bg-neutral-100',
                              isSelected &&
                                'border-black bg-neutral-50 font-medium',
                            )}
                            aria-selected={isSelected}
                          >
                            {deslugify(variant.metadata.variant)}
                          </PrefetchLink>
                        </li>
                      )
                    );
                  })}
                </ul>
              </div>
            )}

            <AddToCartButton
              productId={product.id}
              disabled={product.metadata.stock <= 0}
            />
          </div>
        </div>
      </StickyBottom>
      <JsonLd jsonLd={mappedProductToJsonLd(product)} />
    </article>
  );
};

export default SingleProductPage;
