import type { NextConfig } from "next";

import {
  POSTHOG_INGEST_PATH,
  posthogProxyTargets,
} from "./lib/analytics/hosts";
// Validates environment variables at build/startup (see lib/env.ts).
import { publicEnv } from "./lib/env";

const posthog = posthogProxyTargets(publicEnv.NEXT_PUBLIC_POSTHOG_HOST);

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // PostHog's API paths end with a slash, which Next would otherwise redirect
  // away. The second redirect below keeps every other URL slash-free as before.
  skipTrailingSlashRedirect: true,
  async redirects() {
    return [
      // The subscription-era pricing page was live at this URL; packs replaced it (docs/decisions.md #19).
      { source: "/pricing", destination: "/packs", permanent: true },
      {
        source: "/:path((?!ingest(?:/|$)).+)/",
        destination: "/:path",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    // Same-origin proxy for analytics so ad blockers do not drop events (lib/analytics/posthog.ts).
    return [
      {
        source: `${POSTHOG_INGEST_PATH}/static/:path*`,
        destination: `${posthog.assets}/static/:path*`,
      },
      {
        source: `${POSTHOG_INGEST_PATH}/:path*`,
        destination: `${posthog.ingest}/:path*`,
      },
    ];
  },
};

export default nextConfig;
