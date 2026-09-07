import Link from "next/link";

import { LevelAvailability } from "@/components/tutorial/level-availability";
import { TutorialImage } from "@/components/tutorial/tutorial-image";
import type { TutorialWithCategory } from "@/types/tutorial";

interface TutorialCardProps {
  tutorial: TutorialWithCategory;
  /** Set for cards above the fold so the thumbnail loads eagerly. */
  priority?: boolean;
}

export function TutorialCard({
  tutorial,
  priority = false,
}: TutorialCardProps) {
  return (
    <article className="group relative flex flex-col">
      <div className="overflow-hidden rounded-md sheet transition-colors group-hover:border-foreground/40">
        {tutorial.featuredImageKey ? (
          <TutorialImage
            imageKey={tutorial.featuredImageKey}
            alt={`${tutorial.title} drawing tutorial`}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            priority={priority}
          />
        ) : (
          <div className="grid aspect-2/3 place-items-center p-4 text-center text-sm text-muted-foreground">
            No thumbnail yet
          </div>
        )}
      </div>
      <div className="mt-3 flex flex-col gap-1">
        <h3 className="text-base leading-snug font-semibold">
          <Link
            href={`/draw/${tutorial.slug}`}
            className="after:absolute after:inset-0 after:rounded-md focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-ring focus-visible:after:ring-offset-2 focus-visible:after:ring-offset-background"
          >
            {tutorial.title}
          </Link>
        </h3>
        <p className="text-sm text-muted-foreground">
          {tutorial.category.name}
        </p>
        <LevelAvailability tutorial={tutorial} className="mt-1.5" />
      </div>
    </article>
  );
}
