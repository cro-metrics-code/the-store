import { env } from '@/env';
import { productBrowse } from 'commerce-kit';
import type { MetadataRoute } from 'next';

const categories = [
  { name: 'Apparel', slug: 'apparel' },
  { name: 'Accessories', slug: 'accessories' },
];

type Item = MetadataRoute.Sitemap[number];

const Sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const products = await productBrowse({ first: 100 });

  const productUrls = products.map(
    ({ metadata, updated }) =>
      ({
        url: `${env.NEXT_PUBLIC_URL}/product/${metadata.slug}`,
        lastModified: new Date(updated * 1000),
        changeFrequency: 'daily',
        priority: 0.8,
      }) satisfies Item,
  );

  const categoryUrls = categories.map(
    ({ slug }) =>
      ({
        url: `${env.NEXT_PUBLIC_URL}/category/${slug}`,
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
};

export default Sitemap;
