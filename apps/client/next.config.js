/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true, // Включить строгий режим React
    async redirects() {
      return [
        {
            source: '/:path*',
            destination: '/page404',
            permanent: false,
          }
          
      ];
    },
  };
  
  // module.exports = nextConfig;
  