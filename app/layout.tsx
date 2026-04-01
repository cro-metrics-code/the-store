import '@/app/globals.css';
import { env } from '@/env';
// import { getServerBootstrapData } from '@/lib/getServerBootstrapData';
// import { PHProvider } from '@/lib/posthog-provider';
import { Toaster } from '@/ui/shadcn/sonner';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { type Metadata } from 'next';
import Script from 'next/script';
import type { ReactNode } from 'react';
import localFont from 'next/font/local';

const satoshi = localFont({
  display: 'swap',
  src: './fonts/Satoshi-Variable.woff2',
  weight: '300 900',
  variable: '--font-satoshi',
});

export const generateMetadata = async (): Promise<Metadata> => ({
  title: 'The Store - Best Store in the Universe',
  description: 'A demo e-commerce store for testing stuff',
  metadataBase: new URL(env.NEXT_PUBLIC_URL),
});

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = async ({ children }: RootLayoutProps) => {
  // const bootstrapData = await getServerBootstrapData();

  return (
    <html className={`h-full antialiased ${satoshi.variable}`} lang="en">
      <head>
        <Script
          src="https://cdn.optimizely.com/js/5676359352057856.js"
          strategy="beforeInteractive"
        />
      </head>
      {/* <PHProvider bootstrapData={bootstrapData}> */}
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
      {/* </PHProvider> */}
    </html>
  );
};

export default RootLayout;
