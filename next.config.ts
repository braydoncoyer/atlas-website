import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root — a stray lockfile in the home dir otherwise
  // makes Next infer the wrong root for this project.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
