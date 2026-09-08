import type { AnalyticsEventName, AnalyticsEvents } from "./events";
import type { AnalyticsProvider, EventProperties } from "./provider";

/** Events fired before the provider is ready wait here; older ones are dropped past this. */
const MAX_QUEUE = 50;

export interface Analytics {
  /** Starts the provider. Safe to call repeatedly; only the first call does anything. */
  init(): Promise<void>;
  track<N extends AnalyticsEventName>(
    name: N,
    properties: AnalyticsEvents[N],
  ): void;
  pageview(url: string): void;
}

type Queued =
  | { kind: "event"; name: string; properties: EventProperties }
  | { kind: "pageview"; url: string };

/**
 * Wraps a provider with a small queue so nothing fired before the SDK has
 * loaded is lost. Everything the site records goes through here; components
 * never talk to a provider directly.
 */
export function createAnalytics(provider: AnalyticsProvider): Analytics {
  let ready = false;
  let starting: Promise<void> | null = null;
  const queue: Queued[] = [];

  function send(item: Queued) {
    if (item.kind === "event") {
      provider.capture(item.name, item.properties);
    } else {
      provider.pageview(item.url);
    }
  }

  function dispatch(item: Queued) {
    if (ready) {
      send(item);
      return;
    }
    if (queue.length >= MAX_QUEUE) {
      queue.shift();
    }
    queue.push(item);
  }

  return {
    init() {
      starting ??= Promise.resolve()
        .then(() => provider.init())
        .then(() => {
          ready = true;
          for (const item of queue.splice(0)) {
            send(item);
          }
        })
        .catch((error: unknown) => {
          console.warn("[analytics] provider failed to start", error);
        });
      return starting;
    },
    track(name, properties) {
      dispatch({ kind: "event", name, properties });
    },
    pageview(url) {
      dispatch({ kind: "pageview", url });
    },
  };
}
