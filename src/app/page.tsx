import React from 'react';
import { HeroSection } from '@/components/hero-section';
import { FeaturesSection } from '@/components/features-section';
import { ApiEndpoints } from '@/components/api-endpoints';
import { CodePreview } from '@/components/code-preview';
import { Footer } from '@/components/footer';
import packageJson from '../../package.json';

export const dynamic = 'force-static';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <main>
        <HeroSection />
        <FeaturesSection />
        <CodePreview />
        <ApiEndpoints />
      </main>

      <Footer version={packageJson?.version} />
    </div>
  );
}
