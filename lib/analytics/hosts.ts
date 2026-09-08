/** PostHog's EU cloud: the default so visitor data stays in the EU. */
export const DEFAULT_POSTHOG_HOST = "https://eu.i.posthog.com";

/** Same-origin path that next.config.ts proxies to PostHog, so ad blockers do not drop events. */
export const POSTHOG_INGEST_PATH = "/ingest";

/**
 * Where the proxy forwards to: the ingestion host itself and the assets host
 * that serves the SDK bundles (`eu.i.posthog.com` becomes `eu-assets.i.posthog.com`).
 * A self-hosted PostHog serves both from one host.
 */
export function posthogProxyTargets(host: string): {
  ingest: string;
  assets: string;
} {
  const url = new URL(host);
  const assetsHost = url.hostname.replace(/^([a-z]+)\.i\./, "$1-assets.i.");
  return {
    ingest: url.origin,
    assets: `${url.protocol}//${assetsHost}`,
  };
}

/** The PostHog app behind an ingestion host (`eu.i.posthog.com` becomes `eu.posthog.com`). */
export function posthogUiHost(host: string): string {
  const url = new URL(host);
  return `${url.protocol}//${url.hostname.replace(".i.posthog.com", ".posthog.com")}`;
}
