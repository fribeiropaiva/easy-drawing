import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface PageHeadingProps {
  title: string;
  description?: string;
  className?: string;
  children?: ReactNode;
}

export function PageHeading({
  title,
  description,
  className,
  children,
}: PageHeadingProps) {
  return (
    <div className={cn("max-w-2xl", className)}>
      <h1 className="text-4xl font-medium tracking-tight sm:text-5xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
      {children}
    </div>
  );
}
