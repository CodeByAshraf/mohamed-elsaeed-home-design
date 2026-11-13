"use client";

import { site } from "@/lib/site";
import { underline } from "@/components/motion/classes";
import { useLocale } from "@/i18n/LocaleProvider";
import { fill } from "@/i18n/config";

type SocialLinksProps = {
  /** "rail": vertical, reads bottom-to-top along the hero edge. "row": a horizontal line of links. */
  variant?: "rail" | "row";
  /** "light" text for dark backgrounds (default), "dark" text for light backgrounds. */
  tone?: "light" | "dark";
  className?: string;
};

export function SocialLinks({ variant = "row", tone = "light", className = "" }: SocialLinksProps) {
  const { dict } = useLocale();
  const rail = variant === "rail";
  const color = tone === "dark" ? "text-basalt/70 hover:text-basalt" : "text-limestone hover:text-travertine";
  return (
    <nav aria-label={dict.common.socialNav} className={className}>
      <ul className={rail ? "flex rotate-180 items-center gap-7 [writing-mode:vertical-rl]" : "flex flex-wrap items-center gap-x-7 gap-y-1"}>
        {site.social.map((item) => {
          const platform = dict.social[item.platform];
          return (
            <li key={item.href}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={fill(dict.common.socialLink, { person: dict.about.name, platform })}
                className={`group relative text-[13px] ${rail ? "inline-block py-1" : "inline-flex min-h-11 items-center"} tracking-[0.08em] ${color} transition-colors duration-300`}
              >
                {platform}
                <span
                  aria-hidden
                  className={
                    rail
                      ? "absolute inset-y-0 start-0 w-px origin-top scale-y-0 bg-bronze transition-transform duration-500 ease-architect group-hover:origin-bottom group-hover:scale-y-100 group-focus-visible:scale-y-100"
                      : `absolute bottom-2.5 start-0 h-px w-full bg-bronze ${underline}`
                  }
                />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
