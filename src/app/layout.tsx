import { ReactNode } from 'react';
import { Metadata } from 'next';

import '../styles/global.scss';

interface LayoutProps {
  children: ReactNode;
}

export const metadata: Metadata = {
  title: 'Производственный календарь',
};

function Layout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

export default Layout;
