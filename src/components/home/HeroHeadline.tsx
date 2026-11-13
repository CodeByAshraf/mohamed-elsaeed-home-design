import type { CSSProperties } from "react";

/** Final stroke weight of the headline (Bodoni Moda variable axis, 400–900). */
const FINAL_WEIGHT = 650;
/** Optical size, fixed low so the hairlines stay sturdy and legible at display sizes (axis 6–96). */
const OPTICAL_SIZE = 16;

type HeroHeadlineProps = {
  id?: string;
  /** The element to render: the slogan is a display line, the page's <h1> is the badge above it. */
  as?: "h1" | "p";
  lines: readonly string[];
  /** Seconds before the first word starts to move. */
  delay?: number;
  className?: string;
};

/**
 * The studio's signature line, in two beats, all in CSS (see `.enter-word` in globals.css):
 * 1. Rise: each word lifts out of its own mask, staggered.
 * 2. Light pass: one band of warm light travels across the words, like sun crossing a room.
 *
 * Only transform and background-position move, so the browser never has to re-measure the
 * text while it animates, and the words are drawn at their final bold weight from the first
 * frame. It starts on first paint, without waiting for JavaScript.
 */
export function HeroHeadline({ id, as: Tag = "h1", lines, delay = 0, className = "" }: HeroHeadlineProps) {
  const words = lines.map((line) => line.split(" "));
  const totalWords = words.flat().length;
  const stagger = 0.08;
  const lightStart = delay + totalWords * stagger + 0.9;
  const lineOffsets = words.map((_, i) => words.slice(0, i).reduce((n, w) => n + w.length, 0));

  return (
    // A heading can carry its text in aria-label; a paragraph cannot, so it gets a visually hidden copy.
    <Tag id={id} className={className} aria-label={Tag === "h1" ? lines.join(" ") : undefined}>
      {Tag === "p" ? <span className="sr-only">{lines.join(" ")}</span> : null}
      {words.map((lineWords, lineIndex) => (
        <span key={lineIndex} aria-hidden className="block">
          {lineWords.map((word, wordIndex) => {
            const index = lineOffsets[lineIndex] + wordIndex;
            const style = {
              "--enter-delay": `${delay + index * stagger}s`,
              "--light-delay": `${lightStart + index * 0.07}s`,
              backgroundImage:
                "linear-gradient(100deg, #ece6db 0%, #ece6db 40%, #fffaf1 49%, #f3dfbd 51%, #ece6db 60%, #ece6db 100%)",
              backgroundSize: "260% 100%",
              backgroundPosition: "0% 0%",
              WebkitBackgroundClip: "text",
              fontVariationSettings: `'wght' ${FINAL_WEIGHT}, 'opsz' ${OPTICAL_SIZE}`,
            } as CSSProperties;
            return (
              <span key={`${word}-${wordIndex}`}>
                {/* Mask with room for descenders and the slight overshoot of the rise */}
                <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom">
                  <span className="enter-word inline-block origin-bottom-left bg-clip-text text-transparent rtl:origin-bottom-right" style={style}>
                    {word}
                  </span>
                </span>
                {wordIndex < lineWords.length - 1 ? " " : null}
              </span>
            );
          })}
          {lineIndex < words.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}
