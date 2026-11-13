import { ConsultationButton } from "@/components/consultation/ConsultationButton";
import { DimensionLine, MaskLines, Reveal } from "@/components/motion/Reveal";
import Link from "next/link";
import { ArrowSwap } from "@/components/motion/Interactions";
import { getDictionary, localePath, type Locale } from "@/i18n";

/**
 * What the studio does and how a project runs. Two parts on one dark ground:
 * 1. Services: four disciplines as a spec sheet (number, name, a line of description, what it covers).
 * 2. Process: five steps along a dimension line on desktop, down a hairline on phones.
 */
export function ServicesSection({ lang }: { lang: Locale }) {
  const { services } = getDictionary(lang);
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section id="services" aria-labelledby="services-title" className="relative scroll-mt-20 overflow-hidden bg-basalt-deep">
      {/* Soft warm light from the reading-start corner, mirroring the Contact section */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(55% 45% at var(--light-x-start, 10%) 0%, rgb(176 141 91 / 0.08) 0%, transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-[1600px] px-6 pb-28 pt-28 sm:px-10 md:pb-40 md:pt-40 lg:px-16">
        <div className="grid grid-cols-12 gap-x-6 lg:gap-x-10">
          <div className="col-span-12 lg:col-span-8">
            <Reveal className="flex items-center gap-4">
              <span aria-hidden className="h-px w-10 bg-travertine/35" />
              <p className="eyebrow text-[12px] font-medium uppercase tracking-[0.24em] text-limestone">{services.eyebrow}</p>
            </Reveal>
            <h2
              id="services-title"
              className="mt-8 font-display text-[clamp(2.4rem,6.2vw,6rem)] leading-[1.02] tracking-[-0.02em] text-travertine md:mt-10"
              style={{ fontVariationSettings: "'wght' 600, 'opsz' 16" }}
            >
              <MaskLines lines={services.headline} delay={0.1} />
            </h2>
          </div>
          <Reveal delay={0.2} className="col-span-12 mt-8 lg:col-span-4 lg:mt-0 lg:self-end">
            <p className="max-w-[40ch] text-[16px] font-light leading-[1.75] text-limestone md:text-[17px]">{services.intro}</p>
          </Reveal>
        </div>

        {/* Services: a 2 × 2 spec sheet on desktop, one per row on phones */}
        <ul className="mt-20 grid grid-cols-1 border-t border-travertine/15 md:mt-28 md:grid-cols-2">
          {services.items.map((item, i) => (
            <li
              key={item.title}
              className={`group relative border-b border-travertine/15 py-10 md:py-14 ${i % 2 === 0 ? "md:pe-12 lg:pe-20" : "md:border-s md:ps-12 lg:ps-20"}`}
            >
              {/* A bronze line draws across the top of the service under the pointer */}
              <span aria-hidden className="draw-line absolute -top-px start-0 h-px w-full bg-bronze" />
              <Reveal delay={0.05 * (i % 2)}>
                <div className="flex items-baseline gap-6">
                  <span className="font-display text-[15px] tabular-nums text-bronze" style={{ fontVariationSettings: "'wght' 500, 'opsz' 16" }}>
                    {pad(i + 1)}
                  </span>
                  <h3
                    className="font-display text-[clamp(1.8rem,2.6vw,2.6rem)] leading-[1.1] text-travertine"
                    style={{ fontVariationSettings: "'wght' 600, 'opsz' 16" }}
                  >
                    <Link href={localePath(lang, item.href)} className="outline-none after:absolute after:inset-0 after:content-[''] focus-visible:underline">
                      {item.title}
                    </Link>
                  </h3>
                </div>
                <p className="mt-6 max-w-[48ch] text-[16px] font-light leading-[1.8] text-limestone md:ps-[calc(15px+1.5rem)] md:text-[17px]">
                  {item.body}
                </p>
                <ul className="mt-7 flex flex-wrap gap-2 md:ps-[calc(15px+1.5rem)]">
                  {item.points.map((point) => (
                    <li
                      key={point}
                      className="inline-flex h-9 items-center rounded-full border border-travertine/15 px-4 text-[13px] tracking-[0.02em] text-travertine/80"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
                <span aria-hidden className="eyebrow mt-8 inline-flex items-center gap-3 text-[13px] uppercase tracking-[0.18em] text-travertine/80 md:ms-[calc(15px+1.5rem)]">
                  {services.learnMore}
                  <ArrowSwap size={14} />
                </span>
              </Reveal>
            </li>
          ))}
        </ul>
        <Reveal className="mt-10">
          <Link href={localePath(lang, "/services")} className="group eyebrow inline-flex items-center gap-3 text-[14px] uppercase tracking-[0.18em] text-travertine">
            {services.all}
            <ArrowSwap size={16} />
          </Link>
        </Reveal>

        {/* Process */}
        <div className="mt-28 md:mt-40">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <Reveal className="flex items-center gap-4">
                <span aria-hidden className="h-px w-10 bg-travertine/35" />
                <p className="eyebrow text-[12px] font-medium uppercase tracking-[0.24em] text-limestone">{services.processEyebrow}</p>
              </Reveal>
              <Reveal delay={0.08}>
                <h3
                  className="mt-6 font-display text-[clamp(1.9rem,3.6vw,3.4rem)] leading-[1.1] text-travertine"
                  style={{ fontVariationSettings: "'wght' 600, 'opsz' 16" }}
                >
                  {services.processHeadline}
                </h3>
              </Reveal>
            </div>
            <Reveal delay={0.15} className="hidden md:block">
              <ConsultationButton variant="outline">{services.cta}</ConsultationButton>
            </Reveal>
          </div>

          <DimensionLine className="mt-14 hidden w-full lg:block" />

          <ol className="relative mt-12 grid grid-cols-1 gap-y-10 lg:mt-10 lg:grid-cols-5 lg:gap-x-10">
            {/* Phones and tablets: the steps hang from a hairline along the reading-start edge */}
            <span aria-hidden className="absolute inset-y-2 start-[5px] w-px bg-travertine/15 lg:hidden" />
            {services.steps.map((step, i) => (
              <li key={step.title} className="relative ps-10 lg:ps-0">
                <Reveal delay={0.08 * i}>
                  <span aria-hidden className="absolute start-0 top-[0.55rem] h-[11px] w-[11px] rounded-full border border-bronze bg-basalt-deep lg:hidden" />
                  <span className="font-display text-[clamp(2.4rem,3.4vw,3.25rem)] leading-none tabular-nums text-bronze/90" style={{ fontVariationSettings: "'wght' 500, 'opsz' 16" }}>
                    {pad(i + 1)}
                  </span>
                  <h4 className="mt-5 text-[18px] font-normal tracking-[0.01em] text-travertine">{step.title}</h4>
                  <p className="mt-3 max-w-[34ch] text-[15px] font-light leading-[1.75] text-limestone">{step.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>

          <Reveal className="mt-14 md:hidden">
            <ConsultationButton className="w-full">{services.cta}</ConsultationButton>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
