import type {
  AccessType,
  ArtworkStatus,
  Category,
  Difficulty,
  Tutorial,
  TutorialLevel,
} from "@/types/tutorial";

/**
 * Phase 1 mock content. Replaced by Supabase in Phase 2.
 *
 * Image keys follow the R2 layout from PROJECT_PLAN.md §20 and resolve to
 * placeholder SVGs under /public/mock-assets. The placeholders are labelled
 * frames, not drawings: real worksheets are produced outside the app.
 */

export const mockCategories: Category[] = [
  {
    id: "cat_beach-ocean",
    name: "Beach & Ocean",
    slug: "beach-ocean",
    description:
      "Coconut trees, boats, lighthouses and everything else you find by the sea.",
    imageKey: null,
    sortOrder: 1,
  },
  {
    id: "cat_animals",
    name: "Animals",
    slug: "animals",
    description:
      "Pets, wildlife, birds and insects, from simple shapes to fur and feathers.",
    imageKey: null,
    sortOrder: 2,
  },
  {
    id: "cat_nature",
    name: "Nature",
    slug: "nature",
    description: "Trees, leaves, mountains and skies.",
    imageKey: null,
    sortOrder: 3,
  },
  {
    id: "cat_flowers",
    name: "Flowers",
    slug: "flowers",
    description: "Single blooms and full bouquets, petal by petal.",
    imageKey: null,
    sortOrder: 4,
  },
  {
    id: "cat_landscapes",
    name: "Landscapes",
    slug: "landscapes",
    description: "Horizons, hills, sunsets and open skies.",
    imageKey: null,
    sortOrder: 5,
  },
  {
    id: "cat_buildings",
    name: "Buildings",
    slug: "buildings",
    description: "Houses, towers and lighthouses, with simple perspective.",
    imageKey: null,
    sortOrder: 6,
  },
  {
    id: "cat_objects",
    name: "Objects",
    slug: "objects",
    description: "Everyday things that make great practice subjects.",
    imageKey: null,
    sortOrder: 7,
  },
];

interface LevelInput {
  access: AccessType;
  steps?: number;
  intro?: string;
  /** "missing" means the level row exists but no artwork has been uploaded yet. */
  artwork?: ArtworkStatus | "missing";
  preview?: boolean;
}

function level(
  slug: string,
  difficulty: Difficulty,
  input: LevelInput,
): TutorialLevel {
  const artwork = input.artwork ?? "published";
  const hasImage = artwork !== "missing";
  return {
    id: `lvl_${slug}_${difficulty}`,
    tutorialId: `tut_${slug}`,
    difficulty,
    accessType: input.access,
    tutorialImageKey: hasImage
      ? `tutorials/${slug}/${difficulty}/tutorial-mock.svg`
      : null,
    previewImageKey: input.preview
      ? `tutorials/${slug}/${difficulty}/preview-mock.svg`
      : null,
    printableFileKey: null,
    introduction: input.intro ?? null,
    stepCount: input.steps ?? null,
    artworkStatus: artwork === "missing" ? "draft" : artwork,
  };
}

interface TutorialInput {
  slug: string;
  title: string;
  categoryId: string;
  description: string;
  status?: Tutorial["status"];
  featured?: boolean;
  publishedAt?: string;
  levels: Partial<Record<Difficulty, LevelInput>>;
}

function tutorial(input: TutorialInput): Tutorial {
  return {
    id: `tut_${input.slug}`,
    title: input.title,
    slug: input.slug,
    description: input.description,
    categoryId: input.categoryId,
    featuredImageKey: `tutorials/${input.slug}/thumbnail/thumbnail.svg`,
    seoTitle: null,
    seoDescription: null,
    status: input.status ?? "published",
    featured: input.featured ?? false,
    publishedAt: input.publishedAt ?? null,
    levels: (Object.entries(input.levels) as [Difficulty, LevelInput][]).map(
      ([difficulty, levelInput]) => level(input.slug, difficulty, levelInput),
    ),
  };
}

export const mockTutorials: Tutorial[] = [
  tutorial({
    slug: "coconut-tree",
    title: "Coconut Tree",
    categoryId: "cat_beach-ocean",
    description:
      "A leaning trunk, a crown of fronds and a few coconuts. The classic tropical tree at three levels of detail.",
    featured: true,
    publishedAt: "2026-08-10T09:00:00.000Z",
    levels: {
      beginner: {
        access: "free",
        steps: 6,
        intro:
          "Start with a curved trunk and a simple burst of fronds. Six steps take you from two guide lines to a finished tree you can shade with a single pencil.",
      },
      intermediate: {
        access: "free",
        steps: 8,
        intro:
          "Build the same tree with a fuller crown: overlapping fronds, a textured trunk and a cluster of coconuts. Eight steps, with tips on keeping the leaves balanced.",
      },
      advanced: {
        access: "premium",
        steps: 10,
        preview: true,
        intro:
          "Draw a windswept coconut tree with individual leaflets, bark rings and cast shadows. Ten steps that finish with layered pencil shading.",
      },
    },
  }),
  tutorial({
    slug: "sunset",
    title: "Sunset",
    categoryId: "cat_landscapes",
    description:
      "Sky bands, a low sun and a calm sea. A relaxing subject that teaches simple shading.",
    featured: true,
    publishedAt: "2026-08-14T09:00:00.000Z",
    levels: {
      beginner: {
        access: "free",
        steps: 5,
        intro:
          "A horizon line, a half sun and a few bands of sky. Five relaxed steps.",
      },
      intermediate: {
        access: "premium",
        steps: 8,
        preview: true,
        intro:
          "Add clouds catching the light, gentle waves and a silhouetted shoreline. Eight steps with shading tips.",
      },
      advanced: { access: "premium", artwork: "missing" },
    },
  }),
  tutorial({
    slug: "boat-on-shore",
    title: "Boat on a Shore",
    categoryId: "cat_beach-ocean",
    description:
      "A small boat pulled up on the sand, from a simple outline to weathered planks.",
    publishedAt: "2026-08-18T09:00:00.000Z",
    levels: {
      beginner: {
        access: "free",
        steps: 6,
        intro:
          "A small rowing boat resting on the sand, drawn from simple curves. Six steps.",
      },
      intermediate: {
        access: "premium",
        steps: 8,
        preview: true,
        intro:
          "Planks, an anchor rope and ripples in the wet sand. Eight steps.",
      },
    },
  }),
  tutorial({
    slug: "butterfly",
    title: "Butterfly",
    categoryId: "cat_animals",
    description:
      "Symmetry practice with an easy wing shape and a pattern you can make your own.",
    publishedAt: "2026-08-22T09:00:00.000Z",
    levels: {
      beginner: {
        access: "free",
        steps: 5,
        intro:
          "Symmetrical wings from two ovals and a body. Five steps, with a simple pattern to finish.",
      },
    },
  }),
  tutorial({
    slug: "dog",
    title: "Dog",
    categoryId: "cat_animals",
    description:
      "A friendly sitting dog. Start with simple shapes, then work up to fur and expression.",
    featured: true,
    publishedAt: "2026-08-26T09:00:00.000Z",
    levels: {
      beginner: {
        access: "free",
        steps: 6,
        intro:
          "A sitting dog built from circles and a rounded muzzle. Six friendly steps.",
      },
      intermediate: {
        access: "premium",
        steps: 8,
        preview: true,
        intro:
          "Add floppy ears, a collar and the first fur texture. Eight steps.",
      },
      advanced: {
        access: "free",
        steps: 10,
        intro:
          "A full portrait with layered fur, a wet nose and expressive eyes. Ten steps, free as a sample of our advanced tutorials.",
      },
    },
  }),
  tutorial({
    slug: "lighthouse",
    title: "Lighthouse",
    categoryId: "cat_buildings",
    description:
      "A tall striped tower on the rocks, with railings, windows and waves.",
    featured: true,
    publishedAt: "2026-08-30T09:00:00.000Z",
    levels: {
      beginner: {
        access: "free",
        steps: 7,
        intro: "A tapered tower, a lantern room and a rocky base. Seven steps.",
      },
      intermediate: {
        access: "premium",
        steps: 9,
        preview: true,
        intro:
          "Stripes, railings, windows and a rocky shoreline with spray. Nine steps.",
      },
      advanced: { access: "premium", artwork: "missing" },
    },
  }),
  // Draft subject: must never appear on public pages.
  tutorial({
    slug: "palm-tree",
    title: "Palm Tree",
    categoryId: "cat_beach-ocean",
    description: "A tall, slender palm with a small crown. Not published yet.",
    status: "draft",
    levels: {
      beginner: { access: "free", steps: 6 },
    },
  }),
];
