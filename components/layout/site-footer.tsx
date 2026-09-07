import Link from "next/link";

import { Container } from "@/components/layout/container";
import { siteConfig } from "@/lib/site";
import { getCategories } from "@/lib/tutorials/queries";

const footerLinkClass =
  "text-sm text-muted-foreground transition-colors hover:text-foreground hover:underline underline-offset-4";

export async function SiteFooter() {
  const categories = await getCategories({ onlyWithPublishedTutorials: true });
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-border bg-card">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <p className="font-display text-lg font-semibold">
            {siteConfig.name}
          </p>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            {siteConfig.tagline}. Every tutorial is free right now, and every
            subject grows with you through intermediate and advanced versions.
          </p>
        </div>
        <nav aria-labelledby="footer-explore">
          <h2 id="footer-explore" className="font-sans text-sm font-semibold">
            Explore
          </h2>
          <ul className="mt-3 space-y-2">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={footerLinkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-labelledby="footer-subjects">
          <h2 id="footer-subjects" className="font-sans text-sm font-semibold">
            Subjects
          </h2>
          <ul className="mt-3 space-y-2">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/draw?category=${category.slug}`}
                  className={footerLinkClass}
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
      <Container className="border-t border-border py-6 text-sm text-muted-foreground">
        <p>
          © {year} {siteConfig.name}
        </p>
      </Container>
    </footer>
  );
}
