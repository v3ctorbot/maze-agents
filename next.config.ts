import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["three", "yuka"],

  webpack: (config, { isServer, dev }) => {
    // Three.js, R3F, Drei, and Yuka are browser-only — exclude from server bundle
    if (isServer) {
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : []),
        "three",
        "@react-three/fiber",
        "@react-three/drei",
        "yuka",
      ];
    }
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: ["**/node_modules", "**/.next"],
      };
    }
    return config;
  },
};

export default nextConfig;
