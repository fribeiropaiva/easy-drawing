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
});
