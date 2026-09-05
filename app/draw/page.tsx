import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { Container } from "@/components/layout/container";
import { PageHeading } from "@/components/layout/page-heading";
import { EmptyState } from "@/components/shared/empty-state";
import { TutorialGrid } from "@/components/tutorial/tutorial-grid";
import { buttonVariants } from "@/components/ui/button";
import { createPageMetadata } from "@/lib/seo/metadata";
import {
  getCategories,
  getCategoryBySlug,
  getPublishedTutorials,
} from "@/lib/tutorials/queries";
import { cn } from "@/lib/utils";

export const metadata = createPageMetadata({
  title: "Drawing tutorials",
  description:
    "Browse step-by-step drawing tutorials by subject. Every subject comes in beginner, intermediate and advanced versions.",
  path: "/draw",
});

function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex items-center rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-card text-foreground hover:border-foreground/50",
      )}
    >
      {children}
    </Link>
  );
}

export default async function DrawPage({ searchParams }: PageProps<"/draw">) {
  const { category } = await searchParams;
  const categorySlug = typeof category === "string" ? category : undefined;

  const [categories, tutorials, activeCategory] = await Promise.all([
    getCategories({ onlyWithPublishedTutorials: true }),
    getPublishedTutorials({ categorySlug }),
    categorySlug ? getCategoryBySlug(categorySlug) : Promise.resolve(null),
  ]);

  if (categorySlug && !activeCategory) {
    notFound();
  }

  return (
    <Container className="py-12 sm:py-16">
      <PageHeading
        title={
          activeCategory
            ? `${activeCategory.name} drawing tutorials`
            : "Drawing tutorials"
        }
        description={
          activeCategory?.description ??
          "Pick a subject, choose your level and start drawing. Beginner tutorials are free."
        }
      />
      <nav aria-label="Filter by subject" className="mt-8">
        <ul className="flex flex-wrap gap-2">
          <li>
            <FilterChip href="/draw" active={!activeCategory}>
              All subjects
            </FilterChip>
          </li>
          {categories.map((item) => (
            <li key={item.id}>
              <FilterChip
                href={`/draw?category=${item.slug}`}
                active={activeCategory?.id === item.id}
              >
                {item.name}
              </FilterChip>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-10">
        <TutorialGrid
          tutorials={tutorials}
          priorityCount={4}
          emptyState={
            <EmptyState
              title="No tutorials here yet"
              description="We are still drawing this subject. Try another one in the meantime."
              action={
                <Link
                  href="/draw"
                  className={buttonVariants({ variant: "outline", size: "lg" })}
                >
                  Show all subjects
                </Link>
              }
            />
          }
        />
      </div>
    </Container>
  );
}
