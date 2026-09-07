"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CarouselItem {
  key: string;
  node: ReactNode;
}

interface CarouselProps {
  /** Accessible name for the scrolling list. */
  label: string;
  /** Rendered on the left of the button row, usually the section heading. */
  heading: ReactNode;
  items: CarouselItem[];
  className?: string;
}

/**
 * A horizontally scrolling row using native scroll-snap. Swiping and the
 * keyboard (tabbing through the cards) work without JavaScript; the buttons
 * are an enhancement and only appear when there is something to scroll to.
 */
export function Carousel({ label, heading, items, className }: CarouselProps) {
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [canScroll, setCanScroll] = useState({ back: false, forward: false });

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const update = () => {
      setCanScroll({
        back: el.scrollLeft > 1,
        forward: el.scrollLeft + el.clientWidth < el.scrollWidth - 1,
      });
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [items.length]);

  function scrollByPage(direction: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.8 });
  }

  const scrollable = canScroll.back || canScroll.forward;

  return (
    <div className={className}>
      <div className="flex items-end justify-between gap-6">
        {heading}
        {scrollable ? (
          <div className="flex shrink-0 gap-2">
            <Button
              variant="outline"
              size="icon-lg"
              onClick={() => scrollByPage(-1)}
              disabled={!canScroll.back}
              aria-label="Scroll back"
            >
              <ChevronLeft aria-hidden="true" />
            </Button>
            <Button
              variant="outline"
              size="icon-lg"
              onClick={() => scrollByPage(1)}
              disabled={!canScroll.forward}
              aria-label="Scroll forward"
            >
              <ChevronRight aria-hidden="true" />
            </Button>
          </div>
        ) : null}
      </div>
      <ul
        ref={scrollerRef}
        aria-label={label}
        className={cn(
          "-mx-4 mt-6 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-3",
          "[scrollbar-width:thin] motion-safe:scroll-smooth sm:mx-0 sm:scroll-px-0 sm:px-0",
        )}
      >
        {items.map((item) => (
          <li
            key={item.key}
            className="w-44 shrink-0 snap-start sm:w-52 lg:w-56"
          >
            {item.node}
          </li>
        ))}
      </ul>
    </div>
  );
}
