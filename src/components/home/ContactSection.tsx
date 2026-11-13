import { DimensionLine, MaskLines, Reveal } from "@/components/motion/Reveal";
import { ConsultationButton } from "@/components/consultation/ConsultationButton";
import { SocialLinks } from "@/components/layout/SocialLinks";
import Link from "next/link";
import { site, telHref, whatsappHref as waHref } from "@/lib/site";
import { getServices, servicePath } from "@/lib/services";
import { fill, getDictionary, localePath, type Locale } from "@/i18n";
import { underline } from "@/components/motion/classes";

/**
 * Closing chord of the page: a monumental line, a short invitation, one clear action,
 * and the direct ways to reach the studio underneath.
 */
export function ContactSection({ lang }: { lang: Locale }) {
  const dict = getDictionary(lang);
  const { contact } = dict;
  const { whatsapp } = site;
  const whatsappHref = waHref(dict.whatsappMessage);
  const { ui, items: serviceItems } = getServices(lang);
  const footerLinks = [
    ...serviceItems.map((s) => ({ name: s.name, path: servicePath(s.slug) })),
    { name: ui.work, path: "/work" },
    { name: ui.areas, path: "/areas" },
  ];
  const year = new Date().getFullYear();

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative scroll-mt-20 overflow-hidden bg-basalt-deep">
      {/* A single soft pool of warm light, as if from a window above */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(60% 50% at var(--light-x-soft, 85%) 0%, rgb(176 141 91 / 0.10) 0%, transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-[1600px] px-6 pb-[calc(7rem+env(safe-area-inset-bottom))] pt-28 sm:px-10 md:pb-32 md:pt-44 lg:px-16">
        <Reveal className="flex items-center gap-4">
          <span aria-hidden className="h-px w-10 bg-travertine/40" />
          <p className="eyebrow text-[12px] font-medium uppercase tracking-[0.24em] text-limestone">{contact.eyebrow}</p>
        </Reveal>

        <h2
          id="contact-title"
          aria-label={contact.headline.join(" ")}
          className="contact-title mt-8 font-display text-[clamp(2rem,calc((100vw-3rem)/7.3),8.25rem)] sm:text-[clamp(2rem,calc((100vw-5rem)/7.3),8.25rem)] lg:text-[clamp(2rem,calc((100vw-8rem)/7.3),8.25rem)] uppercase leading-[0.98] tracking-[-0.01em] text-travertine md:mt-10"
          style={{ fontVariationSettings: "'wght' 620, 'opsz' 16" }}
        >
          <span aria-hidden>
            <MaskLines lines={contact.headline} delay={0.1} />
          </span>
        </h2>

        <DimensionLine className="mt-12 w-full max-w-[34rem] md:mt-16" />

        <div className="mt-12 grid grid-cols-12 gap-x-6 gap-y-14 md:mt-16 lg:gap-x-10">
          <div className="col-span-12 space-y-6 lg:col-span-5">
            {contact.body.map((paragraph, i) => (
              <Reveal key={paragraph} delay={0.08 * i}>
                <p
                  className={
                    i === 0
                      ? "font-display text-[clamp(1.5rem,2.2vw,2rem)] italic leading-[1.3] text-travertine"
                      : "max-w-[46ch] text-[16px] font-light leading-[1.85] text-limestone md:text-[17px]"
                  }
                  style={i === 0 ? { fontVariationSettings: "'wght' 500, 'opsz' 16" } : undefined}
                >
                  {paragraph}
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2} className="col-span-12 flex items-end lg:col-span-6 lg:col-start-7 lg:justify-end">
            <ConsultationButton variant="statement" className="w-full sm:w-auto">
              {contact.cta}
            </ConsultationButton>
          </Reveal>
        </div>

        {/* Direct lines */}
        <Reveal className="mt-24 md:mt-36">
          <div className="grid grid-cols-1 gap-10 border-t border-travertine/10 pt-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-10">
            <div className="lg:col-span-4">
              <p className="eyebrow text-[12px] uppercase tracking-[0.2em] text-smoke">{contact.whatsapp}</p>
              <a
                href={telHref}
                className="mt-3 me-6 inline-flex min-h-11 items-center gap-2 text-[15px] text-limestone transition-colors hover:text-travertine"
              >
                {dict.contactActions.call}
              </a>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={fill(dict.common.whatsappLinkAria, { number: whatsapp.display })}
                className="group mt-3 inline-flex min-h-11 items-center text-[18px] tracking-[0.02em] text-travertine"
              >
                <span className="relative" dir="ltr">
                  {whatsapp.display}
                  <span
                    aria-hidden
                    className={`absolute -bottom-1 start-0 h-px w-full bg-bronze ${underline}`}
                  />
                </span>
              </a>
            </div>
            <div className="lg:col-span-4">
              <p className="eyebrow text-[12px] uppercase tracking-[0.2em] text-smoke">{contact.follow}</p>
              <SocialLinks className="mt-3" />
            </div>
            <div className="sm:col-span-2 lg:col-span-4">
              <p className="eyebrow text-[12px] uppercase tracking-[0.2em] text-smoke lg:text-end">{contact.area}</p>
              <p className="mt-3 flex min-h-11 flex-wrap items-center gap-x-4 text-[13px] text-smoke lg:justify-end">
                <span className="text-[15px] text-travertine">{contact.areaValue}</span>
                <span>
                  &copy; {year} {dict.meta.siteName}
                </span>
              </p>
            </div>
            {/* Every service and page, linked from every page: helps visitors and search engines alike */}
            <nav aria-label={ui.services} className="sm:col-span-2 lg:col-span-12">
              <ul className="flex flex-wrap gap-x-7 gap-y-2 border-t border-travertine/10 pt-8">
                {footerLinks.map((l) => (
                  <li key={l.path}>
                    <Link href={localePath(lang, l.path)} className="inline-flex min-h-11 items-center text-[14px] text-limestone transition-colors hover:text-travertine">
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <p className="text-[13px] leading-relaxed text-smoke sm:col-span-2 lg:col-span-12">{contact.footerLine}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
