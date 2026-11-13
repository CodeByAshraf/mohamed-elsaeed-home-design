import { Plus } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/seo/StructuredData";

type Item = { q: string; a: string };

/** Questions as native <details> (open without JavaScript), with matching FAQPage data. */
export function FaqList({ items, lang }: { items: Item[]; lang: string }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: lang,
    mainEntity: items.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })),
  };
  return (
    <div className="border-t border-travertine/15">
      {items.map((item, i) => (
        <Reveal key={item.q} delay={0.04 * i}>
          <details className="faq-item group border-b border-travertine/15">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-[17px] text-travertine transition-colors hover:text-white md:py-7 md:text-[19px] [&::-webkit-details-marker]:hidden">
              <span>{item.q}</span>
              <span aria-hidden className="faq-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-travertine/20 text-bronze">
                <Plus size={16} strokeWidth={1.5} />
              </span>
            </summary>
            <div className="faq-answer">
              <p className="max-w-[60ch] pb-7 text-[16px] font-light leading-[1.85] text-limestone md:text-[17px]">{item.a}</p>
            </div>
          </details>
        </Reveal>
      ))}
      <JsonLd data={data} />
    </div>
  );
}
