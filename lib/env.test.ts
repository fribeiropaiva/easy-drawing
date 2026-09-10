import { describe, expect, it } from "vitest";
import { z } from "zod";

import { inferSiteUrl, parseEnv } from "./env";

describe("inferSiteUrl", () => {
  it("prefers an explicit SITE_URL", () => {
    expect(
      inferSiteUrl({
        SITE_URL: "https://www.easydrawing.fun",
        VERCEL_ENV: "production",
        VERCEL_URL: "easy-drawing-abc123.vercel.app",
      }),
    ).toBe("https://www.easydrawing.fun");
  });

  it("refuses to guess the canonical origin on a production deployment", () => {
    expect(() =>
      inferSiteUrl({
        VERCEL_ENV: "production",
        VERCEL_PROJECT_PRODUCTION_URL: "easydrawing.fun",
      }),
    ).toThrow(/SITE_URL/);
  });

  it("uses the production domain on preview deployments, so previews point at it", () => {
    expect(
      inferSiteUrl({
        VERCEL_ENV: "preview",
        VERCEL_PROJECT_PRODUCTION_URL: "www.easydrawing.fun",
        VERCEL_URL: "easy-drawing-abc123.vercel.app",
      }),
    ).toBe("https://www.easydrawing.fun");
  });

  it("falls back to localhost off Vercel", () => {
    expect(inferSiteUrl({})).toBe("http://localhost:3000");
  });
});

describe("parseEnv", () => {
  it("names the offending variable when validation fails", () => {
    const schema = z.object({ SITE_URL: z.url() });
    expect(() => parseEnv(schema, { SITE_URL: "nope" })).toThrow(/SITE_URL/);
  });
});
