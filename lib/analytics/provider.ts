export type EventProperties = Record<string, unknown>;

/** What a concrete analytics tool implements. Swap the provider, keep the events. */
export interface AnalyticsProvider {
  /** Called once, in the browser, before anything is sent. May load an SDK. */
  init(): void | Promise<void>;
  capture(name: string, properties: EventProperties): void;
  pageview(url: string): void;
}

/** Production without a key: nothing is sent anywhere. */
export const noopProvider: AnalyticsProvider = {
  init() {},
  capture() {},
  pageview() {},
};

/** Development without a key: shows in the browser console what would be sent. */
export const consoleProvider: AnalyticsProvider = {
  init() {
    console.info(
      "[analytics] NEXT_PUBLIC_POSTHOG_KEY is not set; logging events to the console instead",
    );
  },
  capture(name, properties) {
    console.info(`[analytics] ${name}`, properties);
  },
  pageview(url) {
    console.info("[analytics] $pageview", url);
  },
};
