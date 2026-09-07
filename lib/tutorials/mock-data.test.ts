import { existsSync, readdirSync } from "node:fs";
import { join, sep } from "node:path";

import { describe, expect, it } from "vitest";

import { mockTutorials } from "./mock-data";

const assetRoot = join(process.cwd(), "public", "mock-assets");

/** Every image key the mock content points at, with the subject it belongs to. */
function referencedKeys(): { slug: string; key: string }[] {
  return mockTutorials.flatMap((tutorial) =>
    [
      tutorial.featuredImageKey,
      ...tutorial.levels.flatMap((level) => [
        level.tutorialImageKey,
        level.previewImageKey,
      ]),
    ]
      .filter((key): key is string => key !== null)
      .map((key) => ({ slug: tutorial.slug, key })),
  );
}

describe("mock image keys", () => {
  it("every referenced image exists under public/mock-assets", () => {
    const missing = referencedKeys()
      .filter(({ key }) => !existsSync(join(assetRoot, key)))
      .map(({ slug, key }) => `${slug}: ${key}`);
    expect(missing).toEqual([]);
  });

  it("every real worksheet under public/mock-assets belongs to a tutorial", () => {
    const referenced = new Set(referencedKeys().map(({ key }) => key));
    const unused = readdirSync(join(assetRoot, "tutorials"), {
      recursive: true,
    })
      .map((entry) => `tutorials/${String(entry).split(sep).join("/")}`)
      .filter((key) => key.endsWith(".png") && !referenced.has(key));
    expect(unused).toEqual([]);
  });
});
