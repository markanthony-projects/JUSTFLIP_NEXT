import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },  
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "luxurydata.s3.eu-north-1.amazonaws.com",
        pathname: "/**",
      },
    ],
    // unoptimized: false,
    // formats: ["image/avif", "image/webp"],
    // qualities: [75, 85, 100],
    unoptimized: true,
  },
  experimental: {
    optimizeCss: true,
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "*.devtunnels.ms",
      ],
    },
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
};

export default withBundleAnalyzer(nextConfig);