// 'use client';

import dynamicImport from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';
import { CACHE_CONFIG } from '@/config/cache';

const SwaggerUI = dynamicImport(() => import('swagger-ui-react'), { ssr: false });

export const dynamic = 'force-static';
export const revalidate = CACHE_CONFIG.DEFAULT_REVALIDATE;

export default function SwaggerPage() {
  const swaggerUrl = '/swagger.json'; // Path to static file

  return (
    <div style={{ height: '100vh', margin: '0 auto', padding: '1rem' }}>
      <SwaggerUI url={swaggerUrl} />
    </div>
  );
}
