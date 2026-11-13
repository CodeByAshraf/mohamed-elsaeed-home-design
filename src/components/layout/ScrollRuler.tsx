"use client";

import { useEffect, useRef } from "react";
import { m, useMotionValueEvent, useScroll, useTransform } from "framer-motion";

/** Scroll travel in px for one metre on the ruler (one major tick). */
const PX_PER_METRE = 100;
/** The scale moves 0.4 px for every px scrolled, so a major tick (1 m) is 40 px apart. */
const TRACK_RATE = 0.4;

/**
 * A surveyor's scale along the edge of the page (desktop): its ticks slide past a fixed index as the
 * page scrolls, and the reading beside the index says how far down the visitor has "walked", in metres.
 * The reading shows only while the page is moving, so it never sits over the text at rest.
 * Drawn in difference blend so it stays legible over both the dark and the light sections.
 * Only `background-position` and one text node change while scrolling; no React re-render.
 */
export function ScrollRuler() {
  const { scrollY } = useScroll();
  const position = useTransform(scrollY, (v) => `${(-v * TRACK_RATE).toFixed(1)}px`);
  const reading = useRef<HTMLSpanElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const idle = useRef(0);

  useMotionValueEvent(scrollY, "change", (v) => {
    if (reading.current) reading.current.textContent = (v / PX_PER_METRE).toFixed(2);
    label.current?.classList.add("is-measuring");
    window.clearTimeout(idle.current);
    idle.current = window.setTimeout(() => label.current?.classList.remove("is-measuring"), 900);
  });
  useEffect(() => () => window.clearTimeout(idle.current), []);

  return (
    <div
      aria-hidden
      className="scroll-ruler pointer-events-none fixed end-5 top-1/2 z-30 hidden h-[44vh] w-10 -translate-y-1/2 items-center mix-blend-difference lg:flex xl:end-8 in-data-[menu=open]:invisible"
    >
      <m.div className="scroll-ruler-track absolute inset-y-0 end-0 w-4" style={{ backgroundPositionY: position }} />
      {/* Fixed index with the reading */}
      <span className="absolute end-0 top-1/2 h-px w-7 -translate-y-1/2 bg-travertine" />
      <span
        ref={label}
        lang="en"
        dir="ltr"
        className="scroll-ruler-reading absolute end-9 top-1/2 -translate-y-1/2 whitespace-nowrap text-[11px] tabular-nums tracking-[0.12em] text-travertine"
      >
        <span ref={reading}>0.00</span> m
      </span>
    </div>
  );
}
