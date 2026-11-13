import type { Metadata } from "next";
import { getDictionary, localePath, ogLocale, type Locale } from "@/i18n";

/** The share image used when a page has no photo of its own (src/app/opengraph-image.png, 1200 × 630). */
export function defaultShareImage(lang: Locale) {
  return {
    url: "/opengraph-image.png",
    width: 1200,
    height: 630,
    alt: getDictionary(lang).meta.shareAlt,
  };
}

type PageSeo = {
  lang: Locale;
  /** The page's path in the main language, e.g. "/services/apartment-finishing". */
  path: string;
  title: string;
  description: string;
  /** Use the title as it is, without the " | brand" suffix (the homepage). */
  absoluteTitle?: boolean;
  image?: { url: string; alt: string; width?: number; height?: number };
};

/**
 * Metadata for one page: unique title and description, canonical address, its twin in the other
 * language (hreflang), and Open Graph / Twitter previews with an image. Every page uses this, so no
 * page can ship without a share image or a canonical link.
 */
export function pageMetadata({ lang, path, title, description, absoluteTitle, image }: PageSeo): Metadata {
  const url = localePath(lang, path);
  const images = [image ?? defaultShareImage(lang)];
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
      languages: { en: localePath("en", path), ar: localePath("ar", path), "x-default": localePath("en", path) },
    },
    openGraph: {
      type: "website",
      siteName: getDictionary(lang).meta.siteName,
      locale: ogLocale[lang],
      title,
      description,
      url,
      images,
    },
    twitter: { card: "summary_large_image", title, description, images },
  };
}
