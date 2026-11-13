"use client";

import { useState, type CSSProperties } from "react";
import { Check } from "lucide-react";
import type { Swatch } from "@/lib/projects";
import { useLocale } from "@/i18n/LocaleProvider";
import { fill } from "@/i18n/config";

/**
 * The project's colours as a row of paint chips, taken from its own photographs
 * (scripts/extract_palette.py). The chips rise in one after another as the row scrolls into view
 * (CSS, see "Palette" in globals.css); tapping one copies its hex code.
 */
export function ProjectPalette({ palette }: { palette: Swatch[] }) {
  const { dict } = useLocale();
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex.toUpperCase());
      setCopied(hex);
      window.setTimeout(() => setCopied((c) => (c === hex ? null : c)), 1400);
    } catch {
      /* Clipboard unavailable (e.g. insecure context): the hex code is still on screen. */
    }
  };

  return (
    <div data-reveal="fade" suppressHydrationWarning className="palette">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <div className="flex items-center gap-4">
          <span aria-hidden className="h-px w-10 bg-travertine/35" />
          <h2 className="eyebrow text-[12px] font-medium uppercase tracking-[0.24em] text-limestone">{dict.work.palette}</h2>
        </div>
        <p className="text-[13px] text-smoke">{dict.work.paletteNote}</p>
      </div>
      <ul className="mt-8 grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3">
        {palette.map((swatch, i) => (
          <li key={swatch.hex} style={{ "--k": i } as CSSProperties}>
            <button
              type="button"
              onClick={() => copy(swatch.hex)}
              aria-label={fill(dict.work.copy, { hex: swatch.hex.toUpperCase() })}
              className="palette-chip group block w-full text-start"
            >
              <span className="palette-colour relative block h-28 overflow-hidden rounded-[2px] md:h-40" style={{ background: swatch.hex }}>
                <span
                  aria-hidden
                  className={`absolute inset-0 flex items-center justify-center bg-basalt-deep/35 text-travertine transition-opacity duration-300 ${copied === swatch.hex ? "opacity-100" : "opacity-0"}`}
                >
                  <Check size={20} strokeWidth={1.5} />
                </span>
              </span>
              <span className="mt-3 flex items-baseline justify-between gap-2">
                <span lang="en" dir="ltr" className="text-[13px] uppercase tabular-nums tracking-[0.08em] text-travertine">
                  {swatch.hex}
                </span>
                <span lang="en" dir="ltr" className="text-[12px] tabular-nums text-smoke">
                  {copied === swatch.hex ? dict.work.copied : `${swatch.share}%`}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The same palette as one thin bar, each colour as wide as its share (for the homepage cards). */
export function PaletteBar({ palette, className = "" }: { palette: Swatch[]; className?: string }) {
  const total = palette.reduce((n, s) => n + s.share, 0) || 1;
  return (
    <span aria-hidden className={`palette-bar flex h-[5px] w-full overflow-hidden rounded-full ${className}`}>
      {palette.map((s, i) => (
        <span key={s.hex} style={{ background: s.hex, width: `${(s.share / total) * 100}%`, "--k": i } as CSSProperties} />
      ))}
    </span>
  );
}
