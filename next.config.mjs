import bundleAnalyzer from "@next/bundle-analyzer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const emptyShimPath = path.resolve(__dirname, "empty-shim.js");

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
  turbopack: {
    resolveAlias: {
      "next/dist/build/polyfills/polyfill-module": "./empty-shim.js",
      "../build/polyfills/polyfill-module": "./empty-shim.js",
      "@next/polyfill-module": "./empty-shim.js",
      "next/dist/build/polyfills/polyfills": "./empty-shim.js",
      "next/dist/client/polyfills": "./empty-shim.js",
    },
  },
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      // Null out Next.js's built-in polyfill modules so modern-browser polyfills
      // (Array.at, Array.flat, Object.fromEntries, Object.hasOwn, String.trim*)
      // are not shipped to browsers that already support them natively.
      const polyfillAliases = {
        'next/dist/build/polyfills/polyfill-module': emptyShimPath,
        'next/dist/build/polyfills/polyfill-module.js': emptyShimPath,
        '../build/polyfills/polyfill-module': emptyShimPath,
        '../build/polyfills/polyfill-module.js': emptyShimPath,
        './build/polyfills/polyfill-module': emptyShimPath,
        './build/polyfills/polyfill-module.js': emptyShimPath,
        '@next/polyfill-module': emptyShimPath,
        'next/dist/build/polyfills/polyfills': emptyShimPath,
        'next/dist/build/polyfills/polyfills.js': emptyShimPath,
        'next/dist/client/polyfills': emptyShimPath,
        'next/dist/client/polyfills.js': emptyShimPath,
      };

      config.resolve.alias = {
        ...config.resolve.alias,
        ...polyfillAliases,
      };

      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /(polyfill-module|polyfills)(\.js)?$/,
          (resource) => {
            if (resource.context && resource.context.includes('next')) {
              resource.request = emptyShimPath;
            }
          }
        )
      );
    }
    return config;
  },
};

export default withBundleAnalyzer(nextConfig);