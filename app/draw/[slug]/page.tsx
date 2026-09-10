import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { Container } from "@/components/layout/container";
import { PaywallCard } from "@/components/paywall/paywall-card";
import { Breadcrumbs } from "@/components/tutorial/breadcrumbs";
import {
  DifficultySelector,
  type LevelView,
} from "@/components/tutorial/difficulty-selector";
import { LevelComingSoon } from "@/components/tutorial/level-coming-soon";
import { RelatedTutorials } from "@/components/tutorial/related-tutorials";
import { TutorialViewer } from "@/components/tutorial/tutorial-viewer";
import { getPublicAssetUrl } from "@/lib/assets/public-url";
import {
  canAccessTutorialLevel,
  type Viewer,
} from "@/lib/entitlements/can-access-tutorial-level";
import { createPageMetadata, type SocialImage } from "@/lib/seo/metadata";
import {
  tutorialHeadline,
  tutorialSeoDescription,
  tutorialSeoTitle,
} from "@/lib/tutorials/format";
import {
  getDefaultDifficulty,
  getLevel,
  getLevelSummaries,
  getPublishedDifficulties,
  hasPublishedArtwork,
} from "@/lib/tutorials/levels";
import {
  getPublishedTutorialSlugs,
  getRelatedTutorials,
  getTutorialBySlug,
} from "@/lib/tutorials/queries";
import type { Difficulty, TutorialWithCategory } from "@/types/tutorial";

export async function generateStaticParams() {
  const slugs = await getPublishedTutorialSlugs();
  return slugs.map((slug) => ({ slug }));
}

/**
 * The subject's card thumbnail, which every listing page already renders, so it
 * is public by construction and never a paid original. Levels still waiting on
 * artwork fall back to an SVG placeholder frame; social networks mostly refuse
 * SVG, and a blank frame is not worth previewing, so those pages get no image.
 */
function socialImage(tutorial: TutorialWithCategory): SocialImage | undefined {
  const key = tutorial.featuredImageKey;
  if (!key || key.endsWith(".svg")) {
    return undefined;
  }
  return {
    url: getPublicAssetUrl(key),
    alt: `${tutorial.title} step-by-step drawing tutorial`,
    // Worksheets are exported at 1024x1536 (docs/decisions.md #13).
    width: 1024,
    height: 1536,
  };
}

export async function generateMetadata({
  params,
}: PageProps<"/draw/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const tutorial = await getTutorialBySlug(slug);
  if (!tutorial) {
    return { title: "Tutorial not found" };
  }
  return createPageMetadata({
    title: tutorial.seoTitle ?? tutorialSeoTitle(tutorial.title),
    description:
      tutorial.seoDescription ??
      tutorialSeoDescription(
        tutorial.title,
        getPublishedDifficulties(tutorial),
      ),
    path: `/draw/${tutorial.slug}`,
    image: socialImage(tutorial),
  });
}

/** Decides, on the server, what a viewer may see for one level. */
function renderLevelPanel(
  tutorial: TutorialWithCategory,
  difficulty: Difficulty,
  viewer: Viewer | null,
  /** True for the level the page opens on: all three are rendered, only this one preloads. */
  priority: boolean,
): ReactNode {
  const level = getLevel(tutorial, difficulty);
  if (!hasPublishedArtwork(level)) {
    return <LevelComingSoon tutorial={tutorial} difficulty={difficulty} />;
  }
  if (!canAccessTutorialLevel(viewer, level)) {
    return (
      <PaywallCard tutorial={tutorial} level={level} priority={priority} />
    );
  }
  return (
    <TutorialViewer tutorial={tutorial} level={level} priority={priority} />
  );
}

export default async function TutorialPage({
  params,
}: PageProps<"/draw/[slug]">) {
  const { slug } = await params;
  const tutorial = await getTutorialBySlug(slug);
  if (!tutorial) {
    notFound();
  }

  const related = await getRelatedTutorials(tutorial);

  // Phase 7 replaces this with the signed-in user; Phase 8 adds their entitlement.
  const viewer: Viewer | null = null;

  const defaultDifficulty = getDefaultDifficulty(tutorial);
  const levels: LevelView[] = getLevelSummaries(tutorial).map((summary) => {
    const level = getLevel(tutorial, summary.difficulty);
    return {
      ...summary,
      locked:
        hasPublishedArtwork(level) && !canAccessTutorialLevel(viewer, level),
    };
  });

  return (
    <Container className="mx-auto max-w-3xl py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Tutorials", href: "/draw" },
          {
            label: tutorial.category.name,
            href: `/draw?category=${tutorial.category.slug}`,
          },
          { label: tutorial.title },
        ]}
      />
      <div className="mt-6 max-w-2xl">
        <h1 className="text-4xl font-medium tracking-tight sm:text-5xl">
          {tutorialHeadline(tutorial.title)}
        </h1>
        {tutorial.description ? (
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {tutorial.description}
          </p>
        ) : null}
      </div>
      <div className="mt-8 sm:mt-10">
        <DifficultySelector
          title={tutorial.title}
          levels={levels}
          defaultDifficulty={defaultDifficulty}
          panels={{
            beginner: renderLevelPanel(
              tutorial,
              "beginner",
              viewer,
              defaultDifficulty === "beginner",
            ),
            intermediate: renderLevelPanel(
              tutorial,
              "intermediate",
              viewer,
              defaultDifficulty === "intermediate",
            ),
            advanced: renderLevelPanel(
              tutorial,
              "advanced",
              viewer,
              defaultDifficulty === "advanced",
            ),
          }}
        />
      </div>
      <div className="mt-16 sm:mt-20">
        <RelatedTutorials tutorials={related} />
      </div>
    </Container>
  );
}
