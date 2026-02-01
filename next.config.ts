import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  sassOptions: {
    loadPaths: ["./src"],
    additionalData: `$src: "/src";`,
  },
  allowedDevOrigins: ["172.20.10.8"],
};

export default nextConfig;
