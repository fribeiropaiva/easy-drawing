import { DEFAULT_POSTHOG_HOST } from "./hosts";

/**
 * Read straight from process.env so Next.js inlines the values into the client
 * bundle (only literal `process.env.NEXT_PUBLIC_*` references are inlined).
 * lib/env.ts validates the same two variables at build time.
 */
export const analyticsConfig = {
  posthogKey: process.env.NEXT_PUBLIC_POSTHOG_KEY || null,
  posthogHost: process.env.NEXT_PUBLIC_POSTHOG_HOST || DEFAULT_POSTHOG_HOST,
};
