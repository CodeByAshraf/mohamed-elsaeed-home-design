import { site } from "@/lib/site";
import { MARK_HEIGHT, MARK_PATH, MARK_VIEWBOX, MARK_WIDTH } from "@/components/brand/markPath";

type MonogramProps = {
  className?: string;
  title?: string;
  /** Prefix for the SVG ids; only needed if two monograms share a page. */
  idPrefix?: string;
};

/**
 * The official ME monogram, in the brand gold (`text-bronze`) unless a colour class says otherwise.
 * Inside a hovered or focused `group` (the navbar logo link), a band of light passes across the gold.
 */
export function Monogram({ className, title, idPrefix = "me-mark" }: MonogramProps) {
  const clip = `${idPrefix}-clip`;
  const sheen = `${idPrefix}-sheen`;
  return (
    <svg
      viewBox={MARK_VIEWBOX}
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <defs>
        <clipPath id={clip}>
          <path d={MARK_PATH} />
        </clipPath>
        <linearGradient id={sheen} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#fff4dc" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff4dc" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff4dc" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={MARK_PATH} fill="currentColor" />
      <g clipPath={`url(#${clip})`}>
        <g className="mark-sheen">
          <rect
            x={-MARK_WIDTH * 0.45}
            y={-MARK_HEIGHT * 0.2}
            width={MARK_WIDTH * 0.32}
            height={MARK_HEIGHT * 1.4}
            fill={`url(#${sheen})`}
            transform={`skewX(-18)`}
          />
        </g>
      </g>
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-3 whitespace-nowrap min-[360px]:gap-3.5 md:gap-4 ${className}`}>
      <Monogram className="h-8 w-auto shrink-0 text-bronze min-[360px]:h-9 md:h-10" />
      <span aria-hidden className="h-8 w-px bg-travertine/20" />
      {/* The Latin lockup is part of the logo: it keeps its letter-spacing on Arabic pages too. */}
      <span lang="en" className="flex flex-col leading-none">
        <span className="font-display text-[12px] uppercase tracking-[0.1em] text-travertine min-[360px]:text-[13px] min-[360px]:tracking-[0.16em] md:text-[14px]">
          {site.person}
        </span>
        <span className="mt-2 text-[9px] uppercase tracking-[0.2em] text-limestone min-[360px]:text-[10px] min-[360px]:tracking-[0.28em] md:text-[10.5px]">
          {site.tagline}
        </span>
      </span>
    </span>
  );
}
