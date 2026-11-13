"use client";

import { useRef, type CSSProperties } from "react";
import { m, useScroll, useTransform } from "framer-motion";
import { ProjectImage } from "@/components/work/ProjectImage";
import heroImages from "@/data/site/hero.images.json";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { CtaLink } from "@/components/ui/CtaLink";
import { ConsultationButton } from "@/components/consultation/ConsultationButton";
import { ScrollIndicator } from "@/components/home/ScrollIndicator";
import { StatCounter } from "@/components/home/StatCounter";
import { HeroHeadline } from "@/components/home/HeroHeadline";
import { useHeroLamp } from "@/components/home/useHeroLamp";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { useLocale } from "@/i18n/LocaleProvider";
import { localePath } from "@/i18n/config";

/**
 * Timeline (seconds): partitions open → headline rises → line draws → details settle.
 * All entrance motion is CSS (see "Entrance" in globals.css), so it starts on first paint
 * instead of waiting for JavaScript. Framer only drives the scroll-linked depth below.
 */
const t = { panels: 0, badge: 0.35, headline: 0.45, line: 0.9, body: 1.0, ctas: 1.1, stats: 1.2, scroll: 1.7 };

/** Inline style carrying an entrance delay (and optional travel) for the CSS animations. */
const at = (delay: number, y?: number) =>
  ({ "--enter-delay": `${delay}s`, ...(y !== undefined ? { "--enter-y": `${y}px` } : {}) }) as CSSProperties;

export function Hero() {
  const { lang, dict } = useLocale();
  const { hero } = dict;
  const workHref = localePath(lang, "/#work");
  const reduce = usePrefersReducedMotion();

  /* Scroll depth: content lifts and fades while the photograph drifts more slowly behind it */
  const sectionRef = useRef<HTMLElement>(null);
  const imageBoxRef = useRef<HTMLDivElement>(null);
  const lampFocus = useHeroLamp(sectionRef, imageBoxRef, reduce);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -140]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, reduce ? 1 : 0]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "14%"]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-svh flex-col overflow-hidden bg-basalt-deep"
    >
      {/* Fallback light study, visible only if the photograph is slow or unavailable */}
      <div
        aria-hidden
        className="absolute inset-0 -z-30"
        style={{
          background:
            "radial-gradient(90% 70% at 50% 30%, #6a6256 0%, #3a3831 40%, #1d1f1c 75%, #141613 100%)",
        }}
      />

      <m.div className="absolute inset-0 -z-30" style={{ y: imageY }}>
        <div ref={imageBoxRef} className="enter-settle absolute inset-0" style={at(t.panels)}>
          <ProjectImage
            image={{ ...heroImages["living-room"], alt: hero.imageAlt }}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Where the lamp falls, the room comes into focus (mouse devices only, loaded after the page) */}
          {lampFocus && (
            <div aria-hidden className="hero-lamp-focus absolute inset-0 overflow-hidden">
              <div className="hero-lamp-window">
                <div className="hero-lamp-room">
                  <ProjectImage
                    image={{ ...heroImages["living-room-sharp"], alt: "" }}
                    fill
                    loading="eager"
                    sizes="100vw"
                    className="object-cover object-center"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </m.div>

      {/* Overlay: even tint, soft vignette, grounded base, and a band for the navbar */}
      <div aria-hidden className="absolute inset-0 -z-20">
        <div className="absolute inset-0 bg-basalt-deep/35" />
        {/* Soft scrim behind the headline only, so busy parts of a photo never compete with it */}
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(42% 30% at 50% 40%, rgb(20 22 19 / 0.4) 0%, transparent 100%)" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(75% 65% at 50% 48%, transparent 0%, rgb(20 22 19 / 0.35) 55%, rgb(20 22 19 / 0.85) 100%)" }}
        />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-basalt to-transparent" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-basalt-deep/70 to-transparent" />
      </div>

      {/* Warm light: follows the pointer on mouse devices, drifts slowly on touch screens */}
      <div aria-hidden className="hero-lamp-glow pointer-events-none absolute inset-0">
        <div className="hero-lamp-dot" />
      </div>
      <div aria-hidden className="hero-ambient pointer-events-none absolute inset-0" />

      {/* Opening partitions: three panels lift away to reveal the room */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 flex">
        {[0.12, 0, 0.24].map((d, i) => (
          <div
            key={i}
            className="enter-panel h-full flex-1 origin-top border-e border-travertine/10 bg-basalt-deep last:border-e-0"
            style={at(t.panels + d)}
          />
        ))}
      </div>

      <m.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="mx-auto flex w-full max-w-[1100px] flex-1 flex-col items-center justify-center px-6 pb-[clamp(5.5rem,12vh,7rem)] pt-[clamp(6.5rem,14vh,8rem)] text-center sm:px-10">
        {/* The page's main heading says what and where (it is what search engines read first);
            the large slogan below is a display line. */}
        <h1
          id="hero-title"
          style={at(t.badge, 10)}
          className="eyebrow enter-rise inline-flex min-h-9 items-center rounded-full border border-travertine/25 bg-basalt-deep/30 px-5 py-1.5 text-center text-[13px] font-normal leading-snug tracking-[0.06em] text-travertine/90 backdrop-blur-sm"
        >
          {hero.badge}
        </h1>

        <HeroHeadline
          as="p"
          lines={hero.headline}
          delay={t.headline}
          className="hero-title mt-[clamp(1.25rem,3.2vh,2.25rem)] font-display text-[clamp(1.9rem,calc((100vw-3rem)/8.4),3.6rem)] leading-[1.02] tracking-[-0.02em] text-travertine sm:text-[clamp(3.6rem,min(8.4vw,11vh),7rem)]"
        />

        {/* Dimension line, drawn outward from the centre */}
        <div
          aria-hidden
          className="enter-draw relative mt-[clamp(1.25rem,3.2vh,2.25rem)] h-3 w-40 md:w-72"
          style={at(t.line)}
        >
          <span className="absolute inset-x-0 top-1/2 h-px bg-travertine/45" />
          <span className="absolute left-0 top-0 h-3 w-px rotate-45 bg-travertine/80" />
          <span className="absolute right-0 top-0 h-3 w-px rotate-45 bg-travertine/80" />
        </div>

        <p
          style={at(t.body)}
          className="enter-rise mt-[clamp(1.25rem,3.2vh,2.25rem)] max-w-[52ch] text-[16px] font-light leading-[1.75] text-travertine/80 md:text-[18px]"
        >
          {hero.body}
        </p>

        <div
          style={at(t.ctas)}
          className="enter-rise mt-[clamp(1.5rem,3.8vh,2.5rem)] flex w-full flex-col items-center gap-2 sm:w-auto sm:flex-row sm:gap-10"
        >
          <ConsultationButton className="w-full sm:w-auto">{hero.primaryCta}</ConsultationButton>
          <CtaLink href={workHref}>{hero.secondaryCta}</CtaLink>
        </div>

        <dl
          style={at(t.stats)}
          className="enter-rise mt-[clamp(2rem,5vh,3.5rem)] grid w-full max-w-[640px] grid-cols-3 divide-x divide-travertine/15"
        >
          {hero.stats.map((stat, i) => (
            <div key={stat.label} className="flex flex-col items-center gap-2 px-2">
              <dt className="text-[12px] leading-snug tracking-[0.04em] text-limestone sm:text-[13px]">{stat.label}</dt>
              <dd
                className="order-first font-display text-[2rem] leading-none text-travertine sm:text-[2.75rem]"
                style={{ fontVariationSettings: "'wght' 520, 'opsz' 16" }}
              >
                <StatCounter value={stat.value} suffix={stat.suffix} delay={t.stats + 0.2 + i * 0.12} />
              </dd>
            </div>
          ))}
        </dl>
      </m.div>

      {/* Social rail along the left edge (desktop) */}
      <div
        className="enter-fade absolute start-6 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-6 lg:flex xl:start-10"
        style={at(t.scroll)}
      >
        <span aria-hidden className="h-16 w-px bg-travertine/25" />
        <SocialLinks variant="rail" />
        <span aria-hidden className="h-16 w-px bg-travertine/25" />
      </div>

      <div
        className="enter-fade absolute inset-x-0 bottom-6 flex justify-center md:bottom-8 [@media(max-height:820px)]:bottom-4"
        style={at(t.scroll)}
      >
        <ScrollIndicator href={workHref} label={hero.scrollLabel} />
      </div>
    </section>
  );
}
