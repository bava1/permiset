/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/(.*)', // Применяется ко всем запросам
        headers: [
          {
            key: 'Referrer-Policy',
            value: 'no-referrer', // Устанавливаем нужное значение
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

