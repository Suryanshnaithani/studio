import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // ... other configuration options
  dev: {
    allowedDevOrigins: ['8000-firebase-studio-1747046109218.cluster-44kx2eiocbhe2tyk3zoyo3ryuo.cloudworkstations.dev'],
  },
};

export default nextConfig;