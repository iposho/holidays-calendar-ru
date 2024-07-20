import { ReactNode } from 'react';

import '../styles/global.scss';

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

export default Layout;
