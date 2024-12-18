import { env } from '@/env/client';
import * as Commerce from 'commerce-kit';
import type { MetadataRoute } from 'next';

const Categories = [
  { name: 'Apparel', slug: 'apparel' },
  { name: 'Accessories', slug: 'accessories' },
];

type Item = MetadataRoute.Sitemap[number];
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await Commerce.productBrowse({ first: 100 });
  const productUrls = products.map(
    (product) =>
      ({
        url: `${env.NEXT_PUBLIC_URL}/product/${product.metadata.slug}`,
        lastModified: new Date(product.updated * 1000),
        changeFrequency: 'daily',
        priority: 0.8,
      }) satisfies Item,
  );

  const categoryUrls = Categories.map(
    (category) =>
      ({
        url: `${env.NEXT_PUBLIC_URL}/category/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.5,
      }) satisfies Item,
  );

  return [
    {
      url: env.NEXT_PUBLIC_URL,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1,
    },
    ...productUrls,
    ...categoryUrls,
  ];
}
