import type {
  AccessType,
  ArtworkStatus,
  Category,
  Difficulty,
  Tutorial,
  TutorialLevel,
} from "@/types/tutorial";

import { DIFFICULTIES } from "./levels";

/**
 * Phase 1 mock content. Replaced by Supabase in Phase 2.
 *
 * Image keys follow the R2 layout from PROJECT_PLAN.md §20 and resolve to files
 * under /public/mock-assets. Real worksheets are named `<slug>-<difficulty>.png`.
 * The earliest subjects keep them in `tutorials/<slug>/<difficulty>/`; newer ones
 * are organised by subject, not difficulty: one flat `tutorials/<slug>/` folder
 * (see `animal`), or `tutorials/<species>/<breed>/` for dog and cat breeds (see
 * `breed`). Levels without artwork yet use labelled placeholder frames generated
 * by scripts/make-placeholders.mjs.
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

const PLACEHOLDER_WORKSHEET = "tutorial-mock.svg";
const PLACEHOLDER_PREVIEW = "preview-mock.svg";
const PLACEHOLDER_THUMBNAIL = "thumbnail/thumbnail.svg";

interface LevelInput {
  access: AccessType;
  steps?: number;
  intro?: string;
  /** "missing" means the level row exists but no artwork has been uploaded yet. */
  artwork?: ArtworkStatus | "missing";
  /** Worksheet file name inside the level's asset folder. Defaults to the placeholder. */
  file?: string;
  /** Public preview for pack levels: `true` for the placeholder, or a file name in the level folder. */
  preview?: boolean | string;
}

function level(
  slug: string,
  difficulty: Difficulty,
  /** Folder under tutorials/ that holds this level's files. */
  folder: string,
  input: LevelInput,
): TutorialLevel {
  const artwork = input.artwork ?? "published";
  const hasImage = artwork !== "missing";
  const file = input.file ?? PLACEHOLDER_WORKSHEET;
  const previewFile =
    input.preview === true
      ? PLACEHOLDER_PREVIEW
      : input.preview
        ? input.preview
        : null;
  return {
    id: `lvl_${slug}_${difficulty}`,
    tutorialId: `tut_${slug}`,
    difficulty,
    accessType: input.access,
    tutorialImageKey: hasImage ? `tutorials/${folder}/${file}` : null,
    previewImageKey: previewFile ? `tutorials/${folder}/${previewFile}` : null,
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
  /**
   * One folder under tutorials/ that holds every level's files side by side.
   * By default each level has its own folder, `<slug>/<difficulty>/`.
   */
  assetFolder?: string;
  /** Thumbnail path relative to the subject's folder under tutorials/. Defaults to the placeholder. */
  thumbnail?: string;
  levels: Partial<Record<Difficulty, LevelInput>>;
}

function tutorial(input: TutorialInput): Tutorial {
  const subjectFolder = input.assetFolder ?? input.slug;
  return {
    id: `tut_${input.slug}`,
    title: input.title,
    slug: input.slug,
    description: input.description,
    categoryId: input.categoryId,
    featuredImageKey: `tutorials/${subjectFolder}/${input.thumbnail ?? PLACEHOLDER_THUMBNAIL}`,
    seoTitle: null,
    seoDescription: null,
    status: input.status ?? "published",
    featured: input.featured ?? false,
    publishedAt: input.publishedAt ?? null,
    levels: (Object.entries(input.levels) as [Difficulty, LevelInput][]).map(
      ([difficulty, levelInput]) =>
        level(
          input.slug,
          difficulty,
          input.assetFolder ?? `${input.slug}/${difficulty}`,
          levelInput,
        ),
    ),
  };
}

// Every published level is free until tutorial packs launch (lib/packs.ts). When a
// level moves into a pack, give it `access: "pack"` plus a `preview: "<file>"` sheet
// (for example the first row of steps) so visitors still get a public preview.

type AnimalLevelInput = Omit<LevelInput, "access" | "artwork" | "file"> & {
  access?: AccessType;
};

interface AnimalInput {
  /** Tutorial slug, e.g. "elephant". Doubles as the asset folder name. */
  slug: string;
  title: string;
  description: string;
  featured?: boolean;
  publishedAt: string;
  levels: Partial<Record<Difficulty, AnimalLevelInput>>;
}

/**
 * A subject in the Animals category whose real sheets all sit side by side in
 * `tutorials/<folder>/`, named `<prefix>-<difficulty>.png`: organised by animal,
 * not by difficulty. The easiest sheet doubles as the thumbnail. Every level is
 * free until packs launch (see above).
 */
function animalSubject(
  folder: string,
  prefix: string,
  input: AnimalInput,
): Tutorial {
  const file = (difficulty: Difficulty) => `${prefix}-${difficulty}.png`;
  const levels: Partial<Record<Difficulty, LevelInput>> = {};
  for (const difficulty of DIFFICULTIES) {
    const levelInput = input.levels[difficulty];
    if (levelInput) {
      levels[difficulty] = {
        ...levelInput,
        access: levelInput.access ?? "free",
        file: file(difficulty),
      };
    }
  }
  const easiest = DIFFICULTIES.find((difficulty) => input.levels[difficulty]);
  if (!easiest) {
    throw new Error(`Animal "${input.slug}" has no levels`);
  }
  return tutorial({
    slug: input.slug,
    title: input.title,
    categoryId: "cat_animals",
    description: input.description,
    featured: input.featured,
    publishedAt: input.publishedAt,
    assetFolder: folder,
    thumbnail: file(easiest),
    levels,
  });
}

/** A single-species animal: `tutorials/<slug>/<slug>-<difficulty>.png`. */
function animal(input: AnimalInput): Tutorial {
  return animalSubject(input.slug, input.slug, input);
}

interface BreedInput extends Omit<AnimalInput, "slug"> {
  /** Breed slug, e.g. "golden-retriever". Names the asset folder. */
  breed: string;
}

/**
 * Each dog or cat breed is its own subject. Its sheets are grouped by breed,
 * `tutorials/<species>/<breed>/<species>-<breed>-<difficulty>.png`.
 */
function breed(
  species: "dog" | "cat",
  input: BreedInput,
  slug = input.breed,
): Tutorial {
  const { breed: breedSlug, ...rest } = input;
  return animalSubject(`${species}/${breedSlug}`, `${species}-${breedSlug}`, {
    ...rest,
    slug,
  });
}

/** Dog sheets say "How to draw a pug", so a dog lives at `/draw/pug`. */
function dogBreed(input: BreedInput): Tutorial {
  return breed("dog", input);
}

/** Cat sheets say "How to draw a Persian cat", so a cat lives at `/draw/persian-cat`. */
function catBreed(input: BreedInput): Tutorial {
  return breed("cat", input, `${input.breed}-cat`);
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
    thumbnail: "beginner/coconut-tree-beginner.png",
    levels: {
      beginner: {
        access: "free",
        steps: 6,
        file: "coconut-tree-beginner.png",
        intro:
          "One curved line for the trunk, a small crown, then the fronds one set at a time. Six steps that end with trunk texture and a simple shoreline.",
      },
      intermediate: {
        access: "free",
        steps: 6,
        file: "coconut-tree-intermediate.png",
        intro:
          "The same tree with a thicker, tapered trunk, overlapping fronds, leaf strands and a cluster of coconuts. Six steps, finishing with sand, sea and a distant island.",
      },
      advanced: {
        access: "free",
        steps: 12,
        file: "coconut-tree-advanced.png",
        intro:
          "Guide lines, a textured trunk and a full crown built frond by frond, then shading, ground details and a beach background. Twelve steps, drawn lightly at first.",
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
    thumbnail: "beginner/sunset-beginner.png",
    levels: {
      beginner: {
        access: "free",
        steps: 6,
        file: "sunset-beginner.png",
        intro:
          "A horizon line, a half-circle sun and its reflection, a few waves, a curved beach and some final details. Six steps.",
      },
      intermediate: { access: "free", artwork: "missing" },
      advanced: {
        access: "free",
        steps: 12,
        file: "sunset-advanced.png",
        intro:
          "Horizon, sun and reflection first, then clouds, distant land, palm leaves in the foreground, shading and highlights. Twelve steps.",
      },
    },
  }),
  tutorial({
    slug: "boat-on-shore",
    title: "Boat on a Shore",
    categoryId: "cat_beach-ocean",
    description:
      "A small boat pulled up on the sand, from a simple outline to weathered planks and a full beach scene.",
    publishedAt: "2026-08-18T09:00:00.000Z",
    // All three sheets sit flat in tutorials/boat-on-shore/, like the lighthouse.
    assetFolder: "boat-on-shore",
    thumbnail: "boat-on-shore-beginner.png",
    levels: {
      beginner: {
        access: "free",
        steps: 6,
        file: "boat-on-shore-beginner.png",
        intro:
          "A curved horizon, a wavy shoreline and a simple bowl-shaped hull, then the rim, a post with a rope and sand details. Six steps.",
      },
      intermediate: {
        access: "free",
        steps: 6,
        file: "boat-on-shore-intermediate.png",
        intro:
          "A curving shoreline, a hull with planks and seats, a rope on the front post, then waves, sand texture, clouds and a distant island. Six steps.",
      },
      advanced: {
        access: "free",
        steps: 12,
        file: "boat-on-shore-advanced.png",
        intro:
          "A horizon line and a curving shoreline, the boat outlined over guide lines, then its sides, seats and a rope, shading and wood texture, the water, sand details, a distant island, clouds and final touches such as grass and a palm leaf. Twelve steps, drawn lightly at first.",
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
        steps: 6,
        intro:
          "Symmetrical wings from two ovals and a body. Six steps, with a simple pattern to finish.",
      },
    },
  }),
  tutorial({
    slug: "lighthouse",
    title: "Lighthouse",
    categoryId: "cat_buildings",
    description:
      "A tall tower on the rocks, from simple stripes and waves to stone texture, a keeper's house and a full seascape.",
    featured: true,
    publishedAt: "2026-08-30T09:00:00.000Z",
    // Only three sheets, so they sit flat in tutorials/lighthouse/ instead of per-level folders.
    assetFolder: "lighthouse",
    thumbnail: "lighthouse-beginner.png",
    levels: {
      beginner: {
        access: "free",
        steps: 6,
        file: "lighthouse-beginner.png",
        intro:
          "A tall trapezoid, a small roof and platform on top, then windows, horizontal stripes, rocks at the base and a few wavy water lines. Six steps.",
      },
      intermediate: {
        access: "free",
        steps: 6,
        file: "lighthouse-intermediate.png",
        intro:
          "Block in the composition with a horizon line, then the tower with its platform and lantern room, windows, railing and door, a rocky foreground with a path and fence posts, stone texture and shading, and finally waves, distant land, clouds and birds. Six steps.",
      },
      advanced: {
        access: "free",
        steps: 12,
        file: "lighthouse-advanced.png",
        intro:
          "Guide lines and basic shapes, a refined structure with railing, windows and door, then the rocky base and a small keeper's house, stone texture, contours, shading, the sea, clouds, coastline and birds, and final touches. Twelve steps, drawn lightly at first.",
      },
    },
  }),

  // Dog breeds, in the order their sheets were drawn.
  dogBreed({
    breed: "pug",
    title: "Pug",
    description:
      "A stocky little dog with a wrinkled face, folded ears and a curled tail, from six simple shapes to a fully shaded portrait.",
    publishedAt: "2026-09-05T19:18:00.000Z",
    levels: {
      beginner: {
        steps: 6,
        intro:
          "A circle for the head and an oval for the body, simple legs, then the folded ears and curled tail, the face and a few wrinkle lines. Six steps.",
      },
      intermediate: {
        steps: 10,
        intro:
          "Pose and guides, a refined body, the head and its wrinkled face, then legs and paws, skin folds, short fur, shading and a patch of grass. Ten steps.",
      },
      advanced: {
        steps: 12,
        intro:
          "Guide lines and proportions, a boxy head construction, then the wrinkled face, body structure, fur outlines, texture, shading, a ground shadow and final details. Twelve steps, drawn lightly at first.",
      },
    },
  }),
  dogBreed({
    breed: "labrador-retriever",
    title: "Labrador Retriever",
    description:
      "A sturdy, friendly labrador standing side-on. Simple shapes first, then muscle, short fur and shading.",
    publishedAt: "2026-09-05T19:24:00.000Z",
    levels: {
      beginner: {
        steps: 6,
        intro:
          "A circle and an oval, four simple legs, floppy ears and a tail, then the face and a few detail lines. Six steps.",
      },
      intermediate: {
        steps: 10,
        intro:
          "Pose and guides, refined contours, the head and face in detail, legs and paws, muscle definition, short fur, shading and a simple background. Ten steps.",
      },
      advanced: {
        steps: 12,
        intro:
          "Guide lines and proportions, head construction and details, then body structure, a refined form, the short dense coat, shading, a ground shadow and a simple background. Twelve steps.",
      },
    },
  }),
  dogBreed({
    breed: "golden-retriever",
    title: "Golden Retriever",
    description:
      "A golden retriever with feathered fur and a happy face. Start with circles, then build up the long coat and shading.",
    featured: true,
    publishedAt: "2026-09-05T19:25:00.000Z",
    levels: {
      beginner: {
        steps: 6,
        intro:
          "Head and body from a circle and an oval, then legs, floppy ears and a feathered tail, the face and some fur details. Six steps.",
      },
      intermediate: {
        steps: 10,
        intro:
          "Pose and guides, refined contours, the head and face, legs and paws, then the long wavy coat in two passes, shading and a grassy scene with hills. Ten steps.",
      },
      advanced: {
        steps: 12,
        intro:
          "Guide lines, proportions and head construction, then body structure, fur outlines, the feathered coat, facial details, shading, a ground shadow and a background. Twelve steps.",
      },
    },
  }),
  dogBreed({
    breed: "border-collie",
    title: "Border Collie",
    description:
      "A border collie mid-stride, with its white blaze and thick coat. Six easy steps, or a full realistic drawing at advanced.",
    publishedAt: "2026-09-05T19:26:00.000Z",
    levels: {
      beginner: {
        steps: 6,
        intro:
          "A circle, an oval and simple legs, then the ears and bushy tail, the face and the collie's fur markings. Six steps.",
      },
      advanced: {
        steps: 12,
        intro:
          "Guide lines and proportions, a boxy head, then body structure, fur outlines, the black and white coat with its long fur texture, shading, a ground shadow and final details. Twelve steps.",
      },
    },
  }),
  dogBreed({
    breed: "german-shepherd",
    title: "German Shepherd",
    description:
      "A german shepherd with upright ears and a sloping back. Cartoon-simple at beginner, fully rendered at advanced.",
    publishedAt: "2026-09-05T19:27:00.000Z",
    levels: {
      beginner: {
        steps: 6,
        intro:
          "A circle and an oval, simple legs, upright ears and a low tail, then the face and the fur markings. Six steps.",
      },
      advanced: {
        steps: 12,
        intro:
          "Guide lines and proportions, the long muzzle and upright ears, then body structure, fur outlines, the saddle markings, shading, a ground shadow and a background. Twelve steps.",
      },
    },
  }),
  dogBreed({
    breed: "poodle",
    title: "Poodle",
    description:
      "A poodle with its classic clipped coat: topknot, fluffy ears and pom-pom legs, drawn with simple curls first and detailed texture later.",
    publishedAt: "2026-09-05T19:29:00.000Z",
    levels: {
      beginner: {
        steps: 6,
        intro:
          "A circle, an oval and simple legs, then the fluffy ears, topknot and tail, the face and the pom-pom fur on the legs. Six steps.",
      },
      intermediate: {
        steps: 10,
        intro:
          "Pose and guides, a refined body, the head with its long ears, the face, legs and paws, then the curly coat and clipped trim, shading and a garden background. Ten steps.",
      },
      advanced: {
        steps: 12,
        intro:
          "Guide lines and proportions, head construction with the topknot, then body structure, the clipped coat outlined and textured curl by curl, shading, a ground shadow and final details. Twelve steps.",
      },
    },
  }),
  dogBreed({
    breed: "husky",
    title: "Husky",
    description:
      "A husky with pointed ears, a bushy curled tail and the classic mask markings. Six simple steps.",
    publishedAt: "2026-09-05T19:31:00.000Z",
    levels: {
      beginner: {
        steps: 6,
        intro:
          "A circle and an oval, simple legs, pointed ears and a curled bushy tail, then the face and the husky's mask markings. Six steps.",
      },
    },
  }),
  dogBreed({
    breed: "pitbull",
    title: "Pitbull",
    description:
      "A muscular pitbull with a broad head and folded ears. Simple shapes, then muscle lines, short fur and shading.",
    publishedAt: "2026-09-05T19:42:00.000Z",
    levels: {
      beginner: {
        steps: 6,
        intro:
          "A circle and an oval, sturdy legs, small folded ears and a tail, then the face and a few muscle lines. Six steps.",
      },
      intermediate: {
        steps: 10,
        intro:
          "Pose and guides, refined contours, the head with folded ears, the face, legs and paws, muscle definition, short fur, shading and a simple scene. Ten steps.",
      },
      advanced: {
        steps: 12,
        intro:
          "Guide lines and proportions, a broad head, then the muscular body structure, a refined form, short fur, facial details, shading, a ground shadow and a background. Twelve steps.",
      },
    },
  }),
  dogBreed({
    breed: "malinois",
    title: "Malinois",
    description:
      "A Belgian malinois with tall pointed ears and a dark muzzle, drawn from a few simple shapes in six steps.",
    publishedAt: "2026-09-05T19:46:00.000Z",
    levels: {
      beginner: {
        steps: 6,
        intro:
          "A circle and an oval, simple legs, tall pointed ears and a tail, then the face and the dark muzzle markings. Six steps.",
      },
    },
  }),
  dogBreed({
    breed: "dachshund",
    title: "Dachshund",
    description:
      "A long-bodied dachshund with floppy ears and short legs, from a clean outline to short fur, shading and a garden fence.",
    publishedAt: "2026-09-05T20:25:00.000Z",
    levels: {
      intermediate: {
        steps: 10,
        intro:
          "Pose and guides, the long low body, the head with floppy ears, the face, legs and paws, muscle definition, short smooth fur, shading and a fence in the background. Ten steps.",
      },
      advanced: {
        steps: 12,
        intro:
          "Guide lines and proportions, the long body and box-shaped muzzle, then body structure, fur outlines, facial details, short fur texture, shading, a ground shadow and final details. Twelve steps.",
      },
    },
  }),
  dogBreed({
    breed: "spitz",
    title: "Spitz",
    description:
      "A fluffy white spitz with a curled tail, a fox-like face and a thick double coat. Fur texture is the whole lesson here.",
    publishedAt: "2026-09-05T20:39:00.000Z",
    levels: {
      intermediate: {
        steps: 6,
        intro:
          "Pose and guides, a refined body with pointed ears, the face, then the thick fluffy fur in two passes and a simple background. Six steps.",
      },
      advanced: {
        steps: 12,
        intro:
          "Guide lines and proportions, the wedge-shaped head, then body structure, fur outlines, the thick double coat, facial details, shading, a ground shadow and final details. Twelve steps.",
      },
    },
  }),

  // Cat breeds, in the order their sheets were drawn.
  catBreed({
    breed: "maine-coon",
    title: "Maine Coon Cat",
    description:
      "A big, fluffy Maine Coon sitting front-on, with tufted ears and a long bushy tail. Six simple steps built on one circle.",
    publishedAt: "2026-09-07T15:29:00.000Z",
    levels: {
      beginner: {
        steps: 6,
        intro:
          "A circle for the head and two large pointed ears with tufts, then the face with eyes, nose, mouth and whiskers, a large fluffy body, the back legs and long bushy tail, and a few fur lines for the long hair. Six steps.",
      },
    },
  }),
  catBreed({
    breed: "ragdoll",
    title: "Ragdoll Cat",
    description:
      "A soft, fluffy ragdoll sitting upright, with triangle ears, big eyes and a long plumed tail. Six easy steps.",
    publishedAt: "2026-09-07T15:30:00.000Z",
    levels: {
      beginner: {
        steps: 6,
        intro:
          "A circle for the head and two triangle ears, then the face with eyes, nose, mouth and whiskers, a large fluffy body, the back legs and a long fluffy tail, and a few fur lines for the long soft coat. Six steps.",
      },
    },
  }),
  catBreed({
    breed: "persian",
    title: "Persian Cat",
    description:
      "A round, fluffy Persian with small ears, a flat face and big eyes, drawn from a circle and a cloud of fur in six steps.",
    publishedAt: "2026-09-07T15:33:00.000Z",
    levels: {
      beginner: {
        steps: 6,
        intro:
          "A circle for the head and two small rounded ears, then the flat face with big round eyes, a small nose, a short mouth and whiskers, a fluffy body, the back legs and a long fluffy tail, and fur lines for the thick coat. Six steps.",
      },
    },
  }),
  catBreed({
    breed: "siamese",
    title: "Siamese Cat",
    description:
      "A slim, elegant Siamese with large ears, almond eyes and the classic dark points on its ears, face, paws and tail. Six steps.",
    publishedAt: "2026-09-07T15:56:00.000Z",
    levels: {
      beginner: {
        steps: 6,
        intro:
          "A circle for the head and two large triangle ears, then the face with almond-shaped eyes, a small nose, mouth and whiskers, a slim body, the back legs and paws, and finally the long tail with the darker Siamese markings on the ears, face, paws and tail. Six steps.",
      },
    },
  }),

  // Other animals, one subject each, in the order their sheets were drawn.
  animal({
    slug: "lion",
    title: "Lion",
    description:
      "A friendly sitting lion with a zigzag mane and a tufted tail. Six simple steps from a single circle.",
    publishedAt: "2026-09-07T16:01:00.000Z",
    levels: {
      beginner: {
        steps: 6,
        intro:
          "A circle for the head and a zigzag mane around it, then the face inside the circle, a body from simple curved lines, the tail on the right and a few details on the paws and tail tip. Six steps.",
      },
    },
  }),
  animal({
    slug: "tiger",
    title: "Tiger",
    description:
      "A standing tiger cub with a round face and bold stripes, built from a circle, an oval and simple legs in six steps.",
    publishedAt: "2026-09-07T16:35:00.000Z",
    levels: {
      beginner: {
        steps: 6,
        intro:
          "A circle for the head, the ears and face guidelines, then the face with its stripes, a large oval body, the legs and paws, and finally the tail and the stripes on the body. Six steps.",
      },
    },
  }),
  animal({
    slug: "elephant",
    title: "Elephant",
    description:
      "A big-eared elephant standing side-on, with a trunk, tusks and a tufted tail. Six simple steps from two ovals.",
    publishedAt: "2026-09-07T16:53:00.000Z",
    levels: {
      beginner: {
        steps: 6,
        intro:
          "A large oval for the head and two big rounded ears, then the trunk and tusks, a large oval body, the legs and feet, and a tail with a tuft at the end. Six steps.",
      },
    },
  }),
  animal({
    slug: "rabbit",
    title: "Rabbit",
    description:
      "A rabbit with long ears, whiskers and a small fluffy tail, drawn from a circle and an oval in six easy steps.",
    publishedAt: "2026-09-07T17:35:00.000Z",
    levels: {
      beginner: {
        steps: 6,
        intro:
          "A circle for the head and two long ears, then the face with eyes, nose, mouth and whiskers, a large oval body, the front and back legs with paws, and a small fluffy tail. Six steps.",
      },
    },
  }),
  animal({
    slug: "shark",
    title: "Shark",
    description:
      "A grinning shark with a pointed nose, a dorsal fin and gill slits. Six easy steps from one fish-shaped body.",
    publishedAt: "2026-09-07T17:41:00.000Z",
    levels: {
      beginner: {
        steps: 6,
        intro:
          "A large fish-shaped body with a pointy front and the tail fin, then the dorsal fin and a lower fin, the eye and toothy mouth, the gill slits behind the head and a few detail lines to finish. Six steps.",
      },
    },
  }),
  animal({
    slug: "dolphin",
    title: "Dolphin",
    description:
      "A leaping dolphin with a curved back, a beak and a friendly smile. Six easy steps that start with one curved line.",
    publishedAt: "2026-09-07T17:52:00.000Z",
    levels: {
      beginner: {
        steps: 6,
        intro:
          "A curved line for the back and the tail fin, then the head and beak, the dorsal fin and a flipper, the eye and smile line, and a few simple details like a curved line along the side. Six steps.",
      },
    },
  }),
  animal({
    slug: "panda",
    title: "Panda",
    description:
      "A sitting panda with round ears and its black patches, drawn from a circle and an oval in six easy steps.",
    publishedAt: "2026-09-07T17:55:00.000Z",
    levels: {
      beginner: {
        steps: 6,
        intro:
          "A large circle for the head and two round ears, then the face with its eye patches, a large oval body, the arms and legs, and finally the black patches on the ears, arms and legs plus a belly line. Six steps.",
      },
    },
  }),
  animal({
    slug: "penguin",
    title: "Penguin",
    description:
      "A plump penguin drawn from two ovals, with little wings, a beak and webbed feet. Six easy steps.",
    publishedAt: "2026-09-07T19:10:00.000Z",
    levels: {
      beginner: {
        steps: 6,
        intro:
          "A large oval for the body and a smaller oval inside for the belly, then the head shape on top, the wings on the sides, the eyes and beak, and the feet to finish. Six steps.",
      },
    },
  }),
  animal({
    slug: "bear",
    title: "Bear",
    description:
      "A cuddly sitting bear with round ears and a big oval body, drawn in six simple steps.",
    publishedAt: "2026-09-07T19:25:00.000Z",
    levels: {
      beginner: {
        steps: 6,
        intro:
          "A large circle for the head and two round ears, then the eyes, nose and mouth, a large oval body, the arms and legs, and a few simple detail lines to finish. Six steps.",
      },
    },
  }),
  animal({
    slug: "owl",
    title: "Owl",
    description:
      "A round owl with ear tufts, big eyes and feather marks on its chest. Six easy steps from one egg shape.",
    publishedAt: "2026-09-07T19:28:00.000Z",
    levels: {
      beginner: {
        steps: 6,
        intro:
          "A large egg shape for the body and two pointy ear tufts, then two large circles for the eyes and a small triangle beak, the wings on the sides, the feet at the bottom and a few feather marks on the chest. Six steps.",
      },
    },
  }),
  animal({
    slug: "turtle",
    title: "Turtle",
    description:
      "A smiling turtle with a patterned shell and four flippers, drawn from an oval and a circle in six easy steps.",
    publishedAt: "2026-09-07T19:33:00.000Z",
    levels: {
      beginner: {
        steps: 6,
        intro:
          "A large oval for the shell and a circle for the head, then four flippers, the eye and smile, the shell pattern lines and a few small lines on the flippers to finish. Six steps.",
      },
    },
  }),
  animal({
    slug: "fish",
    title: "Fish",
    description:
      "A simple fish with a triangle tail, fins and a few scales. Six easy steps from one oval, a good first drawing.",
    publishedAt: "2026-09-07T19:34:00.000Z",
    levels: {
      beginner: {
        steps: 6,
        intro:
          "An oval for the body and a triangle tail, then the eye and a curved mouth, a top and a bottom fin, a curved gill line and a side fin, and a few scale lines to finish. Six steps.",
      },
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
