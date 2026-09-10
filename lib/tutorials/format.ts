import type { Difficulty } from "@/types/tutorial";

import { DIFFICULTIES, DIFFICULTY_LABELS } from "./levels";

export function indefiniteArticle(word: string): "a" | "an" {
  return /^[aeiou]/i.test(word) ? "an" : "a";
}

/** Sentence-case page heading: "How to draw a coconut tree". */
export function tutorialHeadline(title: string): string {
  return `How to draw ${indefiniteArticle(title)} ${title.toLowerCase()}`;
}

/** Search result title: "How to Draw a Coconut Tree Step by Step". */
export function tutorialSeoTitle(title: string): string {
  return `How to Draw ${indefiniteArticle(title)} ${title} Step by Step`;
}

/** "beginner", "beginner and advanced", "beginner, intermediate and advanced". */
function joinWithAnd(items: readonly string[]): string {
  if (items.length < 2) {
    return items.join("");
  }
  return `${items.slice(0, -1).join(", ")} and ${items.slice(-1).join("")}`;
}

/**
 * Search result description (PROJECT_PLAN.md §60–§61). It names only the levels
 * a visitor can actually open: most subjects have a beginner sheet and nothing
 * else yet, so claiming all three on every page would describe content that is
 * not there. A subject with all three levels keeps the wording from §61.
 */
export function tutorialSeoDescription(
  title: string,
  /** Levels with published artwork. Defaults to all three. */
  publishedDifficulties: readonly Difficulty[] = DIFFICULTIES,
): string {
  const subject = `${indefiniteArticle(title)} ${title.toLowerCase()}`;
  const labels = DIFFICULTIES.filter((difficulty) =>
    publishedDifficulties.includes(difficulty),
  ).map((difficulty) => DIFFICULTY_LABELS[difficulty].toLowerCase());
  const only = labels.length === 1 ? labels[0] : undefined;

  if (labels.length === 0) {
    return `Learn how to draw ${subject} step by step. Drawing tutorials for this subject are coming soon.`;
  }
  const tutorials = only
    ? `${indefiniteArticle(only)} ${only} drawing tutorial`
    : `${joinWithAnd(labels)} drawing tutorials`;
  return `Learn how to draw ${subject} step by step with ${tutorials}.`;
}
