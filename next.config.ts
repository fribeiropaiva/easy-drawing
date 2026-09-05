import type { NextConfig } from "next";

// Validates environment variables at build/startup (see lib/env.ts).
import "./lib/env";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
