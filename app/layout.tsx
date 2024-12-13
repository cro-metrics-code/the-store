import '@/app/globals.css';
import { env } from '@/env/client';
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
        <div
          className="flex min-h-full flex-1 flex-col bg-white"
          vaul-drawer-wrapper=""
        >
          {children}
        </div>
        <Toaster position="top-center" offset={10} />
        <SpeedInsights />
        <Analytics />
        <Script
          src="https://try.abtasty.com/de992a16d6c9353eca657be611b9eb31.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
