import { Check } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { PageHeading } from "@/components/layout/page-heading";
import { ComingSoonBadge } from "@/components/shared/coming-soon-badge";
import { buttonVariants } from "@/components/ui/button";
import { freeRightNow } from "@/lib/packs";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Tutorial packs",
  description:
    "Themed packs of step-by-step drawing tutorials are coming soon. Until then, every tutorial on Easy Drawing is free at every level.",
  path: "/packs",
});

export default function PacksPage() {
  return (
    <Container className="py-12 sm:py-16">
      <PageHeading
        eyebrow={<ComingSoonBadge />}
        title="Tutorial packs"
        description="Themed packs of step-by-step tutorials covering all sorts of subjects, bought once and yours to keep. We are putting the first ones together now."
      >
        <div className="mt-8">
          <Link href="/draw" className={buttonVariants({ size: "xl" })}>
            Browse free tutorials
          </Link>
        </div>
      </PageHeading>

      <section aria-labelledby="free-heading" className="mt-16 max-w-2xl">
        <h2 id="free-heading" className="text-2xl font-medium tracking-tight">
          Everything is free right now
        </h2>
        <p className="mt-3 text-muted-foreground">
          Until the first packs launch, every published tutorial is free at
          every level.
        </p>
        <ul className="mt-4 space-y-2 text-sm">
          {freeRightNow.map((item) => (
            <li key={item} className="flex gap-2">
              <Check
                className="mt-0.5 size-4 shrink-0 text-success"
                aria-hidden="true"
              />
              {item}
            </li>
          ))}
        </ul>
      </section>
    </Container>
  );
}
