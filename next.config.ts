import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  sassOptions: {
    loadPaths: ["./src"],
    additionalData: `$src: "/src";`,
  },
};

export default nextConfig;
