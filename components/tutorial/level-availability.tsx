import { Check, Clock, Lock, type LucideIcon } from "lucide-react";

import {
  getLevelSummaries,
  type LevelAvailability,
} from "@/lib/tutorials/levels";
import { cn } from "@/lib/utils";
import type { Tutorial } from "@/types/tutorial";

const STATES: Record<
  LevelAvailability,
  { icon: LucideIcon; text: string; className: string }
> = {
  free: {
    icon: Check,
    text: "free",
    className: "border-border bg-card text-foreground",
  },
  premium: {
    icon: Lock,
    text: "premium, coming soon",
    className: "border-premium-soft bg-premium-soft text-premium",
  },
  "coming-soon": {
    icon: Clock,
    text: "coming soon",
    className: "border-dashed border-border text-muted-foreground",
  },
};

/** The three levels of a subject with their free / premium / coming-soon state. */
export function LevelAvailability({
  tutorial,
  className,
}: {
  tutorial: Pick<Tutorial, "levels">;
  className?: string;
}) {
  return (
    <ul aria-label="Levels" className={cn("flex flex-wrap gap-1.5", className)}>
      {getLevelSummaries(tutorial).map((summary) => {
        const state = STATES[summary.availability];
        const Icon = state.icon;
        return (
          <li
            key={summary.difficulty}
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
              state.className,
            )}
          >
            <Icon className="size-3" aria-hidden="true" />
            {summary.label}
            <span className="sr-only">, {state.text}</span>
          </li>
        );
      })}
    </ul>
  );
}
