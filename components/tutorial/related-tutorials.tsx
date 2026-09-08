import Link from "next/link";

import { RelatedClickTracker } from "@/components/analytics/related-click-tracker";
import { Carousel } from "@/components/shared/carousel";
import { TutorialCard } from "@/components/tutorial/tutorial-card";
import type { TutorialWithCategory } from "@/types/tutorial";

/** "What should I draw next?" (PROJECT_PLAN.md §66, §95): other subjects, same category first. */
export function RelatedTutorials({
  tutorials,
  fromSlug,
}: {
  tutorials: TutorialWithCategory[];
  /** The subject being viewed, recorded as the origin of related clicks. */
  fromSlug: string;
}) {
  if (tutorials.length === 0) {
    return null;
  }
  return (
    <section aria-labelledby="related-heading">
      <RelatedClickTracker fromSlug={fromSlug}>
      <Carousel
        label="More tutorials"
        heading={
          <div>
            <h2
              id="related-heading"
              className="text-2xl font-medium tracking-tight"
            >
              Keep drawing
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Related tutorials, same category first.
            </p>
          </div>
        }
        items={tutorials.map((tutorial) => ({
          key: tutorial.id,
          node: <TutorialCard tutorial={tutorial} />,
        }))}
      />
      </RelatedClickTracker>
      <Link
        href="/draw"
        className="mt-2 inline-block text-sm font-medium underline decoration-border underline-offset-4 hover:decoration-foreground"
      >
        All tutorials
      </Link>
    </section>
  );
}
