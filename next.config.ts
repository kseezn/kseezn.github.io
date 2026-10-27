import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  cacheComponents: false,
  images: { unoptimized: true },
};

export default nextConfig;