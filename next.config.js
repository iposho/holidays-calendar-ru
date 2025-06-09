/** @type {import('next').NextConfig} */

// https://nextjs.org/docs/app/api-reference/next-config-js/

const buildDate = new Date().toISOString();

const nextConfig = {
  compress: true,
  env: {
    YANDEX_METRIKA_ID: process.env.YANDEX_METRIKA_ID,
    BUILD_DATE: buildDate,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vercelbadge.vercel.app',
      },
    ],
  },
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['swagger-ui-react'],
  },
};

module.exports = nextConfig;
