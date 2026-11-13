import Link from "next/link";
import { DimensionLine } from "@/components/motion/Reveal";
import { ArrowSwap, RollText } from "@/components/motion/Interactions";
import { getDictionary, localePath, type Locale } from "@/i18n";

export function NotFoundView({ lang }: { lang: Locale }) {
  const { notFound: t } = getDictionary(lang);
  return (
    <main id="main" className="flex min-h-svh items-center bg-basalt">
      <div className="mx-auto w-full max-w-[1600px] px-6 py-32 sm:px-10 lg:px-16">
        <p className="eyebrow text-[12px] font-medium uppercase tracking-[0.24em] text-bronze">{t.eyebrow}</p>
        <h1
          className="mt-6 font-display text-[clamp(2.6rem,7vw,6.5rem)] leading-[1.02] tracking-[-0.02em] text-travertine"
          style={{ fontVariationSettings: "'wght' 600, 'opsz' 16" }}
        >
          {t.headline[0]}{" "}
          <br />
          {t.headline[1]}
        </h1>
        <DimensionLine className="mt-10 w-40 md:w-72" />
        <p className="mt-10 max-w-[44ch] text-[16px] font-light leading-[1.8] text-limestone md:text-[17px]">{t.body}</p>
        <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-4">
          <Link
            href={localePath(lang, "/")}
            className="group inline-flex h-14 items-center justify-center gap-3 rounded-full bg-travertine px-9 text-[15px] font-semibold tracking-[0.04em] text-basalt"
          >
            <ArrowSwap direction="left" size={16} />
            <RollText>{t.home}</RollText>
          </Link>
          <Link href={localePath(lang, "/#work")} className="group inline-flex h-14 items-center gap-3 text-[15px] tracking-[0.04em] text-travertine">
            <RollText>{t.work}</RollText>
            <ArrowSwap size={16} />
          </Link>
        </div>
      </div>
    </main>
  );
}
