import type { Metadata } from "next";
import Link from "next/link";
import { ContactSection } from "@/components/home/ContactSection";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowSwap } from "@/components/motion/Interactions";
import { PageHeader } from "@/components/sections/PageHeader";
import { CtaBand } from "@/components/sections/CtaBand";
import { getServices, servicePath } from "@/lib/services";
import { pageMetadata } from "@/lib/seo";
import { localePath, type Locale } from "@/i18n";

export function areasMetadata(lang: Locale): Metadata {
  const { areas } = getServices(lang);
  return pageMetadata({ lang, path: "/areas", title: areas.seoTitle, description: areas.seoDescription });
}

const weight = { fontVariationSettings: "'wght' 600, 'opsz' 16" };

/** Where the company works: one honest page for all areas (no near-duplicate city pages). */
export function AreasPage({ lang }: { lang: Locale }) {
  const { ui, areas, items } = getServices(lang);
  return (
    <main id="main" className="bg-basalt">
      <PageHeader
        lang={lang}
        crumbs={[
          { name: ui.home, path: "/" },
          { name: ui.areas, path: "/areas" },
        ]}
        crumbLabel={ui.breadcrumb}
        eyebrow={areas.eyebrow}
        title={areas.h1}
        intro={areas.intro}
        actionLabel={ui.requestVisit}
      />

      <section className="mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-16">
        <ol className="grid grid-cols-1 border-t border-travertine/15 md:grid-cols-3">
          {areas.regions.map((region, i) => (
            <li key={region.title} className={`border-b border-travertine/15 py-10 md:py-14 md:pe-10 ${i > 0 ? "md:border-s md:ps-10" : ""}`}>
              <Reveal delay={0.08 * i}>
                <span className="font-display text-[2.6rem] leading-none tabular-nums text-bronze" style={{ fontVariationSettings: "'wght' 500, 'opsz' 16" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="mt-5 font-display text-[clamp(1.7rem,2.6vw,2.4rem)] leading-tight text-travertine" style={weight}>
                  {region.title}
                </h2>
                <p className="mt-4 max-w-[42ch] text-[16px] font-light leading-[1.85] text-limestone">{region.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto grid max-w-[1600px] grid-cols-12 gap-x-6 gap-y-14 px-6 pb-28 pt-24 sm:px-10 md:pb-36 md:pt-32 lg:gap-x-10 lg:px-16">
        <Reveal className="col-span-12 lg:col-span-5">
          <h2 className="font-display text-[clamp(1.8rem,3vw,2.8rem)] leading-[1.1] text-travertine" style={weight}>
            {areas.howTitle}
          </h2>
          <p className="mt-6 text-[16px] font-light leading-[1.85] text-limestone md:text-[17px]">{areas.howBody}</p>
        </Reveal>
        <nav aria-label={ui.services} className="col-span-12 lg:col-span-6 lg:col-start-7">
          <ul className="border-t border-travertine/15">
            {items.map((s) => (
              <li key={s.slug} className="border-b border-travertine/15">
                <Link href={localePath(lang, servicePath(s.slug))} className="group flex items-center justify-between gap-6 py-6">
                  <span className="font-display text-[1.5rem] text-travertine" style={weight}>
                    {s.name}
                  </span>
                  <ArrowSwap size={18} />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      <CtaBand title={ui.ctaTitle} body={ui.ctaBody} actionLabel={ui.requestVisit} />
      <ContactSection lang={lang} />
    </main>
  );
}
