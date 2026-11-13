import Link from "next/link";
import { ProjectImage } from "@/components/work/ProjectImage";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowSwap, RollText } from "@/components/motion/Interactions";
import { underline } from "@/components/motion/classes";
import type { Project } from "@/lib/projects";
import { PaletteBar } from "@/components/work/ProjectPalette";
import { fill, getDictionary, localePath, type Locale } from "@/i18n";

/**
 * One project on the homepage: a large photograph beside a short spec sheet.
 * The whole card is clickable through an overlay link placed directly in the article (above every
 * part of the card, and outside the animated wrappers), and the decorative "View project" label
 * ignores the pointer. The title is the real, focusable link, so screen readers and keyboard users
 * meet a single, clean link per project.
 */
export function ProjectFeature({ project, index, lang }: { project: Project; index: number; lang: Locale }) {
  const { work } = getDictionary(lang);
  const flip = index % 2 === 1;
  const number = String(index + 1).padStart(2, "0");
  const facts = project.facts.filter((f) => f.key !== "location");
  const location = project.facts.find((f) => f.key === "location")?.value;
  const href = localePath(lang, `/work/${project.slug}`);
  const area = project.facts.find((f) => f.key === "area")?.value ?? "";

  return (
    <article className="group relative grid grid-cols-12 gap-x-6 lg:gap-x-10">
      {/* Whole-card hit area for mouse and touch. It sits directly in the article, outside every
          animated wrapper: an element inside a moving (transformed) wrapper is confined to that
          wrapper, so a stretched link nested in the title used to cover only the title while its
          entrance played. Hidden from screen readers and the keyboard: the title link below is the
          real, focusable link. */}
      <Link
        href={href}
        aria-hidden
        tabIndex={-1}
        data-cursor="view"
        className="absolute inset-0 z-10"
      />
      <div className={`col-span-12 -mx-6 sm:-mx-10 lg:col-span-8 lg:mx-0 ${flip ? "lg:order-2 lg:col-start-5" : ""}`}>
        {/* The photograph: rises like a curtain and settles from a slight zoom as it scrolls into view,
            drifts gently inside its frame while the page moves, and sits under a soft warm grade that
            lifts on hover (see "Project covers" in globals.css). */}
        <div data-reveal="curtain" suppressHydrationWarning className="cover-frame relative aspect-[4/3] overflow-hidden bg-basalt-deep">
          <div className="reveal-zoom absolute inset-0">
            <div className="cover-drift absolute inset-x-0 -inset-y-[6%]">
              <ProjectImage image={project.cover} fill sizes="(min-width: 1024px) 62vw, 100vw" className="cover-photo object-cover" />
            </div>
          </div>
          <span aria-hidden className="cover-grade pointer-events-none absolute inset-0" />
          {/* Survey marks: crop corners and a dimension line with the area, drawn as the photo arrives */}
          <span aria-hidden className="survey pointer-events-none absolute inset-0">
            <span className="survey-c survey-tl" />
            <span className="survey-c survey-tr" />
            <span className="survey-c survey-bl" />
            <span className="survey-c survey-br" />
            <span className="survey-dim">
              <span className="survey-dim-line" />
              <span className="survey-dim-label eyebrow">{fill(work.surveyArea, { area })}</span>
            </span>
          </span>
        </div>
      </div>

      <div className={`col-span-12 mt-10 flex flex-col lg:col-span-4 lg:mt-0 lg:justify-end ${flip ? "lg:order-1" : ""}`}>
        <Reveal delay={0.1}>
          <p className="eyebrow text-[12px] font-medium uppercase tracking-[0.24em] text-bronze">{fill(work.project, { n: number })}</p>
        </Reveal>
        <Reveal delay={0.15}>
          <h3
            className="mt-5 font-display text-[clamp(2rem,3.2vw,3.1rem)] leading-[1.05] text-travertine"
            style={{ fontVariationSettings: "'wght' 600, 'opsz' 16" }}
          >
            <Link
              href={href}
              className="relative z-20 outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-8 focus-visible:outline-bronze"
            >
              {project.title}
            </Link>
          </h3>
          {location ? <p className="mt-3 text-[14px] tracking-[0.04em] text-limestone">{location}</p> : null}
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-7 font-display text-[1.3rem] italic leading-[1.4] text-travertine/85" style={{ fontVariationSettings: "'opsz' 16" }}>
            {project.tagline}
          </p>
        </Reveal>
        <Reveal delay={0.25}>
          <dl className="mt-9 grid grid-cols-2 border-t border-travertine/15">
            {facts.map((f, i) => (
              <div
                key={f.key}
                className={`border-b border-travertine/15 py-4 ${i % 2 === 0 ? "pe-4" : "border-s ps-5"}`}
              >
                <dt className="eyebrow text-[11px] uppercase tracking-[0.2em] text-smoke">{work.facts[f.key]}</dt>
                <dd className="mt-1.5 text-[15px] text-travertine">{f.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
        <Reveal delay={0.28}>
          <PaletteBar palette={project.palette} className="mt-8" />
        </Reveal>
        <Reveal delay={0.3}>
          <span aria-hidden className="eyebrow pointer-events-none relative mt-9 inline-flex items-center gap-3 text-[14px] font-medium uppercase tracking-[0.18em] text-travertine">
            <RollText>{work.viewProject}</RollText>
            <ArrowSwap size={16} />
            <span className={`absolute -bottom-2 start-0 h-px w-full bg-bronze ${underline}`} />
          </span>
        </Reveal>
      </div>
    </article>
  );
}
