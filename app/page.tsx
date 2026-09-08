import { ArrowRight, Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ComingSoonBadge } from "@/components/shared/coming-soon-badge";
import { ProgressionShowcase } from "@/components/tutorial/progression-showcase";
import { TutorialGrid } from "@/components/tutorial/tutorial-grid";
import { buttonVariants } from "@/components/ui/button";
import { freeRightNow } from "@/lib/packs";
import { createPageMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/site";
import {
  getCategories,
  getFeaturedTutorials,
  getNewestTutorials,
  getPublishedTutorials,
  getTutorialBySlug,
} from "@/lib/tutorials/queries";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: siteConfig.tagline,
    description: siteConfig.description,
    path: "/",
  }),
  // The root segment does not receive the layout title template, so set the full title here.
  title: { absolute: `${siteConfig.name} | ${siteConfig.tagline}` },
};

// Every level is free until tutorial packs launch (lib/packs.ts).
const LEVEL_GUIDE = [
  {
    name: "Beginner",
    text: "Simple shapes and a handful of steps. Finish a drawing you are happy with in one sitting.",
  },
  {
    name: "Intermediate",
    text: "More steps, better proportions and the first details. The same subject, drawn with more confidence.",
  },
  {
    name: "Advanced",
    text: "Full detail, texture and shading, for when you want a drawing to be proud of.",
  },
];

export default async function HomePage() {
  const [showcase, popular, newest, categories, allTutorials] =
    await Promise.all([
      getTutorialBySlug("coconut-tree"),
      getFeaturedTutorials(4),
      getNewestTutorials(4),
      getCategories({ onlyWithPublishedTutorials: true }),
      getPublishedTutorials(),
    ]);
  const countByCategory = new Map<string, number>();
  for (const tutorial of allTutorials) {
    countByCategory.set(
      tutorial.categoryId,
      (countByCategory.get(tutorial.categoryId) ?? 0) + 1,
    );
  }

  return (
    <>
      <section className="border-b border-border dot-grid">
        <Container className="grid gap-12 py-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-center lg:py-24">
          <div className="max-w-xl">
            <h1 className="text-4xl leading-[1.05] font-medium tracking-tight sm:text-5xl lg:text-6xl">
              {siteConfig.tagline}.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Pick your level and follow along, one numbered step at a time.
              Start with a free beginner version, then draw the same subject
              again with more detail at intermediate and advanced.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/draw" className={buttonVariants({ size: "xl" })}>
                Start drawing
              </Link>
              <TrackedLink
                href="/packs"
                event="packs_link_clicked"
                properties={{ source: "hero" }}
                className={buttonVariants({ variant: "ghost", size: "xl" })}
              >
                Tutorial packs
              </TrackedLink>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Every tutorial is free right now, no account needed. Tutorial
              packs are coming soon.
            </p>
          </div>
          {showcase ? <ProgressionShowcase tutorial={showcase} /> : null}
        </Container>
      </section>

      <Section
        id="popular"
        title="Popular tutorials"
        action={
          <Link
            href="/draw"
            className="underline decoration-border underline-offset-4 hover:decoration-foreground"
          >
            All tutorials
          </Link>
        }
      >
        <TutorialGrid tutorials={popular} />
      </Section>

      <Section
        id="levels"
        title="The same drawing, three ways"
        description="Every subject is taught three times. Move up when you are ready: the subject stays the same, the detail grows."
      >
        <ol className="grid gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-stretch">
          {LEVEL_GUIDE.map((level, index) => (
            <li key={level.name} className="contents">
              {index > 0 ? (
                <ArrowRight
                  className="hidden size-5 self-center text-muted-foreground md:block"
                  aria-hidden="true"
                />
              ) : null}
              <div className="flex flex-col gap-3 rounded-md sheet p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-display text-xl font-medium">
                    {level.name}
                  </h3>
                  <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                    <Check className="size-3" aria-hidden="true" />
                    Free
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {level.text}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="subjects" title="Browse by subject">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => {
            const count = countByCategory.get(category.id) ?? 0;
            return (
              <li key={category.id}>
                <Link
                  href={`/draw?category=${category.slug}`}
                  className="flex h-full flex-col gap-2 rounded-md sheet p-5 transition-colors hover:border-foreground/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
                >
                  <span className="font-display text-lg font-medium">
                    {category.name}
                  </span>
                  {category.description ? (
                    <span className="text-sm text-muted-foreground">
                      {category.description}
                    </span>
                  ) : null}
                  <span className="mt-auto pt-2 text-xs text-muted-foreground">
                    {count === 1 ? "1 tutorial" : `${count} tutorials`}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section
        id="new"
        title="New tutorials"
        action={
          <Link
            href="/draw"
            className="underline decoration-border underline-offset-4 hover:decoration-foreground"
          >
            All tutorials
          </Link>
        }
      >
        <TutorialGrid tutorials={newest} />
      </Section>

      <section aria-labelledby="packs-heading" className="py-12 sm:py-16">
        <Container>
          <div className="grid gap-8 rounded-lg sheet p-8 sm:p-12 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-center">
            <div>
              <ComingSoonBadge />
              <h2
                id="packs-heading"
                className="mt-3 text-2xl font-medium tracking-tight sm:text-3xl"
              >
                Tutorial packs are coming soon
              </h2>
              <p className="mt-3 max-w-prose text-muted-foreground">
                We are putting together themed packs of tutorials that you buy
                once and keep. Until they launch, every tutorial on{" "}
                {siteConfig.name} is free, at every level.
              </p>
              <TrackedLink
                href="/packs"
                event="packs_link_clicked"
                properties={{ source: "home_section" }}
                className={buttonVariants({
                  variant: "outline",
                  size: "xl",
                  className: "mt-6",
                })}
              >
                About tutorial packs
              </TrackedLink>
            </div>
            <div>
              <p className="text-sm font-semibold">Free right now</p>
              <ul className="mt-3 grid gap-2.5 text-sm">
                {freeRightNow.map((item) => (
                  <li key={item} className="flex gap-2">
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-success"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
