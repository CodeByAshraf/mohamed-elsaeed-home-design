"use client";

import { useRef } from "react";
import { m, useScroll, useTransform } from "framer-motion";
import { ProjectImage } from "@/components/work/ProjectImage";
import portrait from "@/data/site/portrait.images.json";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { DimensionLine, MaskLines, Reveal } from "@/components/motion/Reveal";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { useLocale } from "@/i18n/LocaleProvider";


/**
 * Editorial spread on a light ground: headline across the top, the portrait bleeding
 * off the reading-start edge of the page, and the designer's words set in an offset column.
 */
export function AboutSection() {
  const { about } = useLocale().dict;
  const reduce = usePrefersReducedMotion();
  const photoRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: photoRef, offset: ["start end", "end start"] });
  /* Gentle depth: the photograph drifts slightly inside its frame as the page moves */
  const photoY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-5%", "5%"]);

  return (
    <section
      id="studio"
      aria-labelledby="studio-title"
      className="relative scroll-mt-20 overflow-hidden bg-travertine text-basalt"
    >
      <div className="mx-auto max-w-[1600px] px-6 pb-28 pt-28 sm:px-10 md:pb-40 md:pt-40 lg:px-16">
        <Reveal className="flex items-center gap-4">
          <span aria-hidden className="h-px w-10 bg-basalt/40" />
          <p className="eyebrow text-[12px] font-medium uppercase tracking-[0.24em] text-basalt/70">{about.eyebrow}</p>
        </Reveal>

        <h2
          id="studio-title"
          className="mt-8 font-display text-[clamp(2rem,calc((100vw-3rem)/7.5),7.25rem)] leading-[1.02] tracking-[-0.02em] sm:text-[clamp(2rem,calc((100vw-5rem)/7.5),7.25rem)] md:mt-10 lg:text-[clamp(2rem,calc((100vw-8rem)/7.5),7.25rem)]"
          style={{ fontVariationSettings: "'wght' 600, 'opsz' 16" }}
        >
          <MaskLines lines={about.headline} delay={0.1} />
        </h2>

        <div className="mt-14 grid grid-cols-12 gap-x-6 md:mt-20 lg:gap-x-10">
          {/* Portrait: full-bleed on phones, runs off the left edge of the page on desktop */}
          <div className="col-span-12 -mx-6 sm:-mx-10 lg:col-span-6 lg:mx-0 lg:ms-[calc((min(100vw,1600px)-100vw)/2-4rem)]">
            <div
              ref={photoRef}
              data-reveal="curtain"
              suppressHydrationWarning
              className="relative aspect-[4/5] overflow-hidden bg-basalt/10 lg:aspect-auto lg:h-[min(92vh,980px)]"
            >
              <m.div className="absolute inset-x-0 -inset-y-[6%]" style={{ y: photoY }}>
                <ProjectImage
                  image={{ ...portrait["mohamed-elsaeed"], alt: about.photoAlt }}
                  fill
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="object-cover object-[50%_35%]"
                />
              </m.div>
            </div>
          </div>

          {/* The designer's words */}
          <div className="col-span-12 mt-16 lg:col-span-5 lg:col-start-8 lg:mt-0 lg:pt-[18vh]">
            <Reveal>
              <span
                aria-hidden
                className="block h-12 font-display text-[5.5rem] leading-none text-bronze"
                style={{ fontVariationSettings: "'wght' 500, 'opsz' 16" }}
              >
                <span className="quote-mark">&ldquo;</span>
              </span>
            </Reveal>

            <blockquote>
              <Reveal delay={0.05}>
                <p className="text-[clamp(1.2rem,1.6vw,1.5rem)] font-light leading-[1.6] text-basalt">{about.lead}</p>
              </Reveal>
              <div className="mt-8 space-y-6">
                {about.body.map((paragraph, i) => (
                  <Reveal key={paragraph} delay={0.1 + i * 0.08}>
                    <p className="max-w-[46ch] text-[16px] leading-[1.85] text-basalt/75 md:text-[17px]">{paragraph}</p>
                  </Reveal>
                ))}
              </div>
              <Reveal delay={0.1} className="mt-12">
                <p
                  className="font-display text-[clamp(1.15rem,calc((100vw-3rem)/14.5),1.4rem)] italic sm:text-[clamp(1.6rem,2.4vw,2.25rem)] leading-[1.25] text-basalt"
                  style={{ fontVariationSettings: "'wght' 500, 'opsz' 16" }}
                >
                  {about.closing.map((line) => (
                    <span key={line} className="block text-balance">
                      {line}
                    </span>
                  ))}
                </p>
              </Reveal>
            </blockquote>

            {/* Signature */}
            <div className="mt-14">
              <DimensionLine tone="dark" className="w-full" />
              <Reveal delay={0.15} className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p
                    className="font-display text-[1.9rem] leading-none"
                    style={{ fontVariationSettings: "'wght' 600, 'opsz' 16" }}
                  >
                    {about.name}
                  </p>
                  <p className="mt-3 text-[14px] tracking-[0.04em] text-basalt/65">{about.role}</p>
                </div>
                <SocialLinks tone="dark" className="-mb-2.5" />
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
