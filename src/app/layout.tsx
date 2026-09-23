import { ReactNode } from 'react';
import { Metadata } from 'next';

import { Inter, JetBrains_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { Metrika } from '@/components/metrika';

import '@/styles/tailwind.css';

interface LayoutProps {
  children: ReactNode;
}

export const metadata: Metadata = {
  title: 'Производственный календарь РФ API',
  description: 'Производственные календари РФ (2023—2026) в формате JSON. Простой API для получения данных.',
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
    description: 'Производственные календари РФ (2023—2026) в формате JSON. Простой API для получения данных.',
  },
  verification: {
    yandex: 'a52f1210dfd6f94c',
  },
};

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

const isProduction = process.env.NODE_ENV === 'production';

function Layout({ children }: LayoutProps) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">{children}</body>
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
