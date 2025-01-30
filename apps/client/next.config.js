/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');
const nextConfig = {
  reactStrictMode: true,
  i18n,
  async headers() {
    return [
      {
        source: '/(.*)', 
        headers: [
          {
            key: 'Referrer-Policy',
            value: 'no-referrer', 
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

