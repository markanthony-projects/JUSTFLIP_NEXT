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
  }
};

export default nextConfig;
