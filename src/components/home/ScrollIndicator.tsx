import Link from "next/link";

export function ScrollIndicator({ href, label, className = "" }: { href: string; label: string; className?: string }) {
  return (
    <Link
      href={href}
      className={`group flex flex-col items-center gap-3 text-[12px] tracking-[0.1em] text-limestone transition-[color,transform] duration-300 active:scale-95 hover:text-travertine ${className}`}
    >
      <span className="transition-transform duration-500 ease-architect group-hover:-translate-y-1">{label}</span>
      <span aria-hidden className="relative block h-10 w-px overflow-hidden bg-travertine/20 transition-colors duration-500 group-hover:bg-travertine/40 md:h-12 [@media(max-height:820px)]:h-7">
        <span className="scroll-travel absolute inset-x-0 top-0 block h-1/3 bg-travertine" />
      </span>
    </Link>
  );
}
