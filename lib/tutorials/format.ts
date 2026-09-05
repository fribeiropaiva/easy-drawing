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

export function tutorialSeoDescription(title: string): string {
  return `Learn how to draw ${indefiniteArticle(title)} ${title.toLowerCase()} step by step with beginner, intermediate and advanced drawing tutorials.`;
}
