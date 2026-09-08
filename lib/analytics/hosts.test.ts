import { describe, expect, it } from "vitest";

import { posthogProxyTargets, posthogUiHost } from "./hosts";

describe("posthog hosts", () => {
  it("derives the assets host for the PostHog clouds", () => {
    expect(posthogProxyTargets("https://eu.i.posthog.com")).toEqual({
      ingest: "https://eu.i.posthog.com",
      assets: "https://eu-assets.i.posthog.com",
    });
    expect(posthogProxyTargets("https://us.i.posthog.com/")).toEqual({
      ingest: "https://us.i.posthog.com",
      assets: "https://us-assets.i.posthog.com",
    });
  });

  it("uses one host for a self-hosted instance", () => {
    expect(posthogProxyTargets("https://ph.example.com")).toEqual({
      ingest: "https://ph.example.com",
      assets: "https://ph.example.com",
    });
  });

  it("points toolbar links at the PostHog app", () => {
    expect(posthogUiHost("https://eu.i.posthog.com")).toBe(
      "https://eu.posthog.com",
    );
    expect(posthogUiHost("https://ph.example.com")).toBe(
      "https://ph.example.com",
    );
  });
});
