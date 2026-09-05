import type { ReactNode } from "react";

import { TutorialCard } from "@/components/tutorial/tutorial-card";
import type { TutorialWithCategory } from "@/types/tutorial";

interface TutorialGridProps {
  tutorials: TutorialWithCategory[];
  /** How many leading cards load their thumbnail eagerly (above the fold). */
  priorityCount?: number;
  emptyState?: ReactNode;
}

export function TutorialGrid({
  tutorials,
  priorityCount = 0,
  emptyState = null,
}: TutorialGridProps) {
  if (tutorials.length === 0) {
    return <>{emptyState}</>;
  }
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
      {tutorials.map((tutorial, index) => (
        <li key={tutorial.id}>
          <TutorialCard tutorial={tutorial} priority={index < priorityCount} />
        </li>
      ))}
    </ul>
  );
}
