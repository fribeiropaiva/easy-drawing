"use client";

import { useEffect } from "react";

import {
  track,
  type AnalyticsEventName,
  type AnalyticsEvents,
} from "@/lib/analytics";

interface TrackEventProps<N extends AnalyticsEventName> {
  name: N;
  properties: AnalyticsEvents[N];
}

/**
 * Lets a Server Component record an event once its page is shown. Fires on
 * mount and again only when the event itself changes, for example a different
 * subject after a client-side navigation.
 */
export function TrackEvent<N extends AnalyticsEventName>({
  name,
  properties,
}: TrackEventProps<N>) {
  const serialized = JSON.stringify(properties);

  useEffect(() => {
    track(name, JSON.parse(serialized) as AnalyticsEvents[N]);
  }, [name, serialized]);

  return null;
}
