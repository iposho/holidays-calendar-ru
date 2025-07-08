/** @type {import('next').NextConfig} */

// https://nextjs.org/docs/app/api-reference/next-config-js/

const buildDate = new Date().toISOString();

const nextConfig = {
  compress: true,
  env: {
    YANDEX_METRIKA_ID: process.env.YANDEX_METRIKA_ID,
    BUILD_DATE: buildDate,
  },
  async rewrites() {
    return [
      {
        source: '/api/calendar/:year(\\d{4})/:month(\\d{1,2})/:day(\\d{1,2})',
        destination: '/static-api/calendar/:year/:month/:day.json',
      },
      {
        source: '/api/calendar/:year(\\d{4})/:month(\\d{1,2})',
        destination: '/static-api/calendar/:year/:month.json',
      },
      {
        source: '/api/calendar/:year(\\d{4})/holidays',
        destination: '/static-api/calendar/:year/holidays.json',
      },
      {
        source: '/api/calendar/:year(\\d{4})',
        destination: '/static-api/calendar/:year.json',
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
