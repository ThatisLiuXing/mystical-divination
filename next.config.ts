import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // GitHub Pages 部署需要设置 basePath
  basePath: "/mystical-divination",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
