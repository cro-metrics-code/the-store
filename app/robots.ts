import { env } from '@/env';
import type { MetadataRoute } from 'next';

const Robots = (): MetadataRoute.Robots => ({
  rules: {
    userAgent: '*',
    allow: '/',
  },
  sitemap: `${env.NEXT_PUBLIC_URL}/sitemap.xml`,
});

export default Robots;
