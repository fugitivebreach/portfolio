import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    domains: ['cdn.discordapp.com', 'img.youtube.com'],
  },
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
