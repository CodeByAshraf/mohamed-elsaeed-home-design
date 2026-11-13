"use client";

import { useState } from "react";
import { AnimatePresence, m, useScroll, useSpring } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useConsultation } from "@/components/consultation/ConsultationProvider";
import { whatsappHref } from "@/lib/site";
import { trackLead } from "@/lib/analytics";
import { useLocale } from "@/i18n/LocaleProvider";
import { Magnetic } from "@/components/motion/Interactions";

/**
 * Floating WhatsApp contact. It stays fixed while the page scrolls, and its
 * outer ring fills with the reader's progress down the page.
 */
export function WhatsAppButton() {
  const { isOpen } = useConsultation();
  const { dict } = useLocale();
  /** Arrive after the homepage intro, not during it (it is playing if <html> has the `intro` class). */
  const [delay] = useState(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("intro") ? 2.2 + 2.75 : 2.2,
  );
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  const href = whatsappHref(dict.whatsappMessage);

  return (
    <AnimatePresence>
      {!isOpen && (
        <m.a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={dict.common.whatsappAria}
          onClick={() => trackLead("whatsapp")}
          className="group fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] end-5 z-40 flex items-center transition-[visibility] sm:bottom-8 sm:end-8 in-data-[menu=open]:invisible"
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.25, delay: 0 } }}
          transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="pointer-events-none me-3 hidden translate-x-2 rtl:-translate-x-2 whitespace-nowrap rounded-[2px] bg-basalt-deep/90 px-4 py-2.5 text-[13px] tracking-[0.03em] text-travertine opacity-0 backdrop-blur transition-all duration-500 group-hover:translate-x-0 rtl:group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 rtl:group-focus-visible:translate-x-0 group-focus-visible:opacity-100 md:block">
            {dict.common.whatsappTooltip}
          </span>
          <span className="relative flex h-16 w-16 items-center justify-center">
            <svg viewBox="0 0 64 64" className="absolute inset-0 -rotate-90" aria-hidden>
              <circle cx="32" cy="32" r="30.5" fill="none" stroke="rgb(236 230 219 / 0.18)" strokeWidth="1" />
              <m.circle
                cx="32"
                cy="32"
                r="30.5"
                fill="none"
                stroke="#ece6db"
                strokeWidth="1.25"
                strokeLinecap="round"
                style={{ pathLength: progress }}
              />
            </svg>
            <Magnetic reach={7}>
              <span className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-10px_rgba(37,211,102,0.6)] transition-transform duration-500 ease-architect group-hover:scale-105 group-active:scale-95 group-active:duration-150">
                <MessageCircle
                  size={24}
                  strokeWidth={1.75}
                  className="transition-transform duration-500 ease-architect group-hover:-rotate-12"
                />
              </span>
            </Magnetic>
          </span>
        </m.a>
      )}
    </AnimatePresence>
  );
}
