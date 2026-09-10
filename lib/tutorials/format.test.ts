import { describe, expect, it } from "vitest";

import {
  tutorialHeadline,
  tutorialSeoDescription,
  tutorialSeoTitle,
} from "./format";

describe("tutorialHeadline", () => {
  it("reads as a sentence and picks the right article", () => {
    expect(tutorialHeadline("Coconut Tree")).toBe("How to draw a coconut tree");
    expect(tutorialHeadline("Elephant")).toBe("How to draw an elephant");
  });
});

describe("tutorialSeoTitle", () => {
  it("keeps the subject's capitalisation", () => {
    expect(tutorialSeoTitle("Coconut Tree")).toBe(
      "How to Draw a Coconut Tree Step by Step",
    );
  });
});

describe("tutorialSeoDescription", () => {
  it("matches PROJECT_PLAN.md §61 for a subject with all three levels", () => {
    expect(tutorialSeoDescription("Coconut Tree")).toBe(
      "Learn how to draw a coconut tree step by step with beginner, intermediate and advanced drawing tutorials.",
    );
  });

  it("only promises the levels that are published", () => {
    expect(tutorialSeoDescription("Fish", ["beginner"])).toBe(
      "Learn how to draw a fish step by step with a beginner drawing tutorial.",
    );
    expect(tutorialSeoDescription("Sunset", ["beginner", "advanced"])).toBe(
      "Learn how to draw a sunset step by step with beginner and advanced drawing tutorials.",
    );
  });

  it("names the level with the right article", () => {
    expect(tutorialSeoDescription("Fish", ["intermediate"])).toContain(
      "with an intermediate drawing tutorial",
    );
  });

  it("lists levels easiest first, whatever order they arrive in", () => {
    expect(tutorialSeoDescription("Sunset", ["advanced", "beginner"])).toBe(
      "Learn how to draw a sunset step by step with beginner and advanced drawing tutorials.",
    );
  });

  it("says so when a subject has no published artwork yet", () => {
    expect(tutorialSeoDescription("Palm Tree", [])).toBe(
      "Learn how to draw a palm tree step by step. Drawing tutorials for this subject are coming soon.",
    );
  });
});
