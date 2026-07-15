/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    qualities: [75, 80, 85, 90], 
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'luxurydata.s3.eu-north-1.amazonaws.com',
      },
    ],
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['hs23fwgh-3000.inc1.devtunnels.ms', 'localhost:3000', '*.devtunnels.ms']
    }
  }
};

export default nextConfig;
