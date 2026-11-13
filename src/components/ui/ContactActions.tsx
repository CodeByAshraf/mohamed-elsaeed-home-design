"use client";

import { Phone, MessageCircle } from "lucide-react";
import { ConsultationButton } from "@/components/consultation/ConsultationButton";
import { site, telHref, whatsappHref } from "@/lib/site";
import { useLocale } from "@/i18n/LocaleProvider";
import { press } from "@/components/motion/classes";
import { trackLead } from "@/lib/analytics";

/**
 * The three ways to become a client, side by side: the booking form (site visit or quote), a phone
 * call and WhatsApp. Used at the top and bottom of every service, work and area page.
 */
export function ContactActions({ label, className = "" }: { label: string; className?: string }) {
  const { dict } = useLocale();
  const t = dict.contactActions;
  const link = `group inline-flex h-14 items-center justify-center gap-3 rounded-full border border-travertine/30 px-7 text-[15px] tracking-[0.03em] text-travertine transition-colors duration-300 hover:border-travertine hover:bg-travertine hover:text-basalt ${press}`;
  return (
    <div className={`flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center ${className}`}>
      <ConsultationButton className="w-full sm:w-auto">{label}</ConsultationButton>
      <a
        href={telHref}
        onClick={() => trackLead("call")}
        className={link}
      >
        <Phone size={17} strokeWidth={1.5} aria-hidden />
        <span>{t.call}</span>
        <span dir="ltr" className="hidden text-limestone transition-colors group-hover:text-basalt/70 lg:inline">
          {site.whatsapp.display}
        </span>
      </a>
      <a
        href={whatsappHref(dict.whatsappMessage)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackLead("whatsapp")}
        aria-label={dict.common.whatsappAria}
        className={link}
      >
        <MessageCircle size={17} strokeWidth={1.5} aria-hidden />
        <span>{t.whatsapp}</span>
      </a>
    </div>
  );
}
