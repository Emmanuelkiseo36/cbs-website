/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  experimental: {
    devtoolSegmentExplorer: false,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;