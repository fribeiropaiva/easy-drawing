# Easy Drawing

Step-by-step drawing tutorials at three levels (beginner, intermediate, advanced), one URL per subject.
The full specification lives in `PROJECT_PLAN.md`; implementation notes in `docs/decisions.md`.

## Getting started

```bash
pnpm install
cp .env.example .env.local   # optional locally
pnpm dev                     # http://localhost:3000
```

## Checks

```bash
pnpm check   # lint, typecheck, unit tests
pnpm build   # production build
```

Phase 1 uses mock content from `lib/tutorials/mock-data.ts` and labelled placeholder worksheets in
`public/mock-assets/`. Real tutorial artwork is produced outside the app and uploaded through Admin
in a later phase.
