import type { Metadata } from "next";

import { publicEnv } from "@/lib/env";
import { siteConfig } from "@/lib/site";

/**
 * The one canonical origin, without a trailing slash. Every absolute URL the
 * site hands to a crawler (canonical, Open Graph, sitemap, robots) is built
 * from this, so there is a single place to get the production host right.
 */
export const siteUrl = publicEnv.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, "");

/**
 * Absolute URL for a public path. "/" resolves to the bare origin so the
 * homepage matches the canonical Next.js renders from `metadataBase`.
 */
export function absoluteUrl(path: string): string {
  return path === "/" ? siteUrl : `${siteUrl}${path}`;
}

/**
 * The picture a shared link previews with (PROJECT_PLAN.md §60). Only ever an
 * asset the page already renders publicly: naming a paid original here would
 * hand it to any crawler that reads the tag, with no entitlement check.
 */
export interface SocialImage {
  /** Built by lib/assets; a relative path resolves against `metadataBase`. */
  url: string;
  alt: string;
  width: number;
  height: number;
}

interface PageMetadataInput {
  title: string;
  description: string;
  /** Path starting with "/", resolved against metadataBase from the root layout. */
  path: string;
  image?: SocialImage;
}

/** Consistent title, description, canonical URL and Open Graph tags for a public page. */
export function createPageMetadata({
  title,
  description,
  path,
  image,
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
      images: image ? [image] : undefined,
    },
  };
}
