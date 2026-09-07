import type { TutorialLevel } from "@/types/tutorial";

/**
 * The person looking at the page. Phase 7 builds this from the Supabase
 * session. Once tutorial packs are sold, `unlockedLevelIds` is derived on the
 * server from the viewer's purchases and each pack's contents, so this rule
 * does not care how packs are organised. Anonymous visitors are `null`.
 */
export interface Viewer {
  id: string;
  unlockedLevelIds: ReadonlySet<string>;
}

/**
 * Single source of truth for access to paid levels (PROJECT_PLAN.md §33, with
 * packs instead of subscriptions). Always call this on the server; never
 * reproduce the rule in components.
 */
export function canAccessTutorialLevel(
  viewer: Viewer | null,
  level: Pick<TutorialLevel, "id" | "accessType">,
): boolean {
  if (level.accessType === "free") {
    return true;
  }
  return viewer?.unlockedLevelIds.has(level.id) === true;
}
