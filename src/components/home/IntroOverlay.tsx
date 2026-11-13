"use client";

import { useEffect, type CSSProperties } from "react";
import { MARK_PATH, MARK_VIEWBOX } from "@/components/brand/markPath";
import { site } from "@/lib/site";

/**
 * "From the first line": the studio's opening, played once per visit on the homepage.
 *
 * A drawing sheet lays out its grid; the gold ME monogram is drawn as a single line and then filled;
 * the letters of the name arrive scattered and tumbling, like pieces laid out on a plan, and settle
 * into place; a dimension line closes the composition. The sheet then fades away over the hero's own
 * dark partitions, which carry straight on into the hero's entrance, so the two read as one movement.
 *
 * How it stays light and safe:
 * - All motion is CSS ("Intro" in globals.css) and starts on first paint. The overlay is hidden
 *   unless the inline <head> script added `intro` to <html> (homepage, first visit in this tab,
 *   motion allowed), so there is never a flash and nothing shows if scripts are off.
 * - `html.intro` also sets --intro-delay, which pushes every hero entrance back until the sheet clears.
 * - Click, tap, scroll or any key skips it. If this component never hydrates, the CSS still ends it.
 */

const NAME = site.person.toUpperCase();
const TAGLINE = site.tagline.toUpperCase();

/** Deterministic "random" in [0, 1) for letter i, so the server and browser draw the same scatter. */
function rand(i: number, salt: number) {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

const INTRO_SECONDS = 2.75;

export function IntroOverlay() {
  useEffect(() => {
    const d = document.documentElement;
    if (!d.classList.contains("intro")) return;

    const start = performance.now();
    const previousOverflow = d.style.overflow;
    d.style.overflow = "hidden";
    let done = false;

    /** Keep the hero waiting exactly as long as it needs to, then retire the overlay. */
    const finish = (skipped: boolean) => {
      if (done) return;
      done = true;
      const elapsed = (performance.now() - start) / 1000;
      // Freeze the delay the hero is using before the class (which defines it) goes away.
      d.style.setProperty("--intro-delay", `${skipped ? Math.min(elapsed + 0.35, INTRO_SECONDS) : INTRO_SECONDS}s`);
      d.style.overflow = previousOverflow;
      if (skipped) {
        d.classList.add("intro-out");
        window.setTimeout(() => d.classList.remove("intro", "intro-out"), 650);
      } else {
        d.classList.remove("intro");
      }
      remove();
    };

    const skip = () => finish(true);
    const onKey = (e: KeyboardEvent) => {
      if (!e.metaKey && !e.ctrlKey && !e.altKey) skip();
    };
    const timer = window.setTimeout(() => finish(false), INTRO_SECONDS * 1000 + 80);
    const opts = { passive: true } as const;
    window.addEventListener("pointerdown", skip, opts);
    window.addEventListener("wheel", skip, opts);
    window.addEventListener("touchmove", skip, opts);
    window.addEventListener("keydown", onKey);

    function remove() {
      window.clearTimeout(timer);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchmove", skip);
      window.removeEventListener("keydown", onKey);
    }
    return () => {
      remove();
      if (!done) d.style.overflow = previousOverflow;
    };
  }, []);

  let letterIndex = 0;

  return (
    <div aria-hidden className="intro-sheet" lang="en" dir="ltr">
      {/* The drawing sheet: grid lines, crosshairs and the sheet's margin notes */}
      <div className="intro-grid">
        <span className="intro-rule intro-rule-h" style={{ top: "22%", "--i": 0 } as CSSProperties} />
        <span className="intro-rule intro-rule-h" style={{ top: "78%", "--i": 1 } as CSSProperties} />
        <span className="intro-rule intro-rule-v" style={{ left: "14%", "--i": 2 } as CSSProperties} />
        <span className="intro-rule intro-rule-v" style={{ left: "86%", "--i": 3 } as CSSProperties} />
        {[
          ["14%", "22%"],
          ["86%", "22%"],
          ["14%", "78%"],
          ["86%", "78%"],
        ].map(([x, y], i) => (
          <span key={i} className="intro-cross" style={{ left: x, top: y, "--i": i } as CSSProperties} />
        ))}
        <span className="intro-note" style={{ left: "calc(14% + 14px)", top: "calc(22% - 26px)" }}>
          30°47′N · 31°00′E
        </span>
        <span className="intro-note intro-note-end" style={{ right: "calc(14% + 14px)", top: "calc(22% - 26px)" }}>
          Sheet A-01
        </span>
        <span className="intro-note" style={{ left: "calc(14% + 14px)", top: "calc(78% + 12px)" }}>
          Tanta · Egypt
        </span>
        <span className="intro-note intro-note-end" style={{ right: "calc(14% + 14px)", top: "calc(78% + 12px)" }}>
          Scale 1:50
        </span>
      </div>

      <div className="intro-content">
        {/* The monogram, drawn as one continuous line, then filled with gold and crossed by light */}
        <svg viewBox={MARK_VIEWBOX} className="intro-mark">
          <defs>
            <clipPath id="intro-mark-clip">
              <path d={MARK_PATH} />
            </clipPath>
            <linearGradient id="intro-mark-sheen" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#fff4dc" stopOpacity="0" />
              <stop offset="0.5" stopColor="#fff4dc" stopOpacity="0.85" />
              <stop offset="1" stopColor="#fff4dc" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={MARK_PATH} pathLength={1} className="intro-mark-line" />
          <path d={MARK_PATH} className="intro-mark-fill" />
          <g clipPath="url(#intro-mark-clip)">
            <rect className="intro-mark-sheen" x={-260} y={-120} width={200} height={900} fill="url(#intro-mark-sheen)" transform="skewX(-18)" />
          </g>
        </svg>

        {/* The name: every letter starts somewhere else on the sheet, turned and out of focus */}
        <p className="intro-name">
          {NAME.split(" ").map((word, w) => (
            <span key={w} className="intro-word">
              {word.split("").map((char) => {
                const i = letterIndex++;
                const style = {
                  "--dx": `${((rand(i, 1) - 0.5) * 2 * 34).toFixed(1)}vw`,
                  "--dy": `${((rand(i, 2) - 0.5) * 2 * 26).toFixed(1)}vh`,
                  "--r": `${((rand(i, 3) - 0.5) * 2 * 75).toFixed(0)}deg`,
                  "--s": (0.4 + rand(i, 4) * 1.4).toFixed(2),
                  "--d": `${(0.42 + rand(i, 5) * 0.55).toFixed(2)}s`,
                } as CSSProperties;
                return (
                  <span key={i} className="intro-letter" style={style}>
                    {char}
                  </span>
                );
              })}
            </span>
          ))}
        </p>

        {/* Dimension line under the name, then the discipline */}
        <span className="intro-dim">
          <span className="intro-dim-line" />
          <span className="intro-dim-tick intro-dim-tick-start" />
          <span className="intro-dim-tick intro-dim-tick-end" />
        </span>
        <p className="intro-tagline">{TAGLINE}</p>
      </div>
    </div>
  );
}
