/** @type {import('next').NextConfig} */

// https://nextjs.org/docs/app/api-reference/next-config-js/

const buildDate = new Date().toISOString();
const packageJson = require('./package.json');

const nextConfig = {
  compress: true,
  env: {
    YANDEX_METRIKA_ID: process.env.YANDEX_METRIKA_ID,
    BUILD_DATE: buildDate,
  },
  async rewrites() {
    // Serve static JSON files from public/static-api instead of hitting route handlers
    return [
      // Root calendar endpoint
      { source: '/api/calendar', destination: '/static-api/calendar/index.json' },
      // Day-level must come before month-level
      { source: '/api/calendar/:year(\\d{4})/:month(\\d{1,2})/:day(\\d{1,2})', destination: '/static-api/calendar/:year/:month/:day.json' },
      { source: '/api/calendar/:year(\\d{4})/:month(\\d{1,2})', destination: '/static-api/calendar/:year/:month.json' },
      { source: '/api/calendar/:year(\\d{4})/holidays', destination: '/static-api/calendar/:year/holidays.json' },
      { source: '/api/calendar/:year(\\d{4})', destination: '/static-api/calendar/:year.json' },
    ];
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, s-maxage=31536000' },
          { key: 'Content-Type', value: 'application/json' },
          { key: 'ETag', value: `"calendar-${packageJson.version}-${buildDate.split('T')[0]}"` },
        ],
      },
      {
        source: '/static-api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, s-maxage=31536000' },
          { key: 'Content-Type', value: 'application/json' },
          { key: 'ETag', value: `"calendar-${packageJson.version}-${buildDate.split('T')[0]}"` },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vercelbadge.vercel.app',
      },
    ],
  },
};

module.exports = nextConfig;
