import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { PageHeading } from "@/components/layout/page-heading";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <Container className="py-24">
      <PageHeading
        title="We couldn't find that page"
        description="It may have moved, or it isn't published yet."
      />
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/draw" className={buttonVariants({ size: "lg" })}>
          Browse tutorials
        </Link>
        <Link
          href="/"
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          Go to the homepage
        </Link>
      </div>
    </Container>
  );
}
