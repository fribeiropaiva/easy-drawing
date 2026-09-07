import { Lock } from "lucide-react";
import Link from "next/link";

import { TutorialImage } from "@/components/tutorial/tutorial-image";
import { canAccessTutorialLevel } from "@/lib/entitlements/can-access-tutorial-level";
import {
  DIFFICULTIES,
  DIFFICULTY_LABELS,
  getLevel,
  getLevelAvailability,
} from "@/lib/tutorials/levels";
import { cn } from "@/lib/utils";
import type { TutorialWithCategory } from "@/types/tutorial";

/**
 * The product in one picture: the same subject as three sheets, stepping up
 * from beginner to advanced. Premium levels show their public preview only.
 */
export function ProgressionShowcase({
  tutorial,
}: {
  tutorial: TutorialWithCategory;
}) {
  const steps = DIFFICULTIES.map((difficulty) => {
    const level = getLevel(tutorial, difficulty);
    const availability = getLevelAvailability(tutorial, difficulty);
    const imageKey =
      level && availability !== "coming-soon"
        ? canAccessTutorialLevel(null, level)
          ? level.tutorialImageKey
          : level.previewImageKey
        : null;
    return {
      difficulty,
      label: DIFFICULTY_LABELS[difficulty],
      availability,
      imageKey,
    };
  });
  const subject = tutorial.title.toLowerCase();

  return (
    <Link href={`/draw/${tutorial.slug}`} className="group block">
      <ol
        className="grid grid-cols-3 items-end gap-3 sm:gap-5"
        aria-label="Three levels"
      >
        {steps.map((step, index) => (
          <li
            key={step.difficulty}
            className={cn(
              "flex flex-col gap-2",
              index === 1 && "mb-8 sm:mb-12",
              index === 2 && "mb-16 sm:mb-24",
            )}
          >
            <div className="overflow-hidden rounded-md sheet transition-colors group-hover:border-foreground/40">
              {step.imageKey ? (
                <TutorialImage
                  imageKey={step.imageKey}
                  alt=""
                  sizes="(min-width: 1024px) 18vw, 30vw"
                  priority={index === 0}
                />
              ) : (
                <div className="grid aspect-2/3 place-items-center text-xs text-muted-foreground">
                  Coming soon
                </div>
              )}
            </div>
            <span className="flex items-center gap-1 text-xs font-medium sm:text-sm">
              {step.label}
              {step.availability === "premium" ? (
                <>
                  <Lock className="size-3.5 text-premium" aria-hidden="true" />
                  <span className="sr-only">, premium</span>
                </>
              ) : null}
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-2 text-sm text-muted-foreground">
        The {subject}, from beginner to advanced.{" "}
        <span className="font-medium text-foreground underline decoration-border underline-offset-4 group-hover:decoration-foreground">
          Open the tutorial
        </span>
      </p>
    </Link>
  );
}
