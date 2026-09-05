import type {
  Category,
  Tutorial,
  TutorialWithCategory,
} from "@/types/tutorial";

import { mockCategories, mockTutorials } from "./mock-data";

/**
 * Data access for tutorial content.
 *
 * Phase 1 reads mock data. Phase 2 replaces the function bodies with Supabase
 * queries; the signatures and return types stay the same, so pages and
 * components do not change. Only published tutorials are ever returned here.
 */

function withCategory(tutorial: Tutorial): TutorialWithCategory {
  const category = mockCategories.find((c) => c.id === tutorial.categoryId);
  if (!category) {
    throw new Error(`Tutorial "${tutorial.slug}" has unknown category`);
  }
  return { ...tutorial, category };
}

function publishedTutorials(): TutorialWithCategory[] {
  return mockTutorials
    .filter((tutorial) => tutorial.status === "published")
    .map(withCategory)
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
}

export async function getCategories(
  options: { onlyWithPublishedTutorials?: boolean } = {},
): Promise<Category[]> {
  let categories = [...mockCategories];
  if (options.onlyWithPublishedTutorials) {
    const usedIds = new Set(publishedTutorials().map((t) => t.categoryId));
    categories = categories.filter((category) => usedIds.has(category.id));
  }
  return categories.sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  return mockCategories.find((category) => category.slug === slug) ?? null;
}

export async function getPublishedTutorials(
  options: { categorySlug?: string } = {},
): Promise<TutorialWithCategory[]> {
  const tutorials = publishedTutorials();
  if (!options.categorySlug) {
    return tutorials;
  }
  return tutorials.filter((t) => t.category.slug === options.categorySlug);
}

export async function getFeaturedTutorials(
  limit = 4,
): Promise<TutorialWithCategory[]> {
  return publishedTutorials()
    .filter((tutorial) => tutorial.featured)
    .slice(0, limit);
}

export async function getNewestTutorials(
  limit = 4,
): Promise<TutorialWithCategory[]> {
  return publishedTutorials().slice(0, limit);
}

export async function getTutorialBySlug(
  slug: string,
): Promise<TutorialWithCategory | null> {
  return (
    publishedTutorials().find((tutorial) => tutorial.slug === slug) ?? null
  );
}

export async function getPublishedTutorialSlugs(): Promise<string[]> {
  return publishedTutorials().map((tutorial) => tutorial.slug);
}
