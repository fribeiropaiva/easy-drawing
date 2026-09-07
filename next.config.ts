import type { NextConfig } from "next";

// Validates environment variables at build/startup (see lib/env.ts).
import "./lib/env";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      // The subscription-era pricing page was live at this URL; packs replaced it (docs/decisions.md #19).
      { source: "/pricing", destination: "/packs", permanent: true },
    ];
  },
};

export default nextConfig;
