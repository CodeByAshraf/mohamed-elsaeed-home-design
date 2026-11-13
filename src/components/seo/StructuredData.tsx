import { site, siteUrl } from "@/lib/site";
import { getProjects } from "@/lib/projects";
import { getServices, servicePath } from "@/lib/services";
import { getDictionary, localePath, type Locale } from "@/i18n";

/** JSON-LD, with "</" escaped so the text can never close the <script> early. */
export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export const businessId = `${siteUrl}/#studio`;
export const personId = `${siteUrl}/#mohamed-elsaeed`;

/**
 * Who the studio is, where it works and how to reach it (schema.org), on every page. This is what lets
 * search engines connect the site with searches like "مهندس تشطيبات طنطا" or "finishing engineer Tanta":
 * a local business in Tanta, Gharbia, with its services, its engineer, its work and its contact details.
 */
export function StructuredData({ lang, homeUrl }: { lang: Locale; homeUrl: string }) {
  const dict = getDictionary(lang);
  const covers = getProjects(lang).map((p) => `${siteUrl}${p.cover.src}-1600.webp`);
  const place = {
    "@type": "PostalAddress",
    addressLocality: site.city,
    addressRegion: site.region,
    addressCountry: site.country,
  };

  const business = {
    "@context": "https://schema.org",
    "@type": ["GeneralContractor", "ProfessionalService"],
    "@id": businessId,
    name: dict.meta.siteName,
    alternateName: [lang === "ar" ? "Mohamed Elsaeed – Home Design" : "محمد السعيد – للتصميم الداخلي", "Mohamed Elsaeed", "محمد السعيد"],
    description: dict.meta.description,
    slogan: dict.hero.headline.join(" "),
    url: homeUrl,
    logo: `${siteUrl}/icon.svg`,
    image: [`${siteUrl}/opengraph-image.png`, ...covers],
    telephone: `+${site.whatsapp.number}`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: `+${site.whatsapp.number}`,
      contactType: "customer service",
      availableLanguage: ["Arabic", "English"],
    },
    address: place,
    geo: { "@type": "GeoCoordinates", latitude: site.geo.latitude, longitude: site.geo.longitude },
    // Where the company works (confirmed by the owner): Tanta, Gharbia and the Greater Cairo governorates.
    areaServed: [
      { "@type": "City", name: lang === "ar" ? "طنطا" : "Tanta" },
      { "@type": "AdministrativeArea", name: lang === "ar" ? "محافظة الغربية" : "Gharbia Governorate" },
      { "@type": "AdministrativeArea", name: lang === "ar" ? "محافظة القاهرة" : "Cairo Governorate" },
      { "@type": "AdministrativeArea", name: lang === "ar" ? "محافظة الجيزة" : "Giza Governorate" },
      { "@type": "AdministrativeArea", name: lang === "ar" ? "محافظة القليوبية" : "Qalyubia Governorate" },
    ],
    founder: { "@id": personId },
    employee: { "@id": personId },
    sameAs: site.social.map((s) => s.href),
    knowsLanguage: ["ar", "en"],
    knowsAbout: getServices(lang).items.map((s) => s.name),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: dict.services.eyebrow,
      itemListElement: getServices(lang).items.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          "@id": `${siteUrl}${localePath(lang, servicePath(s.slug))}#service`,
          name: s.h1,
          description: s.seoDescription,
        },
      })),
    },
  };

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": personId,
    name: dict.about.name,
    alternateName: lang === "ar" ? "Mohamed Elsaeed" : "محمد السعيد",
    jobTitle: dict.about.role,
    image: `${siteUrl}/images/portrait/mohamed-elsaeed-1080.webp`,
    worksFor: { "@id": businessId },
    address: place,
    sameAs: site.social.map((s) => s.href),
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: `${siteUrl}${localePath(lang, "/")}`,
    name: dict.meta.siteName,
    inLanguage: lang,
    publisher: { "@id": businessId },
  };

  return (
    <>
      <JsonLd data={business} />
      <JsonLd data={person} />
      <JsonLd data={website} />
    </>
  );
}
