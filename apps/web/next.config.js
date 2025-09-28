/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  basePath: '/cms',
  assetPrefix: '/cms',
};

module.exports = nextConfig;
