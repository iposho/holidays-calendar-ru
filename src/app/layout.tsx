import { ReactNode } from 'react';
import { Metadata } from 'next';

import { IBM_Plex_Sans } from 'next/font/google';

import { Analytics } from '@vercel/analytics/react';

import '@/styles/global.scss';

interface LayoutProps {
  children: ReactNode;
}

export const metadata: Metadata = {
  title: 'Производственный календарь API',
  description: 'Производственные календари РФ (2023—2025) в формате JSON. Простой API для получения данных.',
  metadataBase: new URL('https://calendar.kuzyak.in'),
  openGraph: {
    url: new URL('https://calendar.kuzyak.in'),
    type: 'website',
  },
};

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

function Layout({ children }: LayoutProps) {
  return (
    <html lang="en" className={ibmPlexSans.className}>
      <body>{children}</body>
      <Analytics />
    </html>
  );
}

export default Layout;
