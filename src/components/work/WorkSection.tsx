import { ProjectFeature } from "@/components/work/ProjectFeature";
import { MaskLines, Reveal } from "@/components/motion/Reveal";
import { getProjects } from "@/lib/projects";
import Link from "next/link";
import { ArrowSwap } from "@/components/motion/Interactions";
import { getDictionary, localePath, type Locale } from "@/i18n";

export function WorkSection({ lang }: { lang: Locale }) {
  const { work } = getDictionary(lang);
  return (
    <section id="work" aria-labelledby="work-title" className="relative scroll-mt-20 bg-basalt">
      <div className="mx-auto max-w-[1600px] px-6 pb-28 pt-28 sm:px-10 md:pb-40 md:pt-40 lg:px-16">
        <div className="grid grid-cols-12 gap-x-6 lg:gap-x-10">
          <div className="col-span-12 lg:col-span-8">
            <Reveal className="flex items-center gap-4">
              <span aria-hidden className="h-px w-10 bg-travertine/35" />
              <p className="eyebrow text-[12px] font-medium uppercase tracking-[0.24em] text-limestone">{work.eyebrow}</p>
            </Reveal>
            <h2
              id="work-title"
              className="mt-8 font-display text-[clamp(2.4rem,6.2vw,6rem)] leading-[1.02] tracking-[-0.02em] text-travertine md:mt-10"
              style={{ fontVariationSettings: "'wght' 600, 'opsz' 16" }}
            >
              <MaskLines lines={work.headline} delay={0.1} />
            </h2>
          </div>
          <Reveal delay={0.2} className="col-span-12 mt-8 lg:col-span-4 lg:mt-0 lg:self-end">
            <p className="max-w-[40ch] text-[16px] font-light leading-[1.75] text-limestone md:text-[17px]">{work.intro}</p>
          </Reveal>
        </div>

        <div className="mt-20 flex flex-col gap-28 md:mt-28 md:gap-40">
          {getProjects(lang).map((project, i) => (
            <ProjectFeature key={project.slug} project={project} index={i} lang={lang} />
          ))}
        </div>
        <Reveal className="mt-24 flex justify-center md:mt-32">
          <Link
            href={localePath(lang, "/work")}
            className="group eyebrow inline-flex h-14 items-center gap-3 rounded-full border border-travertine/30 px-8 text-[14px] uppercase tracking-[0.18em] text-travertine transition-colors hover:border-travertine hover:bg-travertine hover:text-basalt"
          >
            {work.allWork}
            <ArrowSwap size={16} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
