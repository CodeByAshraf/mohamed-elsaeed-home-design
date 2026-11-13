"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, LazyMotion, m, type PanInfo } from "framer-motion";
import { X } from "lucide-react";
import { ProjectImage } from "@/components/work/ProjectImage";
import { ArrowSwap } from "@/components/motion/Interactions";
import type { ProjectImage as ProjectImageData } from "@/lib/projects";
import { focusableWithin, trapTab } from "@/lib/focus";
import { useLocale } from "@/i18n/LocaleProvider";
import { fill } from "@/i18n/config";

const ease = [0.22, 1, 0.36, 1] as const;
/** Swiping between photos needs Framer's drag feature, which the rest of the site does without. */
const loadDragFeatures = () => import("@/components/motion/features-drag").then((mod) => mod.default);

type Props = {
  images: ProjectImageData[];
  index: number;
  title: string;
  onClose: () => void;
  onIndexChange: (i: number) => void;
};

/**
 * `sizes` for the open photo. The viewer is the screen width less its px-4 / sm:px-24 padding, and the
 * photo is also held under max-h-[calc(100svh-11rem)], so a tall photo is narrower than the screen.
 * vh (never smaller than svh) and the rounded-up proportions keep the estimate from falling short.
 * A browser that cannot read min() in `sizes` skips those entries and uses the plain widths after them.
 */
function lightboxSizes({ width, height }: ProjectImageData) {
  const byHeight = `calc((100vh - 11rem) * ${Math.ceil((width / height) * 1000) / 1000})`;
  return [
    `(min-width: 40rem) min(calc(100vw - 12rem), ${byHeight})`,
    `min(calc(100vw - 2rem), ${byHeight})`,
    "(min-width: 40rem) calc(100vw - 12rem)",
    "calc(100vw - 2rem)",
  ].join(", ");
}

/**
 * Full-screen photo viewer. Arrow keys, swipe and the side buttons move between photos
 * (wrapping around); Escape or the close button return focus to the photo that opened it.
 * In Arabic (right to left) "next" is to the left: the arrow keys, swipe and slide all follow.
 */
export function Lightbox({ images, index, title, onClose, onIndexChange }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const { lang, dict } = useLocale();
  /** +1 when the next photo lies to the right (English), -1 when it lies to the left (Arabic). */
  const ahead = lang === "ar" ? -1 : 1;
  const [direction, setDirection] = useState(0);
  const count = images.length;
  const image = images[index];

  const go = useCallback(
    (step: number) => {
      setDirection(step);
      onIndexChange((index + step + count) % count);
    },
    [index, count, onIndexChange],
  );

  useEffect(() => {
    const returnFocusTo = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.dataset.menu = "open"; // hides the floating WhatsApp button
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = previousOverflow;
      delete document.documentElement.dataset.menu;
      returnFocusTo?.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(ahead);
      else if (e.key === "ArrowLeft") go(-ahead);
      else if (dialogRef.current) trapTab(e, focusableWithin(dialogRef.current));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose, ahead]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    // Dragging the photo toward the reading start brings the next one in.
    if (info.offset.x < -60 || info.velocity.x < -400) go(ahead);
    else if (info.offset.x > 60 || info.velocity.x > 400) go(-ahead);
  };

  const navButton =
    "group inline-flex h-14 w-14 items-center justify-center rounded-full border border-travertine/25 text-travertine transition-[color,background-color,border-color,transform] duration-300 hover:border-travertine hover:bg-travertine hover:text-basalt active:scale-90";

  return (
    <LazyMotion features={loadDragFeatures}>
    <m.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={fill(dict.work.lightboxLabel, { title })}
      className="fixed inset-0 z-[75] flex flex-col bg-basalt-deep"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex items-center justify-between px-5 pt-[calc(1rem+env(safe-area-inset-top))] sm:px-8">
        <p dir="ltr" className="text-[13px] tabular-nums tracking-[0.2em] text-limestone" aria-live="polite">
          {String(index + 1).padStart(2, "0")} <span className="text-smoke">/ {String(count).padStart(2, "0")}</span>
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={dict.work.closePhotos}
          className="group -me-2 inline-flex h-12 w-12 items-center justify-center rounded-full text-travertine/80 transition-[color,transform] duration-300 hover:text-travertine active:scale-90"
        >
          <X size={24} strokeWidth={1.25} className="transition-transform duration-500 ease-architect group-hover:rotate-90" />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-24">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <m.figure
            key={image.src}
            custom={direction}
            variants={{
              enter: (d: number) => ({ opacity: 0, x: d * ahead * 60 }),
              center: { opacity: 1, x: 0 },
              exit: (d: number) => ({ opacity: 0, x: d * ahead * -60 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.55, ease }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragEnd={onDragEnd}
            data-cursor="drag"
            className="flex h-full w-full cursor-grab flex-col items-center justify-center active:cursor-grabbing"
          >
            <div className="relative flex max-h-full min-h-0 w-full flex-1 items-center justify-center">
              <ProjectImage
                image={image}
                sizes={lightboxSizes(image)}
                className="pointer-events-none h-auto max-h-[calc(100svh-11rem)] w-auto max-w-full select-none object-contain"
              />
            </div>
            <figcaption className="mt-4 max-w-[60ch] px-2 text-center text-[13px] leading-[1.6] text-limestone">
              {image.alt}
            </figcaption>
          </m.figure>
        </AnimatePresence>

        <div className="pointer-events-none absolute inset-x-4 top-1/2 hidden -translate-y-1/2 justify-between sm:flex sm:inset-x-6">
          <button type="button" onClick={() => go(-1)} aria-label={dict.work.previousPhoto} className={`pointer-events-auto ${navButton}`}>
            <ArrowSwap direction="left" size={20} strokeWidth={1.25} />
          </button>
          <button type="button" onClick={() => go(1)} aria-label={dict.work.nextPhoto} className={`pointer-events-auto ${navButton}`}>
            <ArrowSwap size={20} strokeWidth={1.25} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-4 sm:hidden">
        <button type="button" onClick={() => go(-1)} aria-label={dict.work.previousPhoto} className={navButton}>
          <ArrowSwap direction="left" size={20} strokeWidth={1.25} />
        </button>
        <button type="button" onClick={() => go(1)} aria-label={dict.work.nextPhoto} className={navButton}>
          <ArrowSwap size={20} strokeWidth={1.25} />
        </button>
      </div>
      <div className="hidden pb-8 sm:block" />
    </m.div>
    </LazyMotion>
  );
}
