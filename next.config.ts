import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  sassOptions: {
    silenceDeprecations: ["import", "legacy-js-api", "color-functions", "if-function", "global-builtin"],
  }
};

export default nextConfig;
