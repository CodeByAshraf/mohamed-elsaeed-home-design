/**
 * Facts about the studio that are the same in every language: contact details, links, the
 * live address. All visible copy lives in the dictionaries (src/i18n/dictionaries/ar.ts and en.ts).
 */

/** The live address (set NEXT_PUBLIC_SITE_URL when publishing). Used for the sitemap and share previews. */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  // On Vercel the production domain is known even if the variable above was forgotten.
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "") ||
  "http://localhost:3000"
).replace(/\/$/, "");

export const site = {
  /** Latin wordmark, used in both languages (it is part of the logo lockup). */
  person: "Mohamed Elsaeed",
  tagline: "Design & Architecture",
  whatsapp: {
    /** International format, digits only. NEXT_PUBLIC_WHATSAPP_NUMBER overrides it if set. */
    number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "201066608039",
    display: "+20 106 660 8039",
  },
  social: [
    { platform: "Instagram", href: "https://www.instagram.com/mohamed_elsaeed14" },
    { platform: "Facebook", href: "https://www.facebook.com/Elsaeed.Desgin" },
    { platform: "TikTok", href: "https://www.tiktok.com/@mooelsaeed" },
  ],
  /** Where the studio works, for search engines (structured data). */
  city: "Tanta",
  region: "Gharbia",
  country: "EG",
  /** Tanta city centre, for maps and local search (structured data). */
  geo: { latitude: 30.7865, longitude: 31.0004 },
} as const;

export type SocialPlatform = (typeof site.social)[number]["platform"];

/** Phone link for calls (the same number takes calls and WhatsApp). */
export const telHref = `tel:+${site.whatsapp.number.replace(/\D/g, "")}`;

export function whatsappHref(message: string) {
  const number = site.whatsapp.number.replace(/\D/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
