/**
 * Tutorial packs are the paid offer: themed bundles of tutorials bought once
 * (docs/decisions.md #19). Nothing is for sale yet, so every published level is
 * free and the site says packs are coming soon. Pack names, contents and prices
 * arrive with the pack model; keep this the only place that describes the offer.
 */
export const freeRightNow = [
  "Every beginner tutorial",
  "Every intermediate tutorial",
  "Every advanced tutorial",
  "No account needed",
] as const;
