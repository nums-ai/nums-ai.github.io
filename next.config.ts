import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  turbopack: {
    rules: {
      "*.md": { loaders: ["./scripts/markdown-loader.cjs"], as: "*.js" },
    },
  },
};

export default nextConfig;
