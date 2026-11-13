import type { CSSProperties, ReactNode } from "react";

/**
 * Scroll reveals driven by CSS (see globals.css) and the inline observer in revealScript.ts.
 * These are plain server components: no JavaScript bundle, and content stays visible if
 * scripts never run. suppressHydrationWarning covers the [data-shown] attribute the observer
 * may add before React hydrates.
 */
type Vars = CSSProperties & Record<`--${string}`, string>;

/** Fades and lifts its content into place on first paint (for content above the fold). */
export function Enter({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <div className={`enter-rise ${className}`} style={{ "--enter-delay": `${delay}s` } as Vars}>
      {children}
    </div>
  );
}

/** Fades and lifts its content into place the first time it scrolls into view. */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const style: Vars = { "--reveal-delay": `${delay}s`, "--reveal-y": `${y}px` };
  return (
    <div data-reveal="fade" className={className} style={style} suppressHydrationWarning>
      {children}
    </div>
  );
}

/**
 * Each line rises out of its own mask, staggered: the same gesture as the hero headline.
 * `onLoad` plays it immediately on first paint (for titles above the fold) instead of on scroll.
 */
export function MaskLines({
  lines,
  delay = 0,
  stagger = 0.12,
  onLoad = false,
}: {
  lines: readonly string[];
  delay?: number;
  stagger?: number;
  onLoad?: boolean;
}) {
  return (
    <span {...(onLoad ? {} : { "data-reveal": "lines" })} className="block" suppressHydrationWarning>
      {lines.map((line, i) => (
        <span key={line} className="-mb-[0.1em] block overflow-hidden pb-[0.1em]">
          <span
            className={`${onLoad ? "enter-line" : "reveal-line"} block`}
            style={{ [onLoad ? "--enter-delay" : "--reveal-delay"]: `${delay + i * stagger}s` } as Vars}
          >
            {line}
            {/* A real space between lines: each line is its own block, and without it the heading's text
                reads "Finished tothe last detail." to search engines and anything that copies the text. */}
            {i < lines.length - 1 ? " " : null}
          </span>
        </span>
      ))}
    </span>
  );
}

/** A dimension line (rule with angled end ticks) that draws itself across when it enters the view. */
export function DimensionLine({ className = "", tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  const line = tone === "light" ? "bg-travertine/35" : "bg-basalt/30";
  const tick = tone === "light" ? "bg-travertine/70" : "bg-basalt/60";
  return (
    <div aria-hidden data-reveal="draw" className={`relative h-3 ${className}`} suppressHydrationWarning>
      {/* The observed element keeps its full size; only this inner layer is drawn in. */}
      <div className="reveal-draw absolute inset-0">
        <span className={`absolute inset-x-0 top-1/2 h-px ${line}`} />
        <span className={`absolute left-0 top-0 h-3 w-px rotate-45 ${tick}`} />
        <span className={`absolute right-0 top-0 h-3 w-px rotate-45 ${tick}`} />
      </div>
    </div>
  );
}
