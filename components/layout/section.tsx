import type { ReactNode } from "react";

import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

interface SectionProps {
  id: string;
  title: string;
  description?: string;
  /** Secondary link shown next to the heading, e.g. "All tutorials". */
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function Section({
  id,
  title,
  description,
  action,
  className,
  children,
}: SectionProps) {
  const headingId = `${id}-heading`;
  return (
    <section
      aria-labelledby={headingId}
      className={cn("py-12 sm:py-16", className)}
    >
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
          <div className="max-w-2xl">
            <h2
              id={headingId}
              className="text-2xl font-medium tracking-tight sm:text-3xl"
            >
              {title}
            </h2>
            {description ? (
              <p className="mt-2 text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {action ? <div className="text-sm font-medium">{action}</div> : null}
        </div>
        <div className="mt-8">{children}</div>
      </Container>
    </section>
  );
}
