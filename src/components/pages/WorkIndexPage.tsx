import type { Metadata } from "next";
import { ContactSection } from "@/components/home/ContactSection";
import { ProjectCard } from "@/components/work/ProjectCard";
import { PageHeader } from "@/components/sections/PageHeader";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/seo/StructuredData";
import { getProjects } from "@/lib/projects";
import { getServices } from "@/lib/services";
import { pageMetadata } from "@/lib/seo";
import { siteUrl } from "@/lib/site";
import { localePath, type Locale } from "@/i18n";

export function workIndexMetadata(lang: Locale): Metadata {
  const { work } = getServices(lang);
  const cover = getProjects(lang)[0].cover;
  return pageMetadata({
    lang,
    path: "/work",
    title: work.seoTitle,
    description: work.seoDescription,
    image: { url: `${cover.src}-og.jpg`, alt: cover.alt },
  });
}

/** The portfolio as its own page: every project as a card, with an ItemList for search engines. */
export function WorkIndexPage({ lang }: { lang: Locale }) {
  const { ui, work } = getServices(lang);
  const projects = getProjects(lang);
  const list = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: work.h1,
    itemListElement: projects.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${siteUrl}${localePath(lang, `/work/${p.slug}`)}`,
      name: p.title,
    })),
  };

  return (
    <main id="main" className="bg-basalt">
      <PageHeader
        lang={lang}
        crumbs={[
          { name: ui.home, path: "/" },
          { name: ui.work, path: "/work" },
        ]}
        crumbLabel={ui.breadcrumb}
        eyebrow={work.eyebrow}
        title={work.h1}
        intro={work.intro}
        actionLabel={ui.requestVisit}
      />
      <section className="mx-auto max-w-[1600px] px-6 pb-28 sm:px-10 md:pb-36 lg:px-16">
        <div className="grid grid-cols-1 gap-x-10 gap-y-16 md:grid-cols-2">
          {projects.map((p, i) => (
            <ProjectCard key={p.slug} project={p} lang={lang} delay={0.08 * (i % 2)} headingLevel="h2" />
          ))}
        </div>
      </section>
      <CtaBand title={ui.ctaTitle} body={ui.ctaBody} actionLabel={ui.requestVisit} />
      <ContactSection lang={lang} />
      <JsonLd data={list} />
    </main>
  );
}
