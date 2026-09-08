# Easy Drawing

Step-by-step drawing tutorial site. Every subject (for example "Coconut Tree") lives at one URL,
`/draw/coconut-tree`, and has up to three levels: beginner, intermediate, advanced. Paid content
will be sold as tutorial packs (themed bundles bought once), not subscriptions. Packs are not for
sale yet, so every published level is free and the site says packs are coming soon.

@AGENTS.md

## Source of truth

- `PROJECT_PLAN.md` is the full specification. Read it before making architectural decisions.
- `docs/decisions.md` records the architectural decisions taken while implementing each phase.

## Non-negotiable rules

- Tutorial artwork is created outside the app and uploaded through Admin. Never generate, alter or
  reconstruct tutorial images, and never integrate image-generation APIs.
- Work one phase at a time (PROJECT_PLAN.md §82). Finish the phase, run the checks below, summarise,
  then stop and wait for approval before the next phase.
- Paid (pack) content is protected on the server only (entitlements plus signed URLs). Blur, hidden DOM
  or client state is never security.
- Do not add features or dependencies outside the current phase.

## Commands

```bash
pnpm dev          # local dev server (Turbopack)
pnpm build        # production build
pnpm lint         # eslint (eslint-config-next + prettier)
pnpm format       # prettier --write .
pnpm typecheck    # next typegen && tsc --noEmit
pnpm test         # vitest run (unit tests live next to the code as *.test.ts)
pnpm check        # lint + typecheck + test
```

## Where things live

- `app/` routes (App Router, Server Components by default, Client Components only when needed).
- `components/ui` shadcn components (Base UI primitives). Other folders: `layout`, `tutorial`,
  `paywall`, `shared`.
- `lib/tutorials/queries.ts` is the only data-access entry point for tutorial content (mock data now,
  Supabase from Phase 2). Pages and components never import mock data directly.
- `lib/assets/public-url.ts` turns stored R2 object keys into URLs. The database stores keys, never URLs.
- `lib/entitlements/can-access-tutorial-level.ts` is the single access rule for pack levels.
- `lib/packs.ts` is the only place that describes the pack offer; nothing is for sale yet.
- `lib/env.ts` validates environment variables and is imported by `next.config.ts`.
- `lib/analytics` is the only code that talks to the analytics provider (PostHog, cookieless, proxied
  through `/ingest`). Events are typed in `lib/analytics/events.ts`; client code calls `track()`,
  Server Components render `<TrackEvent>` or `<TrackedLink>` from `components/analytics`. Without
  `NEXT_PUBLIC_POSTHOG_KEY` nothing is sent (development logs to the console).
- `types/tutorial.ts` holds the domain types (camelCase mirror of the database model).
- Real worksheets are `<slug>-<level>.png` (2:3, 1024x1536) under `public/mock-assets/tutorials/<slug>/`,
  flat (lighthouse) or in per-level folders (coconut-tree, sunset, boat-on-shore); `assetFolder` in
  `lib/tutorials/mock-data.ts` picks the layout. Dog breeds are one subject each and keep their sheets
  together per breed: `tutorials/dog/<breed>/dog-<breed>-<level>.png` (see `dogBreed()`).
  Levels without artwork use labelled placeholder frames (regenerate with
  `node scripts/make-placeholders.mjs public/mock-assets`).

## Conventions

- TypeScript strict with `noUncheckedIndexedAccess`; no `any`.
- Link-styled buttons use `buttonVariants()` on `next/link`; real buttons use `Button`.
- Free / pack / coming-soon state is never colour-only: always icon plus text.
- Headings: h1 and h2 use the display font (Fraunces); everything else Figtree.

## Phase status

- Phase 1 (foundation, mock data) is complete. The analytics abstraction (Phase 12) was pulled
  forward on 2026-09-07 at the owner's request.
- Next: Phase 2 (Supabase schema, migrations, RLS, seed) after explicit approval.
