import Link from "next/link";
import { RollText } from "@/components/motion/Interactions";
import { press, underline } from "@/components/motion/classes";

type CtaLinkProps = {
  href: string;
  children: string;
  className?: string;
};

/** Quiet text action (e.g. "Explore Our Work"): word roll, a resting hairline, and a bronze line that draws across. */
export function CtaLink({ href, children, className = "" }: CtaLinkProps) {
  return (
    <Link
      href={href}
      className={`group relative inline-flex h-14 items-center text-[15px] font-normal tracking-[0.04em] text-travertine duration-300 ${press} ${className}`}
    >
      <span className="relative">
        <RollText>{children}</RollText>
        <span aria-hidden className="absolute -bottom-1 start-0 h-px w-full bg-travertine/40" />
        <span aria-hidden className={`absolute -bottom-1 start-0 h-px w-full bg-bronze ${underline}`} />
      </span>
    </Link>
  );
}
