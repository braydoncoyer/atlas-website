import type { NextConfig } from "next";

// Legacy product domains and the `?from=` marker RebrandBanner keys on.
// These domains connect to this Vercel project (not dashboard redirects —
// those can't append query params), so the app itself issues the redirect.
const LEGACY_DOMAINS = [
  { host: "writeatlas.app", from: "atlas" },
  { host: "fernnotes.app", from: "fern" },
];

const nextConfig: NextConfig = {
  // Pin the workspace root — a stray lockfile in the home dir otherwise
  // makes Next infer the wrong root for this project.
  turbopack: {
    root: __dirname,
  },
  async redirects() {
    return LEGACY_DOMAINS.flatMap(({ host, from }) =>
      [host, `www.${host}`].map((value) => ({
        source: "/:path*",
        has: [{ type: "host" as const, value }],
        destination: `https://www.lorenotes.com/:path*?from=${from}`,
        permanent: true,
      }))
    );
  },
};

export default nextConfig;
