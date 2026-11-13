import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/projects";
import { siteUrl } from "@/lib/site";
import { defaultLocale, localePath } from "@/i18n/config";
import { serviceSlugs, servicePath } from "@/lib/services";

/** /sitemap.xml: every page in English (the main language), each linked to its Arabic twin. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const entry = (path: string) => ({
    lastModified,
    url: `${siteUrl}${localePath(defaultLocale, path)}`,
    alternates: {
      languages: { ar: `${siteUrl}${localePath("ar", path)}`, en: `${siteUrl}${localePath("en", path)}` },
    },
  });
  return [
    { ...entry("/"), changeFrequency: "monthly", priority: 1 },
    { ...entry("/services"), changeFrequency: "monthly", priority: 0.9 },
    ...serviceSlugs.map((slug) => ({ ...entry(servicePath(slug)), changeFrequency: "monthly" as const, priority: 0.9 })),
    { ...entry("/work"), changeFrequency: "monthly", priority: 0.8 },
    { ...entry("/areas"), changeFrequency: "yearly", priority: 0.7 },
    ...getProjects(defaultLocale).map((p) => ({
      ...entry(`/work/${p.slug}`),
      changeFrequency: "yearly" as const,
      priority: 0.8,
      images: [`${siteUrl}${p.cover.src}-1600.webp`],
    })),
  ];
}
