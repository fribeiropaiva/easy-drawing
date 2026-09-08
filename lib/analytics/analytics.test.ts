import { describe, expect, it, vi } from "vitest";

import { createAnalytics } from "./analytics";
import type { AnalyticsProvider } from "./provider";

function fakeProvider(init: AnalyticsProvider["init"] = () => {}) {
  return {
    init: vi.fn(init),
    capture: vi.fn(),
    pageview: vi.fn(),
  };
}

describe("createAnalytics", () => {
  it("queues everything until the provider is ready, then sends it in order", async () => {
    const provider = fakeProvider();
    const analytics = createAnalytics(provider);

    analytics.pageview("https://example.com/draw/pug");
    analytics.track("category_viewed", { category: "animals" });
    expect(provider.capture).not.toHaveBeenCalled();
    expect(provider.pageview).not.toHaveBeenCalled();

    await analytics.init();

    expect(provider.pageview).toHaveBeenCalledWith(
      "https://example.com/draw/pug",
    );
    expect(provider.capture).toHaveBeenCalledWith("category_viewed", {
      category: "animals",
    });
    expect(provider.pageview.mock.invocationCallOrder[0]).toBeLessThan(
      provider.capture.mock.invocationCallOrder[0] ?? 0,
    );
  });

  it("sends directly once ready", async () => {
    const provider = fakeProvider();
    const analytics = createAnalytics(provider);
    await analytics.init();

    analytics.track("packs_link_clicked", { source: "hero" });
    expect(provider.capture).toHaveBeenCalledWith("packs_link_clicked", {
      source: "hero",
    });
  });

  it("starts the provider only once", async () => {
    const provider = fakeProvider();
    const analytics = createAnalytics(provider);
    await Promise.all([analytics.init(), analytics.init()]);
    await analytics.init();
    expect(provider.init).toHaveBeenCalledTimes(1);
  });

  it("keeps working when the provider fails to start", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const provider = fakeProvider(() => {
      throw new Error("blocked");
    });
    const analytics = createAnalytics(provider);

    await expect(analytics.init()).resolves.toBeUndefined();
    expect(() =>
      analytics.track("category_viewed", { category: "animals" }),
    ).not.toThrow();
    expect(provider.capture).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it("drops the oldest queued items past the limit", async () => {
    const provider = fakeProvider();
    const analytics = createAnalytics(provider);
    for (let i = 0; i < 60; i += 1) {
      analytics.track("category_viewed", { category: `c${i}` });
    }
    await analytics.init();
    expect(provider.capture).toHaveBeenCalledTimes(50);
    expect(provider.capture).not.toHaveBeenCalledWith("category_viewed", {
      category: "c0",
    });
    expect(provider.capture).toHaveBeenCalledWith("category_viewed", {
      category: "c59",
    });
  });
});
