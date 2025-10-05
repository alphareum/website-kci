/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/cms',
  assetPrefix: '/cms',
  images: { unoptimized: true },
};

module.exports = nextConfig;
