import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo/metadata";

/**
 * Crawling rules (PROJECT_PLAN.md §64). Everything published today is public,
 * so nothing is disallowed; `/_next/` in particular must stay crawlable or
 * Google cannot render the pages.
 *
 * When the admin, account and auth routes arrive (Phases 5 and 7), disallow
 * them here as a crawling hint only. Access is enforced on the server —
 * robots.txt is never security (CLAUDE.md).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
