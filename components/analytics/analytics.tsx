"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

import { analytics } from "@/lib/analytics";

/** Sends a page view whenever the App Router changes the URL, including the first load. */
function PageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    analytics.pageview(
      `${window.location.origin}${pathname}${query ? `?${query}` : ""}`,
    );
  }, [pathname, searchParams]);

  return null;
}

/**
 * Mounted once in the root layout: starts the analytics provider and records
 * page views. Renders nothing. `useSearchParams` needs a Suspense boundary on
 * statically rendered pages.
 */
export function Analytics() {
  useEffect(() => {
    void analytics.init();
  }, []);

  return (
    <Suspense fallback={null}>
      <PageviewTracker />
    </Suspense>
  );
}
