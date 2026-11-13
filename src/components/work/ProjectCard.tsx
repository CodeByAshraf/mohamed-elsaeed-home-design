import Link from "next/link";
import { ProjectImage } from "@/components/work/ProjectImage";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowSwap } from "@/components/motion/Interactions";
import { PaletteBar } from "@/components/work/ProjectPalette";
import type { Project } from "@/lib/projects";
import { getDictionary, localePath, type Locale } from "@/i18n";

/** A compact project card for grids (portfolio page, service pages): photo, name, place and facts. */
export function ProjectCard({ project, lang, delay = 0, headingLevel = "h3" }: { project: Project; lang: Locale; delay?: number; headingLevel?: "h2" | "h3" }) {
  const { work } = getDictionary(lang);
  const Heading = headingLevel;
  const fact = (key: string) => project.facts.find((f) => f.key === key)?.value;
  return (
    <Reveal delay={delay} y={32}>
      <article className="group relative">
        <Link href={localePath(lang, `/work/${project.slug}`)} data-cursor="view" className="absolute inset-0 z-10" aria-hidden tabIndex={-1} />
        <div className="cover-frame relative aspect-[4/3] overflow-hidden bg-basalt-deep">
          <ProjectImage image={project.cover} fill sizes="(min-width: 1024px) 45vw, 100vw" className="cover-photo object-cover" />
          <span aria-hidden className="cover-grade pointer-events-none absolute inset-0" />
        </div>
        <div className="mt-6 flex items-start justify-between gap-6">
          <div>
            <Heading className="font-display text-[clamp(1.6rem,2.4vw,2.2rem)] leading-[1.1] text-travertine" style={{ fontVariationSettings: "'wght' 600, 'opsz' 16" }}>
              <Link href={localePath(lang, `/work/${project.slug}`)} className="relative z-20">
                {project.title}
              </Link>
            </Heading>
            <p className="mt-2 text-[14px] text-limestone">{fact("location")}</p>
          </div>
          <span aria-hidden className="mt-2 text-travertine">
            <ArrowSwap size={20} strokeWidth={1.25} />
          </span>
        </div>
        <p className="mt-4 text-[14px] text-smoke">
          {[fact("area"), fact("duration"), fact("scope")].filter(Boolean).join(" · ")}
        </p>
        <PaletteBar palette={project.palette} className="mt-5" />
        <span className="sr-only">{work.viewProject}</span>
      </article>
    </Reveal>
  );
}
