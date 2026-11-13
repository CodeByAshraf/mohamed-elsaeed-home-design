import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactSection } from "@/components/home/ContactSection";
import { DimensionLine, Enter, MaskLines, Reveal } from "@/components/motion/Reveal";
import { ArrowSwap } from "@/components/motion/Interactions";
import { ProjectCover } from "@/components/work/ProjectCover";
import { ProjectGallery } from "@/components/work/ProjectGallery";
import { ProjectPalette } from "@/components/work/ProjectPalette";
import { galleryImages, getProject, getProjects, projectSlugs } from "@/lib/projects";
import { fill, getDictionary, localePath, type Locale } from "@/i18n";
import { JsonLd, businessId, personId } from "@/components/seo/StructuredData";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { getServices } from "@/lib/services";
import { siteUrl } from "@/lib/site";

export type ProjectParams = { params: Promise<{ slug: string }> };

export function projectStaticParams() {
  return projectSlugs.map((slug) => ({ slug }));
}

export function projectMetadata(slug: string, lang: Locale): Metadata {
  const project = getProject(slug, lang);
  if (!project) return {};
  return pageMetadata({
    lang,
    path: `/work/${slug}`,
    title: project.seoTitle,
    description: project.seoDescription,
    // JPEG: the most reliable format for link previews (made by the image script, 1200 wide)
    image: { url: `${project.cover.src}-og.jpg`, alt: project.cover.alt },
  });
}

export function ProjectPage({ slug, lang }: { slug: string; lang: Locale }) {
  const project = getProject(slug, lang);
  if (!project) notFound();
  const dict = getDictionary(lang);
  const projects = getProjects(lang);

  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects.length > 1 ? projects[(index + 1) % projects.length] : null;
  const words = project.title.split(" ");
  const titleLines = words.length > 2 ? [words.slice(0, -1).join(" "), words[words.length - 1]] : [project.title];
  const photoCount = galleryImages(project).length;
  const fact = (key: string) => project.facts.find((f) => f.key === key)?.value ?? "";
  const pageUrl = `${siteUrl}${localePath(lang, `/work/${project.slug}`)}`;
  /* The project as a piece of work by the studio, and where it sits in the site (breadcrumbs in results). */
  const projectData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${pageUrl}#project`,
    name: project.title,
    headline: project.tagline,
    description: project.summary,
    url: pageUrl,
    inLanguage: lang,
    image: [project.cover, ...galleryImages(project)].map((img) => ({
      "@type": "ImageObject",
      contentUrl: `${siteUrl}${img.src}-${img.widths[img.widths.length - 1]}.webp`,
      caption: img.alt,
    })),
    dateCreated: fact("year"),
    locationCreated: { "@type": "Place", name: fact("location") },
    creator: { "@id": personId },
    publisher: { "@id": businessId },
    keywords: [fact("scope"), fact("location"), ...getDictionary(lang).meta.keywords.slice(0, 3)].join(", "),
  };


  return (
    <main id="main" className="bg-basalt">
      <header className="mx-auto max-w-[1600px] px-6 pb-16 pt-32 sm:px-10 md:pb-24 md:pt-44 lg:px-16">
        <Enter>
          <Breadcrumbs
            lang={lang}
            label={getServices(lang).ui.breadcrumb}
            items={[
              { name: getServices(lang).ui.home, path: "/" },
              { name: getServices(lang).ui.work, path: "/work" },
              { name: project.title, path: `/work/${project.slug}` },
            ]}
          />
        </Enter>

        <div className="mt-12 grid grid-cols-12 gap-x-6 md:mt-16 lg:gap-x-10">
          <div className="@container col-span-12 lg:col-span-8">
            <Enter delay={0.05}>
              <p className="eyebrow text-[12px] font-medium uppercase tracking-[0.24em] text-bronze">
                {fill(dict.work.project, { n: String(index + 1).padStart(2, "0") })}
              </p>
            </Enter>
            <h1
              className="title-fit mt-6 font-display leading-[1.0] tracking-[-0.02em] text-travertine"
              style={
                {
                  fontVariationSettings: "'wght' 600, 'opsz' 16",
                  "--title-chars": Math.max(...titleLines.map((l) => l.length)),
                } as CSSProperties
              }
            >
              <MaskLines lines={titleLines} delay={0.1} onLoad />
            </h1>
            <Enter delay={0.35}>
              <p
                className="mt-8 max-w-[26ch] font-display text-[clamp(1.35rem,2.2vw,2rem)] italic leading-[1.3] text-travertine/85"
                style={{ fontVariationSettings: "'opsz' 16" }}
              >
                {project.tagline}
              </p>
            </Enter>
          </div>
          <Enter delay={0.45} className="col-span-12 mt-10 lg:col-span-4 lg:mt-0 lg:self-end">
            <p className="max-w-[44ch] text-[16px] font-light leading-[1.8] text-limestone md:text-[17px]">{project.summary}</p>
          </Enter>
        </div>

        <Enter delay={0.5} className="mt-16 md:mt-20">
          <dl className="grid grid-cols-2 border-t border-travertine/15 md:grid-cols-5">
            {project.facts.map((f, i) => (
              <div
                key={f.key}
                className={`border-b border-travertine/15 py-5 md:border-b-0 md:py-7 ${i % 2 === 1 ? "border-s ps-5" : "pe-4"} ${i > 0 ? "md:border-s md:ps-6" : "md:ps-0"} ${i === project.facts.length - 1 && project.facts.length % 2 === 1 ? "col-span-2 border-s-0 ps-0 md:col-span-1 md:border-s md:ps-6" : ""}`}
              >
                <dt className="eyebrow text-[11px] uppercase tracking-[0.2em] text-smoke">{dict.work.facts[f.key]}</dt>
                <dd className="mt-2 text-[16px] text-travertine md:text-[17px]">{f.value}</dd>
              </div>
            ))}
          </dl>
        </Enter>
      </header>

      <div className="mx-auto max-w-[1600px] sm:px-10 lg:px-16">
        <ProjectCover image={project.cover} />
      </div>

      <div className="mx-auto max-w-[1600px] px-6 pt-24 sm:px-10 md:pt-36 lg:px-16">
        <ProjectPalette palette={project.palette} />
      </div>

      <section aria-labelledby="gallery-title" className="mx-auto max-w-[1600px] px-6 pb-28 pt-20 sm:px-10 md:pb-40 md:pt-28 lg:px-16">
        <div className="mb-14 flex items-end justify-between gap-6 md:mb-24">
          <Reveal className="flex items-center gap-4">
            <span aria-hidden className="h-px w-10 bg-travertine/35" />
            <h2 id="gallery-title" className="eyebrow text-[12px] font-medium uppercase tracking-[0.24em] text-limestone">
              {dict.work.spaces}
            </h2>
          </Reveal>
          <Reveal>
            <p className="text-[13px] tracking-[0.12em] text-smoke">{fill(dict.work.photographs, { n: photoCount })}</p>
          </Reveal>
        </div>
        <ProjectGallery project={project} />
      </section>

      {next ? (
        <section className="mx-auto max-w-[1600px] px-6 pb-28 sm:px-10 lg:px-16">
          <DimensionLine className="w-full" />
          <Link href={localePath(lang, `/work/${next.slug}`)} data-cursor="view" className="group mt-10 flex items-end justify-between gap-6">
            <span>
              <span className="eyebrow block text-[12px] uppercase tracking-[0.24em] text-smoke">{dict.work.nextProject}</span>
              <span className="mt-4 block font-display text-[clamp(2rem,5vw,4.5rem)] leading-none text-travertine" style={{ fontVariationSettings: "'wght' 600, 'opsz' 16" }}>
                {next.title}
              </span>
            </span>
            <ArrowSwap size={32} strokeWidth={1} />
          </Link>
        </section>
      ) : null}

      <ContactSection lang={lang} />
      <JsonLd data={projectData} />
    </main>
  );
}
