import { existsSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { mockTutorials } from "./mock-data";

const assetRoot = join(process.cwd(), "public", "mock-assets");

describe("mock image keys", () => {
  it("every referenced image exists under public/mock-assets", () => {
    const missing: string[] = [];
    for (const tutorial of mockTutorials) {
      const keys = [
        tutorial.featuredImageKey,
        ...tutorial.levels.flatMap((level) => [
          level.tutorialImageKey,
          level.previewImageKey,
        ]),
      ];
      for (const key of keys) {
        if (key && !existsSync(join(assetRoot, key))) {
          missing.push(`${tutorial.slug}: ${key}`);
        }
      }
    }
    expect(missing).toEqual([]);
  });
});
