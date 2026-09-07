import { Clock } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface ComingSoonBadgeProps {
  children?: ReactNode;
  className?: string;
}

/**
 * Status pill for something that is not available yet: icon plus text, so the
 * state is never colour-only. Same look as the coming-soon level pill.
 */
export function ComingSoonBadge({
  children = "Coming soon",
  className,
}: ComingSoonBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-dashed border-border px-2 py-0.5 text-xs font-medium text-muted-foreground",
        className,
      )}
    >
      <Clock className="size-3" aria-hidden="true" />
      {children}
    </span>
  );
}
