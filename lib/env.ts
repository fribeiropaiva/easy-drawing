import { z } from "zod";

/**
 * Environment variables, validated once when the module is first imported.
 *
 * Phase 1 only needs the public site URL. Later phases add server-only keys
 * (Supabase, Stripe, R2, Resend) in a separate schema that is never imported
 * from client code.
 */
const publicSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url({
    error: "must be an absolute URL such as https://example.com",
  }),
});

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
  if (env.NEXT_PUBLIC_SITE_URL) {
    return env.NEXT_PUBLIC_SITE_URL;
  }
  if (env.VERCEL_ENV === "production") {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL must be set on production deployments: it is the canonical origin for every canonical link, sitemap entry and Open Graph URL.",
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

export const publicEnv = parseEnv(publicSchema, {
  NEXT_PUBLIC_SITE_URL: inferSiteUrl(),
});
