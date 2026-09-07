import { describe, expect, it } from "vitest";

import type { Tutorial, TutorialLevel } from "@/types/tutorial";

import {
  getDefaultDifficulty,
  getLevelAvailability,
  getLevelSummaries,
  getNextDifficulty,
  isDifficulty,
} from "./levels";

function level(overrides: Partial<TutorialLevel> = {}): TutorialLevel {
  return {
    id: "lvl",
    tutorialId: "tut",
    difficulty: "beginner",
    accessType: "free",
    tutorialImageKey: "tutorials/x/beginner/tutorial.webp",
    previewImageKey: null,
    printableFileKey: null,
    introduction: null,
    stepCount: null,
    artworkStatus: "published",
    ...overrides,
  };
}

function tutorial(levels: TutorialLevel[]): Pick<Tutorial, "levels"> {
  return { levels };
}

describe("getLevelAvailability", () => {
  it("is free for a published free level", () => {
    expect(getLevelAvailability(tutorial([level()]), "beginner")).toBe("free");
  });

  it("is pack for a published pack level", () => {
    const t = tutorial([level({ difficulty: "advanced", accessType: "pack" })]);
    expect(getLevelAvailability(t, "advanced")).toBe("pack");
  });

  it("is coming soon when the level row does not exist", () => {
    expect(getLevelAvailability(tutorial([]), "intermediate")).toBe(
      "coming-soon",
    );
  });

  it("is coming soon when artwork is still a draft", () => {
    const t = tutorial([level({ artworkStatus: "draft" })]);
    expect(getLevelAvailability(t, "beginner")).toBe("coming-soon");
  });

  it("is coming soon when no image has been uploaded", () => {
    const t = tutorial([level({ tutorialImageKey: null })]);
    expect(getLevelAvailability(t, "beginner")).toBe("coming-soon");
  });
});

describe("getLevelSummaries", () => {
  it("always returns the three difficulties in order", () => {
    const summaries = getLevelSummaries(
      tutorial([level({ difficulty: "advanced", accessType: "pack" })]),
    );
    expect(summaries.map((s) => s.difficulty)).toEqual([
      "beginner",
      "intermediate",
      "advanced",
    ]);
    expect(summaries.map((s) => s.availability)).toEqual([
      "coming-soon",
      "coming-soon",
      "pack",
    ]);
  });
});

describe("getDefaultDifficulty", () => {
  it("picks the easiest available level", () => {
    const t = tutorial([
      level({ difficulty: "intermediate", accessType: "pack" }),
      level({ difficulty: "advanced" }),
    ]);
    expect(getDefaultDifficulty(t)).toBe("intermediate");
  });

  it("falls back to beginner when nothing is available", () => {
    expect(getDefaultDifficulty(tutorial([]))).toBe("beginner");
  });
});

describe("getNextDifficulty", () => {
  it("walks beginner -> intermediate -> advanced -> null", () => {
    expect(getNextDifficulty("beginner")).toBe("intermediate");
    expect(getNextDifficulty("intermediate")).toBe("advanced");
    expect(getNextDifficulty("advanced")).toBeNull();
  });
});

describe("isDifficulty", () => {
  it("accepts known values only", () => {
    expect(isDifficulty("beginner")).toBe(true);
    expect(isDifficulty("expert")).toBe(false);
    expect(isDifficulty(1)).toBe(false);
  });
});
