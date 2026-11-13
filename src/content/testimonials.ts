import type { Locale } from "@/i18n/config";

/**
 * Client testimonials. Add only real words from real clients, with their permission. The homepage
 * section stays hidden while a language's list is empty. Example:
 *   { name: "أحمد م.", project: "شقة 130 م² – أبراج الرياض", quote: "…" }
 * `project` may link to the project page with `slug` (e.g. "tanta-riyadh").
 */
export type Testimonial = { name: string; project: string; quote: string; slug?: string };

export const testimonials: Record<Locale, Testimonial[]> = {
  ar: [],
  en: [],
};
