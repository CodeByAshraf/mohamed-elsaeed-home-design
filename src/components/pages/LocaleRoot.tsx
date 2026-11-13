import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { preload } from "react-dom";
import "@/app/globals.css";
import { bodoni, bodoniItalic, jost } from "@/app/fonts";
import { siteUrl } from "@/lib/site";
import { revealScript } from "@/components/motion/revealScript";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { ScrollRuler } from "@/components/layout/ScrollRuler";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { StructuredData } from "@/components/seo/StructuredData";
import { Analytics } from "@/components/seo/Analytics";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { dirOf, getDictionary, localePath, ogLocale, type Locale } from "@/i18n";

/** Site-wide metadata for one language; pages add their own title, description and address. */
export function rootMetadata(lang: Locale): Metadata {
  const dict = getDictionary(lang);
  return {
    /** The live address, used to build full links for share previews (WhatsApp, Facebook…). Set NEXT_PUBLIC_SITE_URL when publishing. */
    metadataBase: new URL(siteUrl),
    title: { default: dict.meta.title, template: `%s | ${dict.meta.brand}` },
    description: dict.meta.description,
    keywords: dict.meta.keywords,
    applicationName: dict.meta.siteName,
    authors: [{ name: dict.about.name }],
    creator: dict.about.name,
    category: "Interior design and finishing",
    // Google Search Console: set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION to the code it gives you.
    verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
      : undefined,
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
    openGraph: {
      type: "website",
      siteName: dict.meta.siteName,
      locale: ogLocale[lang],
      alternateLocale: ogLocale[lang === "ar" ? "en" : "ar"],
    },
    twitter: { card: "summary_large_image" },
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  themeColor: "#1d1f1c",
};

/** Arabic fonts the first screen needs: fetched straight away instead of after the CSS is read. */
const arabicFonts = ["/fonts/amiri-arabic-700.woff2", "/fonts/alexandria-arabic-wght.woff2"];

/** The <html> document for one language. Used by the root layouts in src/app/(en) and src/app/(ar). */
export function LocaleRoot({ lang, children }: { lang: Locale; children: ReactNode }) {
  const dict = getDictionary(lang);
  if (lang === "ar") {
    for (const href of arabicFonts) preload(href, { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  }

  return (
    <html lang={lang} dir={dirOf(lang)} className={`${bodoni.variable} ${bodoniItalic.variable} ${jost.variable}`} suppressHydrationWarning>
      {/* This component is the root layout of each language (src/app/(ar), src/app/(en)); the rule
          only expects <head> in files under app/. */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        {/* Runs before first paint; see components/motion/revealScript.ts */}
        <script dangerouslySetInnerHTML={{ __html: revealScript }} />
      </head>
      <body className="bg-basalt text-travertine">
        <LocaleProvider lang={lang} dict={dict}>
          <Providers>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[80] focus:bg-travertine focus:px-4 focus:py-2 focus:text-basalt"
            >
              {dict.common.skipToContent}
            </a>
            <Navbar />
            {children}
            <ScrollRuler />
            <WhatsAppButton />
            <CustomCursor />
          </Providers>
        </LocaleProvider>
        <StructuredData lang={lang} homeUrl={`${siteUrl}${localePath(lang, "/")}`} />
        <Analytics />
      </body>
    </html>
  );
}
