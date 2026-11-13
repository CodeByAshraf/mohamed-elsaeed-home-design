import type { Metadata } from "next";
import Link from "next/link";
import { ContactSection } from "@/components/home/ContactSection";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowSwap } from "@/components/motion/Interactions";
import { ProjectImage } from "@/components/work/ProjectImage";
import { PageHeader } from "@/components/sections/PageHeader";
import { CtaBand } from "@/components/sections/CtaBand";
import { getProjectImage } from "@/lib/projects";
import { getServices, servicePath } from "@/lib/services";
import { pageMetadata } from "@/lib/seo";
import { getDictionary, localePath, type Locale } from "@/i18n";

export function servicesIndexMetadata(lang: Locale): Metadata {
  const { hub } = getServices(lang);
  return pageMetadata({ lang, path: "/services", title: hub.seoTitle, description: hub.seoDescription });
}

const weight = { fontVariationSettings: "'wght' 600, 'opsz' 16" };

/** All services: a card for each (with a real photo), the five-step process, and where the company works. */
export function ServicesIndexPage({ lang }: { lang: Locale }) {
  const { ui, hub, items } = getServices(lang);
  const { services: home } = getDictionary(lang);

  return (
    <main id="main" className="bg-basalt">
      <PageHeader
        lang={lang}
        crumbs={[
          { name: ui.home, path: "/" },
          { name: ui.services, path: "/services" },
        ]}
        crumbLabel={ui.breadcrumb}
        eyebrow={hub.eyebrow}
        title={hub.h1}
        intro={hub.intro}
        actionLabel={ui.requestVisit}
      />

      <section className="mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-16">
        <ul className="grid grid-cols-1 gap-x-10 gap-y-16 md:grid-cols-2">
          {items.map((service, i) => {
            const image = getProjectImage(service.cover.project, service.cover.id, lang);
            return (
              <li key={service.slug}>
                <Reveal delay={0.08 * (i % 2)} y={32}>
                  <Link href={localePath(lang, servicePath(service.slug))} data-cursor="view" className="group block">
                    <div className="cover-frame relative aspect-[16/10] overflow-hidden bg-basalt-deep">
                      {image ? <ProjectImage image={image} fill sizes="(min-width: 768px) 45vw, 100vw" className="cover-photo object-cover" /> : null}
                      <span aria-hidden className="cover-grade pointer-events-none absolute inset-0" />
                    </div>
                    <div className="mt-6 flex items-start justify-between gap-6">
                      <div>
                        <span className="font-display text-[15px] tabular-nums text-bronze">{String(i + 1).padStart(2, "0")}</span>
                        <h2 className="mt-2 font-display text-[clamp(1.8rem,2.8vw,2.6rem)] leading-[1.1] text-travertine" style={weight}>
                          {service.name}
                        </h2>
                        <p className="mt-3 max-w-[44ch] text-[16px] font-light leading-[1.75] text-limestone">{service.summary}</p>
                      </div>
                      <span className="mt-8 text-travertine">
                        <ArrowSwap size={22} strokeWidth={1.25} />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="process-title" className="mx-auto max-w-[1600px] px-6 pt-28 sm:px-10 md:pt-40 lg:px-16">
        <Reveal>
          <h2 id="process-title" className="font-display text-[clamp(1.9rem,3.4vw,3.2rem)] leading-[1.08] text-travertine" style={weight}>
            {hub.processTitle}
          </h2>
        </Reveal>
        <ol className="mt-12 grid grid-cols-1 gap-y-10 border-t border-travertine/15 pt-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-x-10">
          {home.steps.map((step, i) => (
            <li key={step.title}>
              <Reveal delay={0.06 * i}>
                <span className="font-display text-[2.4rem] leading-none tabular-nums text-bronze/90" style={{ fontVariationSettings: "'wght' 500, 'opsz' 16" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-[18px] text-travertine">{step.title}</h3>
                <p className="mt-2 max-w-[34ch] text-[15px] font-light leading-[1.75] text-limestone">{step.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="areas-title" className="mx-auto max-w-[1600px] px-6 pb-28 pt-24 sm:px-10 md:pb-36 md:pt-32 lg:px-16">
        <Reveal className="flex flex-col gap-6 border-y border-travertine/15 py-10 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 id="areas-title" className="font-display text-[clamp(1.6rem,2.4vw,2.2rem)] text-travertine" style={weight}>
              {hub.areasTitle}
            </h2>
            <p className="mt-3 text-[16px] font-light text-limestone">{hub.areasBody}</p>
          </div>
          <Link href={localePath(lang, "/areas")} className="group inline-flex items-center gap-3 text-[14px] uppercase tracking-[0.16em] text-travertine eyebrow">
            {ui.areas}
            <ArrowSwap size={16} />
          </Link>
        </Reveal>
      </section>

      <CtaBand title={ui.ctaTitle} body={ui.ctaBody} actionLabel={ui.requestVisit} />
      <ContactSection lang={lang} />
    </main>
  );
}
