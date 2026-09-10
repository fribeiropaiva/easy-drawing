import { z } from "zod";

/**
 * Environment variables, validated once when the module is first imported.
 *
 * Everything here is read on the server: no key carries the `NEXT_PUBLIC_`
 * prefix, so nothing in this file is bundled for the browser. Import it from
 * Server Components, route handlers and `next.config.ts` only.
 *
 * Later phases add the server-only keys (Supabase service role, Stripe, R2,
 * Resend) to this schema, and the genuinely browser-side Supabase keys
 * (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
 * PROJECT_PLAN.md §74) to a separate public schema.
 */
const serverSchema = z.object({
  SITE_URL: z.url({
    error: "must be an absolute URL such as https://example.com",
  }),
});

/**
 * A Client Component that imported this file would find `process.env.SITE_URL`
 * undefined, fall through to the localhost default below and quietly render
 * localhost canonicals. Fail loudly instead: pass the value down as a prop.
 */
if (typeof window !== "undefined") {
  throw new Error(
    "lib/env.ts is server-only: SITE_URL is never sent to the browser.",
  );
}

type SiteUrlEnv = Readonly<Record<string, string | undefined>>;

/**
 * The canonical origin. Every canonical link, Open Graph URL, sitemap entry and
 * the Sitemap line in robots.txt is built from it (lib/seo/metadata.ts), so one
 * wrong value here points search engines at the wrong host for the whole site.
 *
 * A production deployment must therefore say which host it is: only the project
 * knows whether apex or www is canonical, and the Vercel-provided hosts are
 * per-deployment. Preview and local builds keep guessing, where a deployment
 * URL is the right answer and nothing is indexed.
 */
export function inferSiteUrl(env: SiteUrlEnv = process.env): string {
  if (env.SITE_URL) {
    return env.SITE_URL;
  }
  if (env.VERCEL_ENV === "production") {
    throw new Error(
      "SITE_URL must be set on production deployments: it is the canonical origin for every canonical link, sitemap entry and Open Graph URL.",
    );
  }
  const vercelHost = env.VERCEL_PROJECT_PRODUCTION_URL ?? env.VERCEL_URL;
  if (vercelHost) {
    return `https://${vercelHost}`;
  }
  return "http://localhost:3000";
}

export function parseEnv<TSchema extends z.ZodType>(
  schema: TSchema,
  values: unknown,
): z.infer<TSchema> {
  const result = schema.safeParse(values);
  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  ${issue.path.map(String).join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid environment variables:\n${issues}`);
  }
  return result.data;
}

export const serverEnv = parseEnv(serverSchema, {
  SITE_URL: inferSiteUrl(),
});
