import { Enter } from "@/components/motion/Reveal";
import { Breadcrumbs, type Crumb } from "@/components/seo/Breadcrumbs";
import { ContactActions } from "@/components/ui/ContactActions";
import type { Locale } from "@/i18n";

/** Top of an inner page: breadcrumbs, eyebrow, the page's single <h1>, an introduction and the contact actions. */
export function PageHeader({
  lang,
  crumbs,
  crumbLabel,
  eyebrow,
  title,
  intro,
  actionLabel,
}: {
  lang: Locale;
  crumbs: Crumb[];
  crumbLabel: string;
  eyebrow: string;
  title: string;
  intro: string;
  actionLabel: string;
}) {
  return (
    <header className="mx-auto max-w-[1600px] px-6 pb-16 pt-32 sm:px-10 md:pb-20 md:pt-44 lg:px-16">
      <Enter>
        <Breadcrumbs lang={lang} items={crumbs} label={crumbLabel} />
      </Enter>
      <div className="mt-12 grid grid-cols-12 gap-x-6 md:mt-16 lg:gap-x-10">
        <div className="col-span-12 lg:col-span-8">
          <Enter delay={0.05}>
            <p className="eyebrow text-[12px] font-medium uppercase tracking-[0.24em] text-bronze">{eyebrow}</p>
          </Enter>
          {/* lcp-safe: the heading rises from 1% opacity, not 0, so browsers count it as the page's
              largest paint from the first frame (an element first painted invisible is never counted). */}
          <Enter delay={0.1} className="lcp-safe">
            <h1
              className="mt-6 font-display text-[clamp(2.5rem,6vw,5.75rem)] leading-[1.02] tracking-[-0.02em] text-travertine"
              style={{ fontVariationSettings: "'wght' 600, 'opsz' 16" }}
            >
              {title}
            </h1>
          </Enter>
        </div>
        <Enter delay={0.2} className="col-span-12 mt-8 lg:col-span-4 lg:mt-0 lg:self-end">
          <p className="max-w-[46ch] text-[16px] font-light leading-[1.85] text-limestone md:text-[17px]">{intro}</p>
        </Enter>
      </div>
      <Enter delay={0.3} className="mt-12">
        <ContactActions label={actionLabel} />
      </Enter>
    </header>
  );
}
