// 'use client';

import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function SwaggerPage() {
  const swaggerUrl = '/swagger.json'; // Path to static file

  return (
    <div style={{ height: '100vh', margin: '0 auto', padding: '1rem' }}>
      <SwaggerUI url={swaggerUrl} />
    </div>
  );
}
