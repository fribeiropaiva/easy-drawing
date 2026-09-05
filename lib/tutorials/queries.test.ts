import { describe, expect, it } from "vitest";

import {
  getCategories,
  getPublishedTutorials,
  getTutorialBySlug,
} from "./queries";

describe("tutorial queries", () => {
  it("never returns draft tutorials", async () => {
    const slugs = (await getPublishedTutorials()).map((t) => t.slug);
    expect(slugs).not.toContain("palm-tree");
    expect(await getTutorialBySlug("palm-tree")).toBeNull();
  });

  it("filters by category slug", async () => {
    const animals = await getPublishedTutorials({ categorySlug: "animals" });
    expect(animals.length).toBeGreaterThan(0);
    expect(animals.every((t) => t.category.slug === "animals")).toBe(true);
  });

  it("returns an empty list for an unknown category", async () => {
    expect(await getPublishedTutorials({ categorySlug: "nope" })).toEqual([]);
  });

  it("can hide categories without published tutorials", async () => {
    const used = await getCategories({ onlyWithPublishedTutorials: true });
    expect(used.map((c) => c.slug)).not.toContain("flowers");
  });
});
