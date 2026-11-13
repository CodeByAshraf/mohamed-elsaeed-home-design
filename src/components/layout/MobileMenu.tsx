"use client";

import Link from "next/link";
import { forwardRef } from "react";
import { m, type Variants } from "framer-motion";
import { ConsultationButton } from "@/components/consultation/ConsultationButton";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { site, telHref, whatsappHref as waHref } from "@/lib/site";
import { trackLead } from "@/lib/analytics";
import { useLocale } from "@/i18n/LocaleProvider";
import { localePath } from "@/i18n/config";
import { ArrowSwap } from "@/components/motion/Interactions";

const ease = [0.22, 1, 0.36, 1] as const;
const panelEase = [0.76, 0, 0.24, 1] as const;

/* Same partition motif as the hero: three panels drop in to form the menu, and lift away to close it. */
const panel: Variants = {
  closed: (i: number) => ({ scaleY: 0, transition: { duration: 0.55, delay: (2 - i) * 0.06, ease: panelEase } }),
  open: (i: number) => ({ scaleY: 1, transition: { duration: 0.7, delay: i * 0.07, ease: panelEase } }),
};

const row: Variants = {
  closed: { y: "105%", opacity: 0, transition: { duration: 0.25, ease } },
  open: (i: number) => ({ y: "0%", opacity: 1, transition: { duration: 0.9, delay: 0.55 + i * 0.07, ease } }),
};

const fade: Variants = {
  closed: { opacity: 0, y: 12, transition: { duration: 0.2 } },
  open: (delay: number) => ({ opacity: 1, y: 0, transition: { duration: 0.8, delay, ease } }),
};

type MobileMenuProps = { onClose: () => void };

export const MobileMenu = forwardRef<HTMLDivElement, MobileMenuProps>(function MobileMenu({ onClose }, ref) {
  const { lang, dict } = useLocale();
  const whatsappHref = waHref(dict.whatsappMessage);

  return (
    <m.div
      ref={ref}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label={dict.common.menu}
      className="fixed inset-0 lg:hidden"
      initial="closed"
      animate="open"
      exit="closed"
    >
      {/* Background: partitions with hairline joints, and a faint warm light from the top corner */}
      <div aria-hidden className="absolute inset-0 flex">
        {[0, 1, 2].map((i) => (
          <m.div
            key={i}
            custom={i}
            variants={panel}
            className="h-full flex-1 origin-top border-e border-travertine/[0.07] bg-basalt-deep last:border-e-0"
          />
        ))}
      </div>
      <m.div
        aria-hidden
        variants={fade}
        custom={0.3}
        className="absolute inset-0"
        style={{ background: "radial-gradient(90% 55% at var(--light-x, 100%) 0%, rgb(176 141 91 / 0.12) 0%, transparent 70%)" }}
      />

      <div className="relative flex h-full flex-col overflow-y-auto overscroll-contain px-6 pb-[max(1.75rem,env(safe-area-inset-bottom))] pt-[calc(6rem+env(safe-area-inset-top))] [@media(max-height:700px)]:pt-[calc(5.25rem+env(safe-area-inset-top))] sm:px-10">
        <m.nav aria-label={dict.common.menu} variants={fade} custom={0.45}>
          <ul className="border-t border-travertine/10">
            {dict.nav.map((item, i) => (
              <li key={item.path} className="overflow-hidden border-b border-travertine/10">
                <m.div custom={i} variants={row}>
                  <Link
                    href={localePath(lang, item.path)}
                    onClick={onClose}
                    className="group flex items-center justify-between gap-6 py-[clamp(0.75rem,1.95vh,1.35rem)]"
                  >
                    <span className="flex flex-col gap-1.5">
                      <span
                        className="font-display text-[clamp(1.75rem,min(8.5vw,5.4vh),2.5rem)] leading-none text-travertine transition-transform duration-500 ease-architect group-hover:translate-x-1.5 group-active:translate-x-1.5 rtl:group-hover:-translate-x-1.5 rtl:group-active:-translate-x-1.5"
                        style={{ fontVariationSettings: "'wght' 500, 'opsz' 16" }}
                      >
                        {item.label}
                      </span>
                      <span className="text-[13px] tracking-[0.02em] text-limestone [@media(max-height:700px)]:hidden">{item.note}</span>
                    </span>
                    <span
                      aria-hidden
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-travertine/15 text-travertine/70 transition-[color,background-color,border-color,transform] duration-300 group-hover:border-travertine group-hover:bg-travertine group-hover:text-basalt group-active:scale-90 group-active:border-travertine group-active:bg-travertine group-active:text-basalt"
                    >
                      <ArrowSwap direction="up-right" size={18} strokeWidth={1.25} />
                    </span>
                  </Link>
                </m.div>
              </li>
            ))}
          </ul>
        </m.nav>

        <m.div variants={fade} custom={0.85} className="mt-auto pt-10 [@media(max-height:700px)]:pt-5">
          <p className="text-[12px] tracking-[0.1em] text-smoke [@media(max-height:700px)]:hidden">{dict.common.getInTouch}</p>
          <a
            href={whatsappHref}
            onClick={() => trackLead("whatsapp")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex min-h-11 transition-transform duration-150 active:scale-[0.97] [@media(max-height:700px)]:mt-0 items-center gap-3 text-[17px] tracking-[0.02em] text-travertine"
          >
            <span className="h-2 w-2 rounded-full bg-[#25D366]" aria-hidden />
            {dict.contact.whatsapp} <span dir="ltr">{site.whatsapp.display}</span>
          </a>
          <a
            href={telHref}
            onClick={() => trackLead("call")}
            className="mt-1 flex min-h-11 items-center gap-3 text-[17px] tracking-[0.02em] text-travertine transition-transform duration-150 active:scale-[0.97]"
          >
            <span className="h-2 w-2 rounded-full bg-bronze" aria-hidden />
            {dict.contactActions.call}
          </a>
          <div className="mt-4 flex items-center justify-between gap-4 border-t border-travertine/10 pt-2">
            <SocialLinks />
          </div>
        </m.div>

        <m.div variants={fade} custom={0.95} className="pt-7 [@media(max-height:700px)]:pt-4">
          <ConsultationButton className="w-full" onBeforeOpen={onClose}>
            {dict.common.consultationLabel}
          </ConsultationButton>
        </m.div>
      </div>
    </m.div>
  );
});
