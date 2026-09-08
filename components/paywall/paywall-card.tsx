import { Package } from "lucide-react";

import { TrackEvent } from "@/components/analytics/track-event";
import { TrackedLink } from "@/components/analytics/tracked-link";
import { ComingSoonBadge } from "@/components/shared/coming-soon-badge";
import { TutorialImage } from "@/components/tutorial/tutorial-image";
import { buttonVariants } from "@/components/ui/button";
import { DIFFICULTY_LABELS } from "@/lib/tutorials/levels";
import type { Tutorial, TutorialLevel } from "@/types/tutorial";

interface PaywallCardProps {
  tutorial: Pick<Tutorial, "title" | "slug">;
  level: TutorialLevel;
}

/**
 * What a visitor sees for a pack level they have not bought: the public
 * preview only. The full worksheet is never sent to the browser
 * (PROJECT_PLAN.md §32). Packs are not for sale yet, so the card says so and
 * points back to the free levels instead of offering a purchase.
 */
export function PaywallCard({ tutorial, level }: PaywallCardProps) {
  const label = DIFFICULTY_LABELS[level.difficulty];
  const subject = tutorial.title.toLowerCase();
  const headingId = `${level.difficulty}-heading`;

  return (
    <section
      aria-labelledby={headingId}
      className="grid gap-8 md:grid-cols-2 md:items-start"
    >
      <TrackEvent
        name="pack_preview_viewed"
        properties={{ slug: tutorial.slug, difficulty: level.difficulty }}
      />
      <div className="overflow-hidden rounded-md sheet">
        {level.previewImageKey ? (
          <TutorialImage
            imageKey={level.previewImageKey}
            alt={`Preview of the ${label.toLowerCase()} ${subject} worksheet`}
            sizes="(min-width: 768px) 50vw, 100vw"
            priority
          />
        ) : (
          <div className="grid aspect-2/3 place-items-center p-6 text-center text-sm text-muted-foreground">
            Preview coming soon
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4 md:sticky md:top-6">
        <div className="flex flex-wrap items-center gap-2">
          <p className="inline-flex w-fit items-center gap-1.5 rounded-full bg-pack-soft px-2.5 py-1 text-xs font-semibold text-pack">
            <Package className="size-3.5" aria-hidden="true" />
            Tutorial pack
          </p>
          <ComingSoonBadge>Packs coming soon</ComingSoonBadge>
        </div>
        <h2 id={headingId} className="text-2xl font-medium">
          {label} {subject}
        </h2>
        {level.stepCount ? (
          <p className="-mt-2 text-sm text-muted-foreground">
            {level.stepCount} steps
          </p>
        ) : null}
        {level.introduction ? (
          <p className="max-w-prose leading-relaxed">{level.introduction}</p>
        ) : null}
        <p className="max-w-prose text-sm text-muted-foreground">
          This level will be part of a tutorial pack. Packs are not for sale
          yet, so keep drawing with the free levels in the meantime.
        </p>
        <div className="mt-2">
          <TrackedLink
            href="/packs"
            event="packs_link_clicked"
            properties={{ source: "pack_card" }}
            className={buttonVariants({ variant: "outline", size: "xl" })}
          >
            About tutorial packs
          </TrackedLink>
        </div>
      </div>
    </section>
  );
}
