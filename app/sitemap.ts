import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo/metadata";
import { getPublishedTutorials } from "@/lib/tutorials/queries";

/**
 * Every public URL worth indexing (PROJECT_PLAN.md §63).
 *
 * Draft tutorials never reach here: `getPublishedTutorials()` is the only way
 * in and filters them out. Category listings are deliberately absent too —
 * `/draw?category=<slug>` canonicalises to `/draw` (docs/decisions.md #8), so
 * submitting them would only report non-canonical URLs to Search Console.
 * Add `/draw/category/<slug>` here when those pages land in Phase 3.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tutorials = await getPublishedTutorials();
  // The newest publication date, not the build time: a build timestamp would
  // tell crawlers every page changed on every deploy.
  const latestPublishedAt = tutorials[0]?.publishedAt ?? undefined;

  return [
    {
      url: absoluteUrl("/"),
      lastModified: latestPublishedAt,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/draw"),
      lastModified: latestPublishedAt,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/packs"),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    ...tutorials.map((tutorial) => ({
      url: absoluteUrl(`/draw/${tutorial.slug}`),
      lastModified: tutorial.publishedAt ?? undefined,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
