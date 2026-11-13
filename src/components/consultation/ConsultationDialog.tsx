"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, m } from "framer-motion";
import { X } from "lucide-react";
import { ConsultationForm } from "@/components/consultation/ConsultationForm";
import { focusableWithin, trapTab } from "@/lib/focus";
import { useLocale } from "@/i18n/LocaleProvider";

const ease = [0.22, 1, 0.36, 1] as const;

export function ConsultationDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const { lang, dict } = useLocale();
  /** The panel slides in from the reading end: the right in English, the left in Arabic. */
  const offscreen = lang === "ar" ? "-100%" : "100%";

  useEffect(() => {
    if (!open) return;
    const returnFocusTo = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusFirst = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>("input:not([tabindex='-1'])")?.focus();
    }, 350);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (panelRef.current) trapTab(e, focusableWithin(panelRef.current));
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.clearTimeout(focusFirst);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      returnFocusTo?.focus({ preventScroll: true });
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70]">
          <m.div
            aria-hidden
            className="absolute inset-0 bg-basalt-deep/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={onClose}
          />
          <m.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="consultation-title"
            aria-describedby="consultation-intro"
            className="absolute inset-y-0 end-0 flex w-full max-w-[600px] flex-col overflow-y-auto overscroll-contain border-s border-travertine/10 bg-basalt"
            initial={{ x: offscreen }}
            animate={{ x: 0 }}
            exit={{ x: offscreen }}
            transition={{ duration: 0.7, ease }}
          >
            <div className="flex items-start justify-between gap-6 px-6 pb-2 pt-8 sm:px-12 sm:pt-12">
              <div>
                <h2 id="consultation-title" className="font-display text-[2rem] leading-tight text-travertine sm:text-[2.5rem]">
                  {dict.form.title}
                </h2>
                <p id="consultation-intro" className="mt-3 max-w-[42ch] font-light leading-[1.7] text-limestone">
                  {dict.form.intro}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={dict.common.close}
                className="group -me-2 -mt-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-travertine/80 transition-[color,transform] duration-300 hover:text-travertine active:scale-90"
              >
                <X size={22} strokeWidth={1.25} className="transition-transform duration-500 ease-architect group-hover:rotate-90" />
              </button>
            </div>
            <ConsultationForm onDone={onClose} />
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
}
