import '@/app/globals.css';
// import { AmplitudeContextProvider } from '@/context/AmplitudeContext';
import { env } from '@/env/client';
// import { PageVisitTracker } from '@/lib/analytics/PageVisitTracker';
import { Toaster } from '@/ui/shadcn/sonner';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import Script from 'next/script';
import type { ReactNode } from 'react';

export const generateMetadata = async (): Promise<Metadata> => ({
  title: 'The Store - Best Store in the Universe',
  description: 'A demo e-commerce store for testing stuff',
  metadataBase: new URL(env.NEXT_PUBLIC_URL),
});

export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        {/* <AmplitudeContextProvider> */}
        {/* <PageVisitTracker /> */}
        <div
          className="flex min-h-full flex-1 flex-col bg-white"
          vaul-drawer-wrapper=""
        >
          {children}
        </div>
        <Toaster position="top-center" offset={10} />
        {/* </AmplitudeContextProvider> */}
        <Script
          src={`https://cdn.amplitude.com/script/${env.NEXT_PUBLIC_AMPLITUDE_API_KEY}.experiment.js`}
          strategy="beforeInteractive"
        />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
