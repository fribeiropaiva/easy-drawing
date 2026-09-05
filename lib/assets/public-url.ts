/**
 * The database stores R2 object keys, never URLs (PROJECT_PLAN.md §19).
 * This is the single place that turns a key into something the browser can load.
 *
 * Phase 1: mock assets live in /public/mock-assets.
 * Phase 6: public assets resolve to the R2 public bucket URL; premium originals
 * are never resolved here and only ever leave the server as short-lived signed URLs.
 */
export function getPublicAssetUrl(key: string): string {
  return `/mock-assets/${key}`;
}
