import { services as servicesAr } from "@/content/services.ar";
import { services as servicesEn } from "@/content/services.en";
import type { ServiceSlug, ServicesContent } from "@/content/services.types";
import type { Locale } from "@/i18n/config";

const content: Record<Locale, ServicesContent> = { ar: servicesAr, en: servicesEn };

export const serviceSlugs = servicesEn.items.map((s) => s.slug);

export function getServices(lang: Locale) {
  return content[lang];
}

export function getService(slug: string, lang: Locale) {
  return content[lang].items.find((s) => s.slug === slug);
}

export function servicePath(slug: ServiceSlug | string) {
  return `/services/${slug}`;
}
