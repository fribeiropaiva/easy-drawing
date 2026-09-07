import { Check, Lock } from "lucide-react";
import Link from "next/link";

import { TutorialImage } from "@/components/tutorial/tutorial-image";
import { buttonVariants } from "@/components/ui/button";
import { DIFFICULTY_LABELS } from "@/lib/tutorials/levels";
import type { Tutorial, TutorialLevel } from "@/types/tutorial";

interface PaywallCardProps {
  tutorial: Pick<Tutorial, "title">;
  level: TutorialLevel;
}

/**
 * What a visitor without Premium sees for a premium level: the public preview
 * only. The full worksheet is never sent to the browser (PROJECT_PLAN.md §32).
 */
export function PaywallCard({ tutorial, level }: PaywallCardProps) {
  const label = DIFFICULTY_LABELS[level.difficulty];
  const subject = tutorial.title.toLowerCase();
  const headingId = `${level.difficulty}-heading`;
  const benefits = [
    `The full ${label.toLowerCase()} ${subject} worksheet`,
    "Every other premium tutorial, at every level",
    "Printable worksheets and high-resolution downloads",
  ];

  return (
    <section
      aria-labelledby={headingId}
      className="grid gap-8 md:grid-cols-2 md:items-start"
    >
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
        <p className="inline-flex w-fit items-center gap-1.5 rounded-full bg-premium-soft px-2.5 py-1 text-xs font-semibold text-premium">
          <Lock className="size-3.5" aria-hidden="true" />
          Premium tutorial
        </p>
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
        <ul className="space-y-2 text-sm">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex gap-2">
              <Check
                className="mt-0.5 size-4 shrink-0 text-success"
                aria-hidden="true"
              />
              {benefit}
            </li>
          ))}
        </ul>
        <div className="mt-2 flex flex-col items-start gap-2">
          <Link href="/pricing" className={buttonVariants({ size: "xl" })}>
            Unlock with Premium
          </Link>
          <p className="text-xs text-muted-foreground">
            Monthly or yearly. Cancel any time.
          </p>
        </div>
      </div>
    </section>
  );
}
