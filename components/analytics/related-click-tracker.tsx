"use client";

import type { MouseEvent, ReactNode } from "react";

import { track } from "@/lib/analytics";

const TUTORIAL_LINK = 'a[href^="/draw/"]';

/**
 * Records `related_tutorial_clicked` for any tutorial link inside it, by event
 * delegation, so the cards themselves stay Server Components.
 */
export function RelatedClickTracker({
  fromSlug,
  children,
}: {
  fromSlug: string;
  children: ReactNode;
}) {
  function handleClick(event: MouseEvent<HTMLDivElement>) {
    const link = (event.target as HTMLElement).closest<HTMLAnchorElement>(
      TUTORIAL_LINK,
    );
    if (!link || !event.currentTarget.contains(link)) {
      return;
    }
    const toSlug = link.getAttribute("href")?.slice("/draw/".length);
    if (!toSlug) {
      return;
    }
    const links = Array.from(
      event.currentTarget.querySelectorAll<HTMLAnchorElement>(TUTORIAL_LINK),
    );
    track("related_tutorial_clicked", {
      from_slug: fromSlug,
      to_slug: toSlug,
      position: links.indexOf(link) + 1,
    });
  }

  return <div onClick={handleClick}>{children}</div>;
}
