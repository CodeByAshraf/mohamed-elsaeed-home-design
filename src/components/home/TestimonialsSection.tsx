import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { testimonials } from "@/content/testimonials";
import { getDictionary, localePath, type Locale } from "@/i18n";

/** Real client words (src/content/testimonials.ts). Renders nothing until there are some. */
export function TestimonialsSection({ lang }: { lang: Locale }) {
  const items = testimonials[lang];
  if (items.length === 0) return null;
  const { testimonials: t } = getDictionary(lang);
  return (
    <section aria-labelledby="testimonials-title" className="bg-basalt-deep">
      <div className="mx-auto max-w-[1600px] px-6 py-28 sm:px-10 md:py-40 lg:px-16">
        <Reveal className="flex items-center gap-4">
          <span aria-hidden className="h-px w-10 bg-travertine/35" />
          <h2 id="testimonials-title" className="eyebrow text-[12px] font-medium uppercase tracking-[0.24em] text-limestone">
            {t.eyebrow}
          </h2>
        </Reveal>
        <ul className="mt-14 grid grid-cols-1 gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <li key={item.name + i}>
              <Reveal delay={0.06 * (i % 3)}>
                <figure className="border-t border-travertine/15 pt-8">
                  <blockquote className="font-display text-[clamp(1.3rem,1.8vw,1.6rem)] leading-[1.45] text-travertine">“{item.quote}”</blockquote>
                  <figcaption className="mt-6 text-[14px] text-limestone">
                    <span className="text-travertine">{item.name}</span>
                    {" · "}
                    {item.slug ? (
                      <Link href={localePath(lang, `/work/${item.slug}`)} className="underline decoration-bronze underline-offset-4">
                        {item.project}
                      </Link>
                    ) : (
                      item.project
                    )}
                  </figcaption>
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
