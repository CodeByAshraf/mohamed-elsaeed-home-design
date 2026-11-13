"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Wordmark } from "@/components/brand/Monogram";
import { ConsultationButton } from "@/components/consultation/ConsultationButton";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { underline } from "@/components/motion/classes";
import { focusableWithin, trapTab } from "@/lib/focus";
import { useLocale } from "@/i18n/LocaleProvider";
import { fill, localePath, switchLocalePath } from "@/i18n/config";
import { Phone } from "lucide-react";
import { site, telHref } from "@/lib/site";
import { trackLead } from "@/lib/analytics";

const ease = [0.22, 1, 0.36, 1] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { lang, dict } = useLocale();
  const pathname = usePathname();
  const otherLang = lang === "ar" ? "en" : "ar";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const button = menuButtonRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.dataset.menu = "open";

    const focusFirst = window.setTimeout(() => {
      menuRef.current?.querySelector<HTMLElement>("a[href]")?.focus({ preventScroll: true });
    }, 450);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (!menuRef.current || !button) return;
      // Keep focus inside the open menu, including the close button in the bar above it.
      trapTab(e, [button, ...focusableWithin(menuRef.current)]);
    };
    const closeOnDesktop = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", closeOnDesktop);
    return () => {
      window.clearTimeout(focusFirst);
      document.body.style.overflow = previousOverflow;
      delete document.documentElement.dataset.menu;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", closeOnDesktop);
      button?.focus({ preventScroll: true });
    };
  }, [open]);

  const solid = scrolled && !open;

  return (
    <header
      // Opacity-only entrance (CSS): no transform here, or the fixed mobile menu inside would be
      // positioned against the header instead of the screen.
      style={{ "--enter-delay": "0.6s" } as CSSProperties}
      className={`enter-fade fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-500 ${
        solid ? "border-travertine/10 bg-basalt/85 backdrop-blur-md" : "border-transparent"
      }`}
    >
      <nav
        aria-label={dict.common.primaryNav}
        className={`relative z-10 mx-auto flex max-w-[1600px] items-center justify-between px-6 pt-[env(safe-area-inset-top)] transition-[height] duration-500 sm:px-10 lg:px-16 ${
          solid ? "h-20" : "h-24 md:h-28"
        }`}
      >
        <Link
          href={localePath(lang, "/")}
          onClick={() => setOpen(false)}
          className="group relative"
        >
          <Wordmark />
        </Link>

        <div className="hidden items-center gap-12 lg:flex">
          <ul className="flex items-center gap-10 xl:gap-12">
            {dict.nav.map((item) => (
              <li key={item.path}>
                <Link
                  href={localePath(lang, item.path)}
                  className="group relative py-2 text-[14px] tracking-[0.06em] text-travertine/80 transition-colors duration-300 hover:text-travertine"
                >
                  {item.label}
                  <span
                    aria-hidden
                    className={`absolute bottom-0 start-0 h-px w-full bg-bronze ${underline}`}
                  />
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-6">
            <a
              href={telHref}
              onClick={() => trackLead("call")}
              aria-label={fill(dict.contactActions.callAria, { number: site.whatsapp.display })}
              className="inline-flex h-11 items-center gap-2 text-[14px] tracking-[0.04em] text-travertine/80 transition-colors hover:text-travertine"
            >
              <Phone size={16} strokeWidth={1.5} aria-hidden />
              <span dir="ltr" className="hidden xl:inline">{site.whatsapp.display}</span>
            </a>
            <LanguageSwitch href={switchLocalePath(pathname, otherLang)} lang={otherLang} label={dict.common.languageSwitch} aria={dict.common.languageSwitchAria} />
            <ConsultationButton variant="outline">{dict.common.consultationLabel}</ConsultationButton>
          </div>
        </div>

        <div className="ms-auto me-1 flex items-center lg:hidden">
          {!open && (
            <LanguageSwitch href={switchLocalePath(pathname, otherLang)} lang={otherLang} label={dict.common.languageSwitch} aria={dict.common.languageSwitchAria} />
          )}
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? dict.common.closeMenu : dict.common.openMenu}
          className="relative -me-3 inline-flex h-12 w-12 items-center justify-center rounded-full text-travertine lg:hidden"
        >
          {/* Two-line mark that folds into a cross */}
          <span aria-hidden className="relative block h-[11px] w-7">
            <m.span
              className="absolute left-0 top-0 block h-[1.5px] w-7 bg-current"
              animate={open ? { y: 5, rotate: 45 } : { y: 0, rotate: 0 }}
              transition={{ duration: 0.5, ease }}
            />
            <m.span
              className="absolute bottom-0 right-0 block h-[1.5px] bg-current"
              initial={false}
              animate={open ? { y: -4.5, rotate: -45, width: 28 } : { y: 0, rotate: 0, width: 18 }}
              transition={{ duration: 0.5, ease }}
            />
          </span>
        </button>
      </nav>

      <AnimatePresence>{open && <MobileMenu ref={menuRef} onClose={() => setOpen(false)} />}</AnimatePresence>
    </header>
  );
}

/**
 * The same page in the other language. A plain <a>, not <Link>: each language has its own root
 * layout (its own <html lang dir>), so switching is a full page load anyway.
 */
function LanguageSwitch({ href, lang, label, aria }: { href: string; lang: string; label: string; aria: string }) {
  return (
    <a
      href={href}
      hrefLang={lang}
      lang={lang}
      className="group relative inline-flex h-11 min-w-11 items-center justify-center text-[14px] tracking-[0.06em] text-travertine/80 transition-colors duration-300 hover:text-travertine"
    >
      {/* "عربي" on English pages is drawn in the system's Arabic font, so those pages never download
          the site's Arabic web font for one word. */}
      <span className={lang === "ar" ? "lang-switch-ar text-[15px]" : "font-sans"}>{label}</span>
      {/* The accessible name starts with the visible label, then says what it does */}
      <span className="sr-only"> – {aria}</span>
      <span aria-hidden className={`absolute bottom-2 start-0 h-px w-full bg-bronze ${underline}`} />
    </a>
  );
}
