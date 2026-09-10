import type { Difficulty, Tutorial, TutorialLevel } from "@/types/tutorial";

export const DIFFICULTIES = [
  "beginner",
  "intermediate",
  "advanced",
] as const satisfies readonly Difficulty[];

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

/** What a visitor can expect from a level before opening it. */
export type LevelAvailability = "free" | "pack" | "coming-soon";

export interface LevelSummary {
  difficulty: Difficulty;
  label: string;
  availability: LevelAvailability;
}

export function isDifficulty(value: unknown): value is Difficulty {
  return (
    typeof value === "string" &&
    (DIFFICULTIES as readonly string[]).includes(value)
  );
}

export function getLevel(
  tutorial: Pick<Tutorial, "levels">,
  difficulty: Difficulty,
): TutorialLevel | null {
  return (
    tutorial.levels.find((level) => level.difficulty === difficulty) ?? null
  );
}

/** A level is only shown to visitors once its artwork is published and uploaded. */
export function hasPublishedArtwork(
  level: TutorialLevel | null,
): level is TutorialLevel {
  return (
    level !== null &&
    level.artworkStatus === "published" &&
    level.tutorialImageKey !== null
  );
}

export function getLevelAvailability(
  tutorial: Pick<Tutorial, "levels">,
  difficulty: Difficulty,
): LevelAvailability {
  const level = getLevel(tutorial, difficulty);
  if (!hasPublishedArtwork(level)) {
    return "coming-soon";
  }
  return level.accessType;
}

export function getLevelSummaries(
  tutorial: Pick<Tutorial, "levels">,
): LevelSummary[] {
  return DIFFICULTIES.map((difficulty) => ({
    difficulty,
    label: DIFFICULTY_LABELS[difficulty],
    availability: getLevelAvailability(tutorial, difficulty),
  }));
}

/** The levels a visitor can actually open today, easiest first. */
export function getPublishedDifficulties(
  tutorial: Pick<Tutorial, "levels">,
): Difficulty[] {
  return DIFFICULTIES.filter(
    (difficulty) =>
      getLevelAvailability(tutorial, difficulty) !== "coming-soon",
  );
}

/** The level a visitor lands on: the easiest one that is actually available. */
export function getDefaultDifficulty(
  tutorial: Pick<Tutorial, "levels">,
): Difficulty {
  return getPublishedDifficulties(tutorial)[0] ?? "beginner";
}

export function getNextDifficulty(difficulty: Difficulty): Difficulty | null {
  const index = DIFFICULTIES.indexOf(difficulty);
  return DIFFICULTIES[index + 1] ?? null;
}
