import { Clock } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { DIFFICULTY_LABELS } from "@/lib/tutorials/levels";
import { cn } from "@/lib/utils";
import type { Difficulty, Tutorial } from "@/types/tutorial";

interface LevelComingSoonProps {
  tutorial: Pick<Tutorial, "title">;
  difficulty: Difficulty;
}

export function LevelComingSoon({
  tutorial,
  difficulty,
}: LevelComingSoonProps) {
  const label = DIFFICULTY_LABELS[difficulty].toLowerCase();
  const subject = tutorial.title.toLowerCase();
  const headingId = `${difficulty}-heading`;

  return (
    <section
      aria-labelledby={headingId}
      className="rounded-md sheet px-6 py-12 text-center sm:py-16"
    >
      <Clock
        className="mx-auto size-8 text-muted-foreground"
        aria-hidden="true"
      />
      <h2 id={headingId} className="mt-4 text-2xl font-medium">
        The {label} {subject} is coming soon
      </h2>
      <p className="mx-auto mt-2 max-w-prose text-muted-foreground">
        We are drawing it now. Until then, keep practising with another subject.
      </p>
      <Link
        href="/draw"
        className={cn(
          buttonVariants({ variant: "outline", size: "lg" }),
          "mt-6",
        )}
      >
        Browse tutorials
      </Link>
    </section>
  );
}
