import Link from "next/link";

import { Container } from "@/components/layout/container";
import { PageHeading } from "@/components/layout/page-heading";
import { PricingCard } from "@/components/pricing/pricing-card";
import { ComingSoonBadge } from "@/components/shared/coming-soon-badge";
import { buttonVariants } from "@/components/ui/button";
import {
  annualSavingsPercent,
  formatPrice,
  freeBenefits,
  premiumBenefits,
  premiumPlans,
} from "@/lib/pricing/plans";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Pricing",
  description:
    "Beginner drawing tutorials are free. Premium is coming soon and will unlock every intermediate and advanced tutorial, plus printable worksheets.",
  path: "/pricing",
});

export default function PricingPage() {
  const monthly = premiumPlans.find((plan) => plan.id === "monthly");
  const annual = premiumPlans.find((plan) => plan.id === "annual");
  if (!monthly || !annual) {
    throw new Error(
      "Premium plans are misconfigured: expected a monthly and an annual plan",
    );
  }
  const savings = annualSavingsPercent(monthly, annual);

  return (
    <Container className="py-12 sm:py-16">
      <PageHeading
        title="Pricing"
        description="Beginner tutorials are free, no account needed. Premium is coming soon: it will unlock the intermediate and advanced versions of every subject, plus printable worksheets."
      />

      <div className="mt-10 grid max-w-4xl gap-6 lg:grid-cols-2">
        <PricingCard
          name="Free"
          price={
            <p>
              <span className="font-display text-4xl font-medium">
                {formatPrice(0, "USD")}
              </span>
              <span className="ml-1 text-muted-foreground">forever</span>
            </p>
          }
          description="Everything you need to start drawing today."
          benefits={freeBenefits}
          action={
            <Link
              href="/draw"
              className={buttonVariants({ variant: "outline", size: "xl" })}
            >
              Browse free tutorials
            </Link>
          }
        />
        <PricingCard
          name="Premium"
          badge={<ComingSoonBadge />}
          highlighted
          price={
            <div>
              <p>
                <span className="font-display text-4xl font-medium">
                  {formatPrice(annual.amount, annual.currency)}
                </span>
                <span className="ml-1 text-muted-foreground">per year</span>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Or {formatPrice(monthly.amount, monthly.currency)} per month.
                Yearly saves {savings}%.
              </p>
            </div>
          }
          description="Every tutorial, at every level, plus printable worksheets. Not available yet."
          benefits={premiumBenefits}
          action={
            <p className="text-sm text-muted-foreground">
              Premium subscriptions are not open yet. Keep drawing with the free
              tutorials and check back soon.
            </p>
          }
        />
      </div>

      <section aria-labelledby="free-heading" className="mt-16 max-w-2xl">
        <h2 id="free-heading" className="text-2xl font-medium tracking-tight">
          Which tutorials are free?
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
          <li>Every beginner tutorial.</li>
          <li>
            Selected intermediate tutorials, marked as free on each subject
            page.
          </li>
          <li>
            A few advanced tutorials, so you can see what Premium will be like.
          </li>
        </ul>
        <p className="mt-4 text-muted-foreground">
          Everything else becomes part of Premium when it launches.
        </p>
      </section>
    </Container>
  );
}
