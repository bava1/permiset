/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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

