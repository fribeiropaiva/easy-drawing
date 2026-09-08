import { z } from "zod";

import { DEFAULT_POSTHOG_HOST } from "./analytics/hosts";

/**
 * Environment variables, validated once when the module is first imported.
 *
 * Only public variables so far: the site URL and the optional analytics key.
 * Later phases add server-only keys (Supabase, R2, payments, Resend) in a
 * separate schema that is never imported from client code.
 */
const publicSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url({
    error: "must be an absolute URL such as https://example.com",
  }),
  /** PostHog project key. Optional: without it nothing is sent (see lib/analytics). */
  NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1).optional(),
  /** PostHog ingestion host; the EU cloud unless overridden. */
  NEXT_PUBLIC_POSTHOG_HOST: z
    .url({ error: "must be an absolute URL such as https://eu.i.posthog.com" })
    .default(DEFAULT_POSTHOG_HOST),
});

function inferSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  const vercelHost =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
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
  NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY || undefined,
  NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST || undefined,
});
