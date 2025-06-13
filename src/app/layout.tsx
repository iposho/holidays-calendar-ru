import { ReactNode } from 'react';
import { Metadata } from 'next';

import { IBM_Plex_Sans } from 'next/font/google';

import { Analytics } from '@vercel/analytics/react';
import { Metrika } from '@/components/metrika';

import '@/styles/global.scss';

interface LayoutProps {
  children: ReactNode;
}

export const metadata: Metadata = {
  title: 'Производственный календарь РФ API',
  description: 'Производственные календари РФ (2023—2025) в формате JSON. Простой API для получения данных.',
  metadataBase: new URL('https://calendar.kuzyak.in'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    siteName: 'Производственный календарь РФ API',
    url: new URL('https://calendar.kuzyak.in'),
    type: 'website',
    images: [new URL('/opengraph-image.png', 'https://calendar.kuzyak.in')],
    title: 'Производственный календарь РФ API',
    description: 'Производственные календари РФ (2023—2025) в формате JSON. Простой API для получения данных.',
  },
  verification: {
    yandex: 'a52f1210dfd6f94c',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'Cache-Control': 'public, max-age=31536000, immutable',
  },
};

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

const isProduction = process.env.NODE_ENV === 'production';

function Layout({ children }: LayoutProps) {
  return (
    <html lang="en" className={ibmPlexSans.className}>
      <body>{children}</body>
      {
        isProduction
        && (
          <>
            <Analytics />
            <Metrika />
          </>
        )
      }
    </html>
  );
}

export default Layout;
