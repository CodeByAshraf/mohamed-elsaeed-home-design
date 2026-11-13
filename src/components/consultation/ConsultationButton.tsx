"use client";

import { useConsultation } from "@/components/consultation/ConsultationProvider";
import { ArrowSwap, Magnetic, RollText } from "@/components/motion/Interactions";
import { press } from "@/components/motion/classes";

type Variant = "primary" | "outline" | "statement";

/**
 * Every button that opens the booking form. Motion: magnetic lean, word roll, fill rise, press.
 * The rising fill is also transparent at rest, so contrast checkers do not mistake it for the
 * background behind the label.
 */
export function ConsultationButton({
  children,
  variant = "primary",
  className = "",
  onBeforeOpen,
}: {
  children: string;
  variant?: Variant;
  /** Applied to the outer (magnetic) wrapper: use it for width and layout, e.g. "w-full sm:w-auto". */
  className?: string;
  onBeforeOpen?: () => void;
}) {
  const { open, preload } = useConsultation();
  /** Start downloading the booking form as soon as the visitor shows intent. */
  const intent = { onPointerEnter: preload, onFocus: preload, onTouchStart: preload };
  const handle = () => {
    onBeforeOpen?.();
    open();
  };

  if (variant === "outline") {
    return (
      <Magnetic reach={6} className={className}>
        <button
          type="button"
          onClick={handle}
          {...intent}
          aria-haspopup="dialog"
          className={`group relative inline-flex h-11 w-full items-center justify-center overflow-hidden rounded-full border border-travertine/45 px-6 text-[14px] tracking-[0.05em] text-travertine duration-500 ease-architect hover:border-travertine hover:text-basalt ${press}`}
        >
          <span
            aria-hidden
            className="absolute inset-0 origin-bottom scale-y-0 opacity-0 rounded-full bg-travertine transition-[transform,opacity] duration-500 ease-architect group-hover:scale-y-100 group-hover:opacity-100"
          />
          <RollText className="relative">{children}</RollText>
        </button>
      </Magnetic>
    );
  }

  if (variant === "statement") {
    return (
      <Magnetic reach={10} className={className}>
        <button
          type="button"
          onClick={handle}
          {...intent}
          aria-haspopup="dialog"
          className={`group relative inline-flex h-16 w-full items-center justify-center gap-4 overflow-hidden rounded-full bg-travertine px-10 text-[13px] font-semibold uppercase tracking-[0.18em] text-basalt duration-500 ease-architect hover:text-travertine md:h-[4.5rem] md:px-12 md:text-[14px] ${press}`}
        >
          <span
            aria-hidden
            className="absolute inset-0 origin-bottom scale-y-0 opacity-0 bg-basalt transition-[transform,opacity] duration-500 ease-architect group-hover:scale-y-100 group-hover:opacity-100"
          />
          <RollText className="relative">{children}</RollText>
          <ArrowSwap className="relative" />
        </button>
      </Magnetic>
    );
  }

  return (
    <Magnetic reach={8} className={className}>
      <button
        type="button"
        onClick={handle}
        {...intent}
        aria-haspopup="dialog"
        className={`group relative inline-flex h-14 w-full items-center justify-center overflow-hidden rounded-full bg-travertine px-10 text-[15px] font-semibold tracking-[0.04em] text-basalt duration-500 ease-architect hover:text-travertine ${press}`}
      >
        <span
          aria-hidden
          className="absolute inset-0 origin-bottom scale-y-0 opacity-0 bg-basalt-deep transition-[transform,opacity] duration-500 ease-architect group-hover:scale-y-100 group-hover:opacity-100"
        />
        <RollText className="relative">{children}</RollText>
      </button>
    </Magnetic>
  );
}
