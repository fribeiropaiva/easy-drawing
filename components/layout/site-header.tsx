import { PencilLine } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { NavLink } from "@/components/layout/nav-link";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-background">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-display text-xl font-semibold tracking-tight"
        >
          <span
            aria-hidden="true"
            className="grid size-8 place-items-center rounded-md bg-primary text-primary-foreground"
          >
            <PencilLine className="size-4" />
          </span>
          {siteConfig.name}
        </Link>
        <nav aria-label="Main" className="flex items-center gap-1">
          {siteConfig.nav.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
          <Link
            href="/draw"
            className={cn(
              buttonVariants({ size: "lg" }),
              "ml-2 hidden sm:inline-flex",
            )}
          >
            Start drawing
          </Link>
        </nav>
      </Container>
    </header>
  );
}
