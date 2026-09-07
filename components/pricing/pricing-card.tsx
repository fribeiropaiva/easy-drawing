import { Check } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface PricingCardProps {
  name: string;
  price: ReactNode;
  description: string;
  benefits: readonly string[];
  action: ReactNode;
  /** Status pill shown next to the plan name, e.g. "Coming soon". */
  badge?: ReactNode;
  highlighted?: boolean;
}

export function PricingCard({
  name,
  price,
  description,
  benefits,
  action,
  badge,
  highlighted = false,
}: PricingCardProps) {
  const headingId = `plan-${name.toLowerCase()}`;
  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "flex flex-col gap-6 rounded-lg sheet p-6 sm:p-8",
        highlighted && "border-primary ring-1 ring-primary",
      )}
    >
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h2 id={headingId} className="font-sans text-lg font-semibold">
            {name}
          </h2>
          {badge}
        </div>
        <div className="mt-3">{price}</div>
        <p className="mt-3 text-sm text-muted-foreground">{description}</p>
      </div>
      <ul className="space-y-2.5 text-sm">
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
      <div className="mt-auto flex flex-col items-start gap-2">{action}</div>
    </section>
  );
}
