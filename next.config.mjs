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
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "luxurydata.s3.eu-north-1.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.homebble.in",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.justflip.in",
        pathname: "/**",
      },
    ],
    qualities: [75, 85],
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      "react-icons",
      "@headlessui/react",
      "recharts",
      "leaflet",
      "react-leaflet",
    ],
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
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'next/dist/build/polyfills/polyfill-module': false,
        'next/dist/build/polyfills/polyfill-module.js': false,
      };
    }
    return config;
  },
};

export default withBundleAnalyzer(nextConfig);