/**
 * Domain types for tutorial content.
 *
 * These mirror the database model in PROJECT_PLAN.md (§12–§15) in camelCase.
 * Phase 2 maps Supabase rows onto these shapes inside lib/tutorials/queries.ts,
 * so UI components never depend on database column names.
 */

export type Difficulty = "beginner" | "intermediate" | "advanced";

export type AccessType = "free" | "premium";

export type TutorialStatus = "draft" | "published" | "archived";

export type ArtworkStatus = "draft" | "published";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  /** R2 object key (never a URL). */
  imageKey: string | null;
  sortOrder: number;
}

export interface TutorialLevel {
  id: string;
  tutorialId: string;
  difficulty: Difficulty;
  accessType: AccessType;
  /** The full worksheet. Protected when accessType is "premium". */
  tutorialImageKey: string | null;
  /** Deliberately created public preview for premium levels. */
  previewImageKey: string | null;
  /** Printable PDF. Protected when accessType is "premium". */
  printableFileKey: string | null;
  introduction: string | null;
  stepCount: number | null;
  artworkStatus: ArtworkStatus;
}

/** A drawing subject, e.g. "Coconut Tree". Never a single difficulty. */
export interface Tutorial {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  categoryId: string;
  /** Thumbnail shown on cards and listings. */
  featuredImageKey: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  status: TutorialStatus;
  featured: boolean;
  /** ISO 8601 timestamp. */
  publishedAt: string | null;
  levels: TutorialLevel[];
}

export interface TutorialWithCategory extends Tutorial {
  category: Category;
}
