"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

import {
  track,
  type AnalyticsEventName,
  type AnalyticsEvents,
} from "@/lib/analytics";

type TrackedLinkProps<N extends AnalyticsEventName> = ComponentProps<
  typeof Link
> & {
  event: N;
  properties: AnalyticsEvents[N];
};

/** A next/link that records an event when clicked. Navigation is unchanged. */
export function TrackedLink<N extends AnalyticsEventName>({
  event,
  properties,
  onClick,
  ...props
}: TrackedLinkProps<N>) {
  return (
    <Link
      {...props}
      onClick={(mouseEvent) => {
        track(event, properties);
        onClick?.(mouseEvent);
      }}
    />
  );
}
