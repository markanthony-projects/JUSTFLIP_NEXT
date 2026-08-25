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
  turbopack: {},
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Null out Next.js's built-in polyfill modules so modern-browser polyfills
      // (Array.at, Array.flat, Object.fromEntries, Object.hasOwn, String.trim*)
      // are not shipped to browsers that already support them natively.
      const polyfillPaths = [
        'next/dist/build/polyfills/polyfill-module',
        'next/dist/build/polyfills/polyfill-module.js',
        'next/dist/build/polyfills/polyfills',
        'next/dist/build/polyfills/polyfills.js',
        'next/dist/client/polyfills',
        'next/dist/client/polyfills.js',
      ];
      config.resolve.alias = {
        ...config.resolve.alias,
        ...Object.fromEntries(polyfillPaths.map((p) => [p, false])),
      };
    }
    return config;
  },
};

export default withBundleAnalyzer(nextConfig);