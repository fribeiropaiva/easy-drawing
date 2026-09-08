import { createAnalytics } from "./analytics";
import { analyticsConfig } from "./config";
import { createPostHogProvider } from "./posthog";
import { consoleProvider, noopProvider } from "./provider";

function selectProvider() {
  if (analyticsConfig.posthogKey) {
    return createPostHogProvider({
      key: analyticsConfig.posthogKey,
      host: analyticsConfig.posthogHost,
    });
  }
  return process.env.NODE_ENV === "development"
    ? consoleProvider
    : noopProvider;
}

/** The site's analytics. Components import `track`; the Analytics component owns init and page views. */
export const analytics = createAnalytics(selectProvider());

export const track: typeof analytics.track = (name, properties) =>
  analytics.track(name, properties);

export type { AnalyticsEventName, AnalyticsEvents } from "./events";
