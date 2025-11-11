import '@/app/globals.css';
import { env } from '@/env';
import { getServerBootstrapData } from '@/lib/getServerBootstrapData';
import { PHProvider } from '@/lib/posthog-provider';
import { Toaster } from '@/ui/shadcn/sonner';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const generateMetadata = async (): Promise<Metadata> => ({
  title: 'The Store - Best Store in the Universe',
  description: 'A demo e-commerce store for testing stuff',
  metadataBase: new URL(env.NEXT_PUBLIC_URL),
});

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = async ({ children }: RootLayoutProps) => {
  const bootstrapData = await getServerBootstrapData();

  return (
    <html lang="en" className="h-full antialiased">
      <PHProvider bootstrapData={bootstrapData}>
        <body className="flex min-h-full flex-col">
          <div
            className="flex min-h-full flex-1 flex-col bg-white"
            vaul-drawer-wrapper=""
          >
            {children}
          </div>
          <Toaster position="top-center" offset={10} />
          <SpeedInsights />
          <Analytics />
        </body>
      </PHProvider>
    </html>
  );
};

export default RootLayout;
