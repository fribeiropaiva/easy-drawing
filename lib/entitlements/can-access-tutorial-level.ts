import type { TutorialLevel } from "@/types/tutorial";

/**
 * The person looking at the page. Phase 7 builds this from the Supabase
 * session; Phase 8 derives `isPremium` from the subscriptions table (Stripe
 * webhooks are the source of truth). Anonymous visitors are `null`.
 */
export interface Viewer {
  id: string;
  isPremium: boolean;
}

/**
 * Single source of truth for premium access (PROJECT_PLAN.md §33).
 * Always call this on the server; never reproduce the rule in components.
 */
export function canAccessTutorialLevel(
  viewer: Viewer | null,
  level: Pick<TutorialLevel, "accessType">,
): boolean {
  if (level.accessType === "free") {
    return true;
  }
  return viewer?.isPremium === true;
}
