import { describe, expect, it } from "vitest";

import { canAccessTutorialLevel } from "./can-access-tutorial-level";

const free = { id: "lvl_free", accessType: "free" } as const;
const packLevel = { id: "lvl_pack", accessType: "pack" } as const;

describe("canAccessTutorialLevel", () => {
  it("lets anonymous visitors open free levels", () => {
    expect(canAccessTutorialLevel(null, free)).toBe(true);
  });

  it("blocks anonymous visitors from pack levels", () => {
    expect(canAccessTutorialLevel(null, packLevel)).toBe(false);
  });

  it("blocks signed-in viewers who have not bought a pack with the level", () => {
    const viewer = { id: "u1", unlockedLevelIds: new Set(["lvl_other"]) };
    expect(canAccessTutorialLevel(viewer, packLevel)).toBe(false);
  });

  it("allows viewers whose purchased packs include the level", () => {
    const viewer = { id: "u1", unlockedLevelIds: new Set(["lvl_pack"]) };
    expect(canAccessTutorialLevel(viewer, packLevel)).toBe(true);
  });
});
