import MDX from '@next/mdx';
import type { NextConfig } from 'next/types';

import './env';

const withMDX = MDX();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  reactCompiler: true,
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
  // Add PostHog rewrites
  async rewrites() {
    return [
      {
        source: '/ph-collect/static/:path*',
        destination: 'https://us-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ph-collect/:path*',
        destination: 'https://us.i.posthog.com/:path*',
      },
    ];
  },
  // Required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
};

export default withMDX(nextConfig);
