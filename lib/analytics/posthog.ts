import type { PostHog } from "posthog-js";

import { POSTHOG_INGEST_PATH, posthogUiHost } from "./hosts";
import type { AnalyticsProvider } from "./provider";

/**
 * PostHog, loaded on demand in the browser so the SDK is never part of the
 * server bundle. Cookieless on purpose (`persistence: "memory"`): no consent
 * banner is needed, at the cost of not recognising a visitor across full page
 * loads. Client-side navigation keeps the session, and page views are sent by
 * the Analytics component on every route change (`capture_pageview` is off).
 */
export function createPostHogProvider({
  key,
  host,
}: {
  key: string;
  host: string;
}): AnalyticsProvider {
  let client: PostHog | null = null;
  return {
    async init() {
      const { default: posthog } = await import("posthog-js");
      posthog.init(key, {
        api_host: POSTHOG_INGEST_PATH,
        ui_host: posthogUiHost(host),
        capture_pageview: false,
        capture_pageleave: true,
        persistence: "memory",
        person_profiles: "identified_only",
      });
      client = posthog;
    },
    capture(name, properties) {
      client?.capture(name, properties);
    },
    pageview(url) {
      client?.capture("$pageview", { $current_url: url });
    },
  };
}
