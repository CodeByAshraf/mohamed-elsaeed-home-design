import type { CSSProperties, ReactNode } from "react";
import { ProjectImage } from "@/components/work/ProjectImage";
import { getProject } from "@/lib/projects";
import { getDictionary, localePath, type Locale } from "@/i18n";

/**
 * "Plan to reality": a pinned section whose floor plan draws itself as the visitor scrolls.
 *   0–25 %  Survey    outer walls, inner walls, windows and the site dimensions
 *   25–50 % Layout    doors swing in, furniture is placed, rooms are named with their areas
 *   50–75 % Lighting  concealed light lines and spotlights come on, the drawing dims around them
 *   75–100% Finish    the finished room (a real project photo) wipes in over the drawing
 *
 * Driven entirely by CSS scroll-driven animations ("Plan" in globals.css): no JavaScript runs while
 * scrolling. Where the browser cannot scrub animations with scroll, or the visitor prefers reduced
 * motion, the section is a normal block: the plan fully drawn, the four stages listed beside it.
 *
 * The drawing is a plausible 120 m² apartment at 1:50 (50 units = 1 m): 13.60 × 8.80 m.
 */

/* Ranges, as percentages of the pinned scroll. Each element reads --a/--b (see globals.css). */
const r = (a: number, b: number) => ({ "--a": `${a}%`, "--b": `${b}%` }) as CSSProperties;

type RoomKey = "reception" | "bedroom" | "kitchen" | "hall" | "bath" | "dressing";
const rooms: { key: RoomKey; x: number; y: number; area: string }[] = [
  { key: "reception", x: 200, y: 262, area: "43.7" },
  { key: "bedroom", x: 610, y: 275, area: "27.0" },
  { key: "kitchen", x: 160, y: 440, area: "14.4" },
  { key: "hall", x: 370, y: 405, area: "15.8" },
  { key: "bath", x: 540, y: 470, area: "8.6" },
  { key: "dressing", x: 660, y: 425, area: "10.1" },
];

/** Spotlights: [x, y]. */
const spots: [number, number][] = [
  [120, 110], [210, 110], [300, 110], [390, 110],
  [120, 270], [390, 270],
  [540, 110], [680, 110], [540, 280], [680, 280],
  [110, 400], [200, 400],
  [330, 360], [420, 360], [330, 460], [420, 460],
  [540, 370], [670, 370], [670, 470],
];

function Draw({ children, a, b, className = "" }: { children: ReactNode; a: number; b: number; className?: string }) {
  return (
    <g className={`pl-draw ${className}`} style={r(a, b)}>
      {children}
    </g>
  );
}

export function PlanSection({ lang }: { lang: Locale }) {
  const { plan } = getDictionary(lang);
  const project = getProject("tanta-riyadh", lang);
  const L = 1; // pathLength for every drawn line

  return (
    <section id="plan" aria-labelledby="plan-title" className="plan relative bg-basalt">
      <div className="plan-sticky">
        <div className="mx-auto grid h-full max-w-[1600px] grid-cols-12 content-center gap-x-6 gap-y-8 px-6 py-20 sm:px-10 md:py-24 lg:gap-x-10 lg:px-16">
          {/* Words: heading, the four stages, progress */}
          <div className="col-span-12 flex flex-col lg:col-span-4 lg:justify-center">
            <div className="flex items-center gap-4">
              <span aria-hidden className="h-px w-10 bg-travertine/35" />
              <p className="eyebrow text-[12px] font-medium uppercase tracking-[0.24em] text-limestone">{plan.eyebrow}</p>
            </div>
            <h2
              id="plan-title"
              className="mt-6 font-display text-[clamp(2rem,3.6vw,3.6rem)] leading-[1.05] tracking-[-0.01em] text-travertine"
              style={{ fontVariationSettings: "'wght' 600, 'opsz' 16" }}
            >
              {plan.headline}
            </h2>

            <ol className="plan-stages mt-8 lg:mt-14">
              {plan.stages.map((stage, i) => (
                <li key={stage.title} className={`plan-stage plan-stage-${i + 1}`}>
                  <p className="flex items-baseline gap-4">
                    <span className="font-display text-[clamp(2.2rem,3.4vw,3.4rem)] leading-none tabular-nums text-bronze" style={{ fontVariationSettings: "'wght' 500, 'opsz' 16" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[19px] text-travertine">{stage.title}</span>
                  </p>
                  <p className="mt-3 max-w-[36ch] text-[16px] font-light leading-[1.75] text-limestone">{stage.body}</p>
                </li>
              ))}
            </ol>

            {/* Progress through the four stages (scroll-driven) */}
            <div aria-hidden className="plan-progress mt-10">
              <div className="flex justify-between text-[11px] tabular-nums tracking-[0.2em] text-smoke">
                {plan.stages.map((s, i) => (
                  <span key={s.title} className={`plan-tick plan-tick-${i + 1}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                ))}
              </div>
              <div className="relative mt-3 h-px bg-travertine/15">
                <span className="plan-bar absolute inset-0 bg-bronze" />
              </div>
              <p className="plan-hint mt-4 text-[12px] tracking-[0.1em] text-smoke">{plan.scroll}</p>
            </div>
          </div>

          {/* The drawing */}
          <figure className="col-span-12 lg:col-span-8">
            <div className="plan-figure relative mx-auto w-full max-w-[min(100%,calc((100svh-12rem)*820/560))]">
              <svg viewBox="0 0 820 560" style={{ direction: "ltr" }} role="img" aria-label={plan.planLabel} className="plan-svg block h-auto w-full">
                <defs>
                  <filter id="plan-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="5" result="b" />
                    <feMerge>
                      <feMergeNode in="b" />
                      <feMergeNode in="b" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <radialGradient id="plan-spot">
                    <stop offset="0" stopColor="#ffd9a0" stopOpacity="0.55" />
                    <stop offset="1" stopColor="#ffd9a0" stopOpacity="0" />
                  </radialGradient>
                  <pattern id="plan-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <line x1="0" y1="0" x2="0" y2="8" stroke="rgb(236 230 219 / 0.12)" strokeWidth="1" />
                  </pattern>
                </defs>

                {/* Faint drawing-sheet grid, every metre */}
                <g className="pl-fade" style={r(0, 8)}>
                  {Array.from({ length: 15 }, (_, i) => (
                    <line key={`v${i}`} x1={60 + i * 50} y1={40} x2={60 + i * 50} y2={520} stroke="rgb(236 230 219 / 0.04)" />
                  ))}
                  {Array.from({ length: 10 }, (_, i) => (
                    <line key={`h${i}`} x1={40} y1={60 + i * 50} x2={760} y2={60 + i * 50} stroke="rgb(236 230 219 / 0.04)" />
                  ))}
                </g>

                <g className="plan-lines">
                  {/* 1 · Survey: outer walls (thick), with openings for windows and the entrance */}
                  <Draw a={2} b={16} className="pl-wall-outer">
                    <path pathLength={L} d="M140 60 H60 V140 M60 260 V500 H330 M400 500 H740 V460 M740 380 V240 M740 120 V60 H680 M560 60 H300" />
                  </Draw>
                  {/* Inner walls, with door openings */}
                  <Draw a={7} b={21} className="pl-wall-inner">
                    <path pathLength={L} d="M60 320 H170 M250 320 H300 M420 320 H640 M690 320 H740" />
                    <path pathLength={L} d="M480 60 V250 M480 300 V380 M480 430 V500" />
                    <path pathLength={L} d="M260 320 V500 M600 320 V500" />
                  </Draw>
                  {/* Windows: three thin lines across each opening */}
                  <g className="pl-fade pl-window" style={r(14, 21)}>
                    <path d="M140 56 H300 M140 60 H300 M140 64 H300 M560 56 H680 M560 60 H680 M560 64 H680" />
                    <path d="M56 140 V260 M60 140 V260 M64 140 V260" />
                    <path d="M736 120 V240 M740 120 V240 M744 120 V240 M736 380 V460 M740 380 V460 M744 380 V460" />
                  </g>
                  {/* Wall hatching in the thick external walls' corners (a drafting detail) */}
                  <g className="pl-fade" style={r(16, 22)}>
                    <rect x="52" y="52" width="16" height="16" fill="url(#plan-hatch)" />
                    <rect x="732" y="52" width="16" height="16" fill="url(#plan-hatch)" />
                    <rect x="52" y="492" width="16" height="16" fill="url(#plan-hatch)" />
                    <rect x="732" y="492" width="16" height="16" fill="url(#plan-hatch)" />
                  </g>

                  {/* Site dimensions */}
                  <Draw a={12} b={24} className="pl-dim">
                    <path pathLength={L} d="M60 30 H740 M60 24 V36 M480 24 V36 M740 24 V36" />
                    <path pathLength={L} d="M30 60 V500 M24 60 H36 M24 320 H36 M24 500 H36" />
                  </Draw>
                  <g className="pl-fade pl-dim-text" style={r(18, 26)}>
                    <text x="270" y="22" textAnchor="middle">8.40</text>
                    <text x="610" y="22" textAnchor="middle">5.20</text>
                    <text x="20" y="190" textAnchor="middle" transform="rotate(-90 20 190)">5.20</text>
                    <text x="20" y="410" textAnchor="middle" transform="rotate(-90 20 410)">3.60</text>
                  </g>

                  {/* 2 · Layout: doors swing in */}
                  <Draw a={27} b={37} className="pl-door">
                    <path pathLength={L} d="M480 250 L530 250 A50 50 0 0 1 480 300" />
                    <path pathLength={L} d="M480 380 L530 380 A50 50 0 0 1 480 430" />
                    <path pathLength={L} d="M640 320 L640 370 A50 50 0 0 0 690 320" />
                    <path pathLength={L} d="M330 500 L330 430 A70 70 0 0 1 400 500" />
                  </Draw>
                  {/* Furniture, room by room */}
                  <Draw a={30} b={42} className="pl-furn">
                    <rect pathLength={L} x="96" y="84" width="300" height="196" rx="2" className="pl-rug" />
                    <path pathLength={L} d="M110 96 H300 V140 H156 V220 H110 Z" />
                    <circle pathLength={L} cx="225" cy="195" r="30" />
                    <rect pathLength={L} x="270" y="222" width="44" height="44" rx="8" />
                    <rect pathLength={L} x="456" y="96" width="16" height="140" rx="2" />
                  </Draw>
                  <Draw a={33} b={44} className="pl-furn">
                    <rect pathLength={L} x="340" y="150" width="96" height="58" rx="3" />
                    <path pathLength={L} d="M352 140 h18 v8 h-18 Z M406 140 h18 v8 h-18 Z M352 210 h18 v8 h-18 Z M406 210 h18 v8 h-18 Z" />
                    <rect pathLength={L} x="560" y="80" width="140" height="170" rx="6" />
                    <path pathLength={L} d="M572 92 h52 v26 h-52 Z M636 92 h52 v26 h-52 Z M560 140 H700" />
                    <rect pathLength={L} x="520" y="84" width="30" height="30" rx="2" />
                    <rect pathLength={L} x="708" y="84" width="26" height="30" rx="2" />
                  </Draw>
                  <Draw a={36} b={47} className="pl-furn">
                    <path pathLength={L} d="M68 328 H252 V350 H90 V492 H68 Z" />
                    <rect pathLength={L} x="140" y="331" width="40" height="15" rx="3" />
                    <path pathLength={L} d="M206 339 m-5 0 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0 M226 339 m-5 0 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0" />
                    <rect pathLength={L} x="500" y="440" width="90" height="52" rx="12" />
                    <ellipse pathLength={L} cx="575" cy="345" rx="15" ry="10" />
                    <ellipse pathLength={L} cx="580" cy="402" rx="10" ry="14" />
                    <rect pathLength={L} x="700" y="336" width="32" height="156" rx="2" />
                    <rect pathLength={L} x="612" y="468" width="80" height="24" rx="2" />
                    <rect pathLength={L} x="440" y="440" width="32" height="52" rx="2" />
                  </Draw>
                  {/* Room names and areas */}
                  <g className="pl-fade pl-label" style={r(38, 49)}>
                    {rooms.map((room) => (
                      <g key={room.key}>
                        <text x={room.x} y={room.y} textAnchor="middle" className="pl-room">
                          {plan.rooms[room.key]}
                        </text>
                        <text x={room.x} y={room.y + 17} textAnchor="middle" className="pl-area">
                          {room.area} m²
                        </text>
                      </g>
                    ))}
                  </g>
                  {/* North arrow and scale bar */}
                  <g className="pl-fade pl-north" style={r(40, 50)}>
                    <circle cx="790" cy="90" r="16" />
                    <path d="M790 70 L796 96 L790 91 L784 96 Z" className="pl-north-arrow" />
                    <text x="790" y="62" textAnchor="middle">N</text>
                    <path d="M60 534 H310 M60 528 V540 M110 530 V538 M160 530 V538 M210 530 V538 M260 530 V538 M310 528 V540" />
                    <text x="60" y="554">0</text>
                    <text x="310" y="554" textAnchor="middle">5 m</text>
                    <text x="740" y="546" textAnchor="end" className="pl-title">
                      {plan.total} 120 m² · {plan.scale}
                    </text>
                  </g>
                </g>

                {/* 3 · Lighting: concealed light lines and spotlights, glowing */}
                <g className="plan-light">
                  <Draw a={52} b={64} className="pl-cove">
                    <rect pathLength={L} x="80" y="80" width="380" height="220" rx="4" filter="url(#plan-glow)" />
                    <rect pathLength={L} x="500" y="80" width="220" height="220" rx="4" filter="url(#plan-glow)" />
                    <path pathLength={L} d="M290 350 H460" filter="url(#plan-glow)" />
                  </Draw>
                  {spots.map(([x, y], i) => (
                    <g key={i} className="pl-fade" style={r(56 + (i % 10) * 1.2, 62 + (i % 10) * 1.2)}>
                      <circle cx={x} cy={y} r="26" fill="url(#plan-spot)" />
                      <circle cx={x} cy={y} r="3" fill="#ffe2b8" />
                    </g>
                  ))}
                  <g className="pl-fade" style={r(60, 68)}>
                    <circle cx="388" cy="179" r="46" fill="url(#plan-spot)" />
                    <circle cx="388" cy="179" r="7" fill="none" stroke="#ffe2b8" strokeWidth="1.5" />
                  </g>
                </g>
              </svg>

              {/* 4 · Finish: the real room wipes in over its drawing */}
              {project ? (
                <a href={localePath(lang, `/work/${project.slug}`)} data-cursor="view" className="plan-photo group absolute inset-0 block overflow-hidden">
                  <ProjectImage image={project.cover} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover transition-transform duration-[1400ms] ease-architect group-hover:scale-[1.03]" />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-basalt-deep/85 to-transparent px-5 pb-4 pt-16 text-[14px] tracking-[0.02em] text-travertine">
                    {plan.photoCaption}
                  </span>
                </a>
              ) : null}
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
}
