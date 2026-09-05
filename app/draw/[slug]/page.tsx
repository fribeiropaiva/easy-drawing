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
import { TutorialViewer } from "@/components/tutorial/tutorial-viewer";
import {
  canAccessTutorialLevel,
  type Viewer,
} from "@/lib/entitlements/can-access-tutorial-level";
import { createPageMetadata } from "@/lib/seo/metadata";
import {
  tutorialHeadline,
  tutorialSeoDescription,
  tutorialSeoTitle,
} from "@/lib/tutorials/format";
import {
  getDefaultDifficulty,
  getLevel,
  getLevelSummaries,
  hasPublishedArtwork,
} from "@/lib/tutorials/levels";
import {
  getPublishedTutorialSlugs,
  getTutorialBySlug,
} from "@/lib/tutorials/queries";
import type { Difficulty, TutorialWithCategory } from "@/types/tutorial";

export async function generateStaticParams() {
  const slugs = await getPublishedTutorialSlugs();
  return slugs.map((slug) => ({ slug }));
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
      tutorial.seoDescription ?? tutorialSeoDescription(tutorial.title),
    path: `/draw/${tutorial.slug}`,
  });
}

/** Decides, on the server, what a viewer may see for one level. */
function renderLevelPanel(
  tutorial: TutorialWithCategory,
  difficulty: Difficulty,
  viewer: Viewer | null,
): ReactNode {
  const level = getLevel(tutorial, difficulty);
  if (!hasPublishedArtwork(level)) {
    return <LevelComingSoon tutorial={tutorial} difficulty={difficulty} />;
  }
  if (!canAccessTutorialLevel(viewer, level)) {
    return <PaywallCard tutorial={tutorial} level={level} />;
  }
  return <TutorialViewer tutorial={tutorial} level={level} />;
}

export default async function TutorialPage({
  params,
}: PageProps<"/draw/[slug]">) {
  const { slug } = await params;
  const tutorial = await getTutorialBySlug(slug);
  if (!tutorial) {
    notFound();
  }

  // Phase 7 replaces this with the signed-in user; Phase 8 adds their entitlement.
  const viewer: Viewer | null = null;

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
          defaultDifficulty={getDefaultDifficulty(tutorial)}
          panels={{
            beginner: renderLevelPanel(tutorial, "beginner", viewer),
            intermediate: renderLevelPanel(tutorial, "intermediate", viewer),
            advanced: renderLevelPanel(tutorial, "advanced", viewer),
          }}
        />
      </div>
    </Container>
  );
}
