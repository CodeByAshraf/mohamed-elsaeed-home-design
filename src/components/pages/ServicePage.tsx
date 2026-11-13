import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactSection } from "@/components/home/ContactSection";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowSwap } from "@/components/motion/Interactions";
import { ProjectCover } from "@/components/work/ProjectCover";
import { ProjectCard } from "@/components/work/ProjectCard";
import { PageHeader } from "@/components/sections/PageHeader";
import { CtaBand } from "@/components/sections/CtaBand";
import { FaqList } from "@/components/sections/FaqList";
import { JsonLd, businessId } from "@/components/seo/StructuredData";
import { getProject, getProjectImage } from "@/lib/projects";
import { getService, getServices, servicePath, serviceSlugs } from "@/lib/services";
import { pageMetadata } from "@/lib/seo";
import { site, siteUrl } from "@/lib/site";
import { localePath, type Locale } from "@/i18n";

export type ServiceParams = { params: Promise<{ slug: string }> };

export function serviceStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export function serviceMetadata(slug: string, lang: Locale): Metadata {
  const service = getService(slug, lang);
  if (!service) return {};
  const cover = getProjectImage(service.cover.project, "cover", lang);
  return pageMetadata({
    lang,
    path: servicePath(slug),
    title: service.seoTitle,
    description: service.seoDescription,
    image: cover ? { url: `${cover.src}-og.jpg`, alt: cover.alt } : undefined,
  });
}

const sectionTitle = "font-display text-[clamp(1.9rem,3.4vw,3.2rem)] leading-[1.08] text-travertine";
const weight = { fontVariationSettings: "'wght' 600, 'opsz' 16" };

/** One service (apartments, villas, interior design, commercial): what it is, what it covers, real work, questions. */
export function ServicePage({ slug, lang }: { slug: string; lang: Locale }) {
  const service = getService(slug, lang);
  if (!service) notFound();
  const { ui, items, hub } = getServices(lang);
  const cover = getProjectImage(service.cover.project, service.cover.id, lang);
  const projects = service.projects.map((s) => getProject(s, lang)).filter((p) => p !== undefined);
  const others = items.filter((s) => s.slug !== service.slug);
  const url = `${siteUrl}${localePath(lang, servicePath(service.slug))}`;

  const serviceData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: service.h1,
    serviceType: service.name,
    description: service.seoDescription,
    url,
    inLanguage: lang,
    provider: { "@id": businessId },
    areaServed: lang === "ar" ? ["طنطا", "محافظة الغربية", "القاهرة الكبرى"] : ["Tanta", "Gharbia Governorate", "Greater Cairo"],
    availableChannel: { "@type": "ServiceChannel", servicePhone: { "@type": "ContactPoint", telephone: `+${site.whatsapp.number}` } },
    ...(cover ? { image: `${siteUrl}${cover.src}-${cover.widths[cover.widths.length - 1]}.webp` } : {}),
  };

  return (
    <main id="main" className="bg-basalt">
      <PageHeader
        lang={lang}
        crumbs={[
          { name: ui.home, path: "/" },
          { name: ui.services, path: "/services" },
          { name: service.name, path: servicePath(service.slug) },
        ]}
        crumbLabel={ui.breadcrumb}
        eyebrow={service.eyebrow}
        title={service.h1}
        intro={service.intro}
        actionLabel={ui.requestVisit}
      />

      {cover ? (
        <div className="mx-auto max-w-[1600px] sm:px-10 lg:px-16">
          <ProjectCover image={cover} />
        </div>
      ) : null}

      {service.stages.length > 0 ? (
        <section aria-labelledby="stages-title" className="mx-auto max-w-[1600px] px-6 pt-24 sm:px-10 md:pt-36 lg:px-16">
          <Reveal>
            <h2 id="stages-title" className={sectionTitle} style={weight}>
              {ui.stages}
            </h2>
          </Reveal>
          <ol className="mt-12 grid grid-cols-1 border-t border-travertine/15 md:grid-cols-3">
            {service.stages.map((stage, i) => (
              <li key={stage.title} className={`border-b border-travertine/15 py-10 md:py-12 ${i > 0 ? "md:border-s md:ps-10" : ""} md:pe-10`}>
                <Reveal delay={0.08 * i}>
                  <span className="font-display text-[2.6rem] leading-none tabular-nums text-bronze" style={{ fontVariationSettings: "'wght' 500, 'opsz' 16" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-5 text-[20px] text-travertine">{stage.title}</h3>
                  <p className="mt-3 max-w-[40ch] text-[16px] font-light leading-[1.8] text-limestone">{stage.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      <section className="mx-auto grid max-w-[1600px] grid-cols-12 gap-x-6 gap-y-16 px-6 pt-24 sm:px-10 md:pt-36 lg:gap-x-10 lg:px-16">
        <div className="col-span-12 lg:col-span-6">
          <Reveal>
            <h2 className={sectionTitle} style={weight}>
              {ui.includes}
            </h2>
          </Reveal>
          <ul className="mt-10 grid grid-cols-1 gap-x-8 sm:grid-cols-2">
            {service.includes.map((item, i) => (
              <li key={item} className="border-b border-travertine/10">
                <Reveal delay={0.03 * i} className="flex items-start gap-4 py-4 text-[16px] text-travertine/90">
                  <span aria-hidden className="mt-[0.7em] h-px w-4 shrink-0 bg-bronze" />
                  {item}
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-12 space-y-12 lg:col-span-5 lg:col-start-8">
          {service.sections.map((section) => (
            <Reveal key={section.title}>
              <h2 className="font-display text-[clamp(1.6rem,2.4vw,2.2rem)] leading-[1.15] text-travertine" style={weight}>
                {section.title}
              </h2>
              <p className="mt-5 text-[16px] font-light leading-[1.85] text-limestone md:text-[17px]">{section.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {projects.length > 0 ? (
        <section aria-labelledby="projects-title" className="mx-auto max-w-[1600px] px-6 pt-24 sm:px-10 md:pt-36 lg:px-16">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Reveal>
                <h2 id="projects-title" className={sectionTitle} style={weight}>
                  {ui.projects}
                </h2>
              </Reveal>
              <Reveal delay={0.05}>
                <p className="mt-4 max-w-[52ch] text-[16px] font-light text-limestone">{ui.projectsNote}</p>
              </Reveal>
            </div>
            <Link href={localePath(lang, "/work")} className="group inline-flex items-center gap-3 text-[14px] uppercase tracking-[0.16em] text-travertine eyebrow">
              {ui.allWork}
              <ArrowSwap size={16} />
            </Link>
          </div>
          <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-16 md:grid-cols-2">
            {projects.map((p, i) => (
              <ProjectCard key={p.slug} project={p} lang={lang} delay={0.08 * (i % 2)} />
            ))}
          </div>
        </section>
      ) : null}

      <section aria-labelledby="service-faq" className="mx-auto grid max-w-[1600px] grid-cols-12 gap-x-6 px-6 pb-24 pt-24 sm:px-10 md:pb-36 md:pt-36 lg:gap-x-10 lg:px-16">
        <div className="col-span-12 lg:col-span-4">
          <Reveal>
            <h2 id="service-faq" className={sectionTitle} style={weight}>
              {ui.faq}
            </h2>
          </Reveal>
        </div>
        <div className="col-span-12 mt-10 lg:col-span-7 lg:col-start-6 lg:mt-0">
          <FaqList items={service.faq} lang={lang} />
        </div>
      </section>

      <nav aria-labelledby="other-services" className="mx-auto max-w-[1600px] px-6 pb-24 sm:px-10 md:pb-32 lg:px-16">
        <h2 id="other-services" className="eyebrow text-[12px] font-medium uppercase tracking-[0.24em] text-limestone">
          {ui.otherServices}
        </h2>
        <ul className="mt-8 grid grid-cols-1 border-t border-travertine/15 md:grid-cols-3">
          {others.map((s, i) => (
            <li key={s.slug} className={`border-b border-travertine/15 ${i > 0 ? "md:border-s" : ""}`}>
              <Link href={localePath(lang, servicePath(s.slug))} className="group flex h-full items-start justify-between gap-6 px-1 py-8 md:px-8">
                <span>
                  <span className="block font-display text-[1.6rem] leading-tight text-travertine" style={weight}>
                    {s.name}
                  </span>
                  <span className="mt-2 block text-[14px] text-limestone">{s.summary}</span>
                </span>
                <span className="mt-2 text-travertine">
                  <ArrowSwap size={18} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-[15px] text-limestone">
          {hub.areasBody}{" "}
          <Link href={localePath(lang, "/areas")} className="text-travertine underline decoration-bronze underline-offset-4">
            {ui.areas}
          </Link>
        </p>
      </nav>

      <CtaBand title={ui.ctaTitle} body={ui.ctaBody} actionLabel={ui.requestVisit} />
      <ContactSection lang={lang} />
      <JsonLd data={serviceData} />
    </main>
  );
}
