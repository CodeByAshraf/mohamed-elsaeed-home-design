import { MaskLines, Reveal } from "@/components/motion/Reveal";
import { FaqList } from "@/components/sections/FaqList";
import { getDictionary, type Locale } from "@/i18n";

/**
 * Common questions, answered from what the portfolio shows (areas, timelines, scope). The text is in
 * the page for search engines, which also get the same questions as FAQPage structured data.
 */
export function FaqSection({ lang }: { lang: Locale }) {
  const { faq } = getDictionary(lang);
  return (
    <section id="faq" aria-labelledby="faq-title" className="relative scroll-mt-20 bg-basalt">
      <div className="mx-auto grid max-w-[1600px] grid-cols-12 gap-x-6 px-6 pb-28 pt-28 sm:px-10 md:pb-40 md:pt-40 lg:gap-x-10 lg:px-16">
        <div className="col-span-12 lg:col-span-4">
          <Reveal className="flex items-center gap-4">
            <span aria-hidden className="h-px w-10 bg-travertine/35" />
            <p className="eyebrow text-[12px] font-medium uppercase tracking-[0.24em] text-limestone">{faq.eyebrow}</p>
          </Reveal>
          <h2
            id="faq-title"
            className="mt-8 font-display text-[clamp(2.2rem,4.4vw,4.4rem)] leading-[1.05] tracking-[-0.02em] text-travertine md:mt-10"
            style={{ fontVariationSettings: "'wght' 600, 'opsz' 16" }}
          >
            <MaskLines lines={[faq.headline]} delay={0.1} />
          </h2>
        </div>
        <div className="col-span-12 mt-14 lg:col-span-7 lg:col-start-6 lg:mt-2">
          <FaqList items={faq.items} lang={lang} />
        </div>
      </div>
    </section>
  );
}
