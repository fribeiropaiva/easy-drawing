import { Printer } from "lucide-react";
import Link from "next/link";

import { TutorialImage } from "@/components/tutorial/tutorial-image";
import { buttonVariants } from "@/components/ui/button";
import { getPublicAssetUrl } from "@/lib/assets/public-url";
import { DIFFICULTY_LABELS } from "@/lib/tutorials/levels";
import type { Tutorial, TutorialLevel } from "@/types/tutorial";

interface TutorialViewerProps {
  tutorial: Pick<Tutorial, "title">;
  level: TutorialLevel;
}

/** The full worksheet for a level the viewer is allowed to see. */
export function TutorialViewer({ tutorial, level }: TutorialViewerProps) {
  if (!level.tutorialImageKey) {
    return null;
  }
  const label = DIFFICULTY_LABELS[level.difficulty];
  const subject = tutorial.title.toLowerCase();
  const headingId = `${level.difficulty}-heading`;

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2 id={headingId} className="text-2xl font-medium">
          {label} {subject}
        </h2>
        {level.stepCount ? (
          <p className="text-sm text-muted-foreground">
            {level.stepCount} steps
          </p>
        ) : null}
      </div>
      {level.introduction ? (
        <p className="max-w-prose leading-relaxed">{level.introduction}</p>
      ) : null}
      <figure className="mx-auto w-full max-w-2xl overflow-hidden rounded-md sheet">
        <TutorialImage
          imageKey={level.tutorialImageKey}
          alt={`${label} step-by-step worksheet for drawing a ${subject}`}
          sizes="(min-width: 768px) 42rem, 100vw"
          priority
        />
        <figcaption className="sr-only">
          Follow the numbered steps from top to bottom.
        </figcaption>
      </figure>
      {level.printableFileKey ? (
        <div>
          <Link
            href={getPublicAssetUrl(level.printableFileKey)}
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            <Printer data-icon="inline-start" aria-hidden="true" />
            Print this worksheet
          </Link>
        </div>
      ) : null}
    </section>
  );
}
