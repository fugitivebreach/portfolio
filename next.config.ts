import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['cdn.discordapp.com', 'img.youtube.com'],
  },
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
