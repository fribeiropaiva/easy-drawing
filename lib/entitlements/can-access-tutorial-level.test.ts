import { describe, expect, it } from "vitest";

import { canAccessTutorialLevel } from "./can-access-tutorial-level";

const free = { accessType: "free" } as const;
const premium = { accessType: "premium" } as const;

describe("canAccessTutorialLevel", () => {
  it("lets anonymous visitors open free levels", () => {
    expect(canAccessTutorialLevel(null, free)).toBe(true);
  });

  it("blocks anonymous visitors from premium levels", () => {
    expect(canAccessTutorialLevel(null, premium)).toBe(false);
  });

  it("blocks signed-in users without an active subscription", () => {
    expect(
      canAccessTutorialLevel({ id: "u1", isPremium: false }, premium),
    ).toBe(false);
  });

  it("allows premium subscribers", () => {
    expect(canAccessTutorialLevel({ id: "u1", isPremium: true }, premium)).toBe(
      true,
    );
  });
});
