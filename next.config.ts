import MDX from '@next/mdx';
import type { NextConfig } from 'next/types';

import './env/server';
import './env/client';

const withMDX = MDX();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: process.env.DOCKER ? 'standalone' : undefined,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    remotePatterns: [
      { hostname: 'files.stripe.com' },
      { hostname: 'd1wqzb5bdbcre6.cloudfront.net' },
      { hostname: '*.blob.vercel-storage.com' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  transpilePackages: ['next-mdx-remote', 'commerce-kit'],
  experimental: {
    mdxRs: true,
  },
  rewrites: async () => [
    {
      source: '/stats/:match*',
      destination: 'https://eu.umami.is/:match*',
    },
  ],
};

export default withMDX(nextConfig);
