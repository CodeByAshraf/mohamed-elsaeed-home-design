"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

/**
 * Hydration-safe reduced-motion preference.
 *
 * The server cannot know the visitor's setting, so it always renders the "motion allowed"
 * version. React then hydrates with that same value (getServerSnapshot) and switches to the
 * real preference right after, so the server HTML and the first client render always match.
 * (framer-motion's useReducedMotion reads the real value during hydration, which caused a
 * hydration error for visitors who turn animations off.)
 */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
