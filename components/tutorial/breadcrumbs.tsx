import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { absoluteUrl } from "@/lib/seo/metadata";

export interface Crumb {
  label: string;
  href?: string;
}

/**
 * The visible trail and the BreadcrumbList that describes it to search engines
 * (PROJECT_PLAN.md §65). Both read the same normalised array, so the structured
 * data cannot drift from what a visitor sees. The last crumb is the current
 * page: it never links, and Google expects it to carry a name but no URL.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const trail = items.map((item, index) => ({
    label: item.label,
    href: index === items.length - 1 ? undefined : item.href,
  }));

  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      ...(crumb.href ? { item: absoluteUrl(crumb.href) } : {}),
    })),
  };

  return (
    <nav aria-label="Breadcrumb">
      <script
        type="application/ld+json"
        // Escaped so a subject or category title can never close the tag.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbList).replace(/</g, "\\u003c"),
        }}
      />
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        {trail.map((crumb, index) => (
          <li
            key={`${crumb.label}-${index}`}
            className="flex items-center gap-1.5"
          >
            {index > 0 ? (
              <ChevronRight className="size-3.5" aria-hidden="true" />
            ) : null}
            {crumb.href ? (
              <Link
                href={crumb.href}
                className="underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                {crumb.label}
              </Link>
            ) : (
              <span
                aria-current={index === trail.length - 1 ? "page" : undefined}
                className="text-foreground"
              >
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
