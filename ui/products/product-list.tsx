import { formatMoney } from '@/lib/utils';
import { JsonLd, mappedProductsToJsonLd } from '@/ui/json-ld';
import { PrefetchLink } from '@/ui/prefetch-link';
import type { MappedProduct } from 'commerce-kit';
import Image from 'next/image';

export const ProductList = async ({
  products,
}: {
  products: MappedProduct[];
}) => (
  <>
    <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product, idx) => {
        return (
          <li key={product.id} className="group">
            <PrefetchLink href={`/product/${product.metadata.slug}`}>
              <article className="overflow-hidden rounded border bg-white">
                {product.images[0] && (
                  <div className="aspect-square w-full overflow-hidden bg-neutral-100">
                    <Image
                      className="group-hover:rotate hover-perspective w-full bg-neutral-100 object-cover object-center transition-opacity group-hover:opacity-75"
                      src={product.images[0]}
                      width={768}
                      height={768}
                      loading={idx < 3 ? 'eager' : 'lazy'}
                      priority={idx < 3}
                      sizes="(max-width: 1024x) 100vw, (max-width: 1280px) 50vw, 700px"
                      alt={product.name}
                    />
                  </div>
                )}
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-neutral-700">
                    {product.name}
                  </h2>
                  <footer className="text-sm font-medium text-neutral-900">
                    {product.default_price.unit_amount && (
                      <p>
                        {formatMoney({
                          amount: product.default_price.unit_amount,
                          currency: product.default_price.currency,
                        })}
                      </p>
                    )}
                  </footer>
                </div>
              </article>
            </PrefetchLink>
          </li>
        );
      })}
    </ul>
    <JsonLd jsonLd={mappedProductsToJsonLd(products)} />
  </>
);
