import type { LevelAvailability } from "@/lib/tutorials/levels";
import type { Difficulty } from "@/types/tutorial";

/**
 * Every product event the site sends, with its properties (PROJECT_PLAN.md
 * §68, adapted to packs). Names and keys are snake_case because they appear
 * verbatim in the analytics tool. Page views are sent separately by the
 * provider on every route change and are not listed here.
 */
export interface AnalyticsEvents {
  /** A subject page was opened. `default_level` is the tab shown first. */
  tutorial_viewed: {
    slug: string;
    title: string;
    category: string;
    default_level: Difficulty;
    available_levels: Difficulty[];
  };
  /** The visitor switched level, from the tabs or the "try the next level" prompt. */
  difficulty_selected: {
    slug: string;
    difficulty: Difficulty;
    availability: LevelAvailability;
    source: "tabs" | "next_level_cta";
  };
  /** A card in the "Keep drawing" row was clicked. `position` is 1-based. */
  related_tutorial_clicked: {
    from_slug: string;
    to_slug: string;
    position: number;
  };
  /** The tutorial list was filtered to one category. */
  category_viewed: { category: string };
  /** A link to the packs page was clicked: interest in packs before launch. */
  packs_link_clicked: { source: "hero" | "home_section" | "pack_card" };
  /** The public preview of a pack level was shown instead of the worksheet. */
  pack_preview_viewed: { slug: string; difficulty: Difficulty };
}

export type AnalyticsEventName = keyof AnalyticsEvents;
