import type { Metadata } from "next";

import { siteConfig } from "@/lib/site";

interface PageMetadataInput {
  title: string;
  description: string;
  /** Path starting with "/", resolved against metadataBase from the root layout. */
  path: string;
}

/** Consistent title, description, canonical URL and Open Graph tags for a public page. */
export function createPageMetadata({
  title,
  description,
  path,
}: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: siteConfig.name,
      type: "website",
    },
  };
}
