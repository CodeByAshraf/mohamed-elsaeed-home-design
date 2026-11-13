"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { ProjectImage } from "@/components/work/ProjectImage";
import { Reveal } from "@/components/motion/Reveal";
import { galleryImages, type Project } from "@/lib/projects";
import { useLocale } from "@/i18n/LocaleProvider";
import { fill } from "@/i18n/config";

/** The full-screen viewer is downloaded on intent (hover, focus or touch on a photo), not with the page. */
const loadLightbox = () => import("@/components/work/Lightbox");
const Lightbox = dynamic(() => loadLightbox().then((m) => m.Lightbox), { ssr: false });
const preloadLightbox = () => {
  void loadLightbox();
};

/* Static class maps so Tailwind can see every class it needs to generate. */
const SPAN = { 4: "md:col-span-4", 5: "md:col-span-5", 6: "md:col-span-6", 7: "md:col-span-7" } as const;
const START = { 2: "md:col-start-2", 3: "md:col-start-3", 7: "md:col-start-7", 8: "md:col-start-8" } as const;
const ALIGN = { start: "md:self-start", center: "md:self-center", end: "md:self-end" } as const;

/**
 * `sizes` for a photo spanning `span` of 12 columns: its real rendered width at each breakpoint, so a
 * phone is not sent a file sized for the full screen. Mirrors the layout: the page section's px-6 /
 * sm:px-10 / lg:px-16 padding inside max-w-[1600px] (app/work/[slug]/page.tsx), then this grid: one
 * column below md, 12 columns with gap-x-10 from md. Update it if that layout changes.
 */
function gallerySizes(span: number) {
  // `span` columns of a grid `grid` wide: 11 gaps of 2.5rem, the rest shared by 12 columns.
  const columns = (grid: string) => `calc((${grid} - 27.5rem) * ${span} / 12 + ${(span - 1) * 2.5}rem)`;
  return [
    `(min-width: 1600px) ${columns("1600px - 8rem")}`,
    `(min-width: 64rem) ${columns("100vw - 8rem")}`,
    `(min-width: 48rem) ${columns("100vw - 5rem")}`,
    "(min-width: 40rem) calc(100vw - 5rem)",
    "calc(100vw - 3rem)",
  ].join(", ");
}

/**
 * Editorial gallery: photos keep their own proportions and sit in offset pairs on desktop,
 * one per row on phones. Every photo opens the full-screen viewer at that photo.
 */
export function ProjectGallery({ project }: { project: Project }) {
  const { dict } = useLocale();
  const images = galleryImages(project);
  const [open, setOpen] = useState<number | null>(null);
  /** Index of each row's first photo in the flat list the viewer steps through. */
  const rowOffsets = project.gallery.map((_, r) =>
    project.gallery.slice(0, r).reduce((sum, row) => sum + row.items.length, 0),
  );

  return (
    <>
      <div className="flex flex-col gap-6 md:gap-28">
        {project.gallery.map((row, r) => (
          <div key={r} className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-x-10">
            {row.items.map((item, i) => {
              const index = rowOffsets[r] + i;
              return (
                <Reveal
                  key={item.image.src}
                  delay={i * 0.12}
                  y={36}
                  className={`${SPAN[item.span]} ${item.start ? START[item.start] : ""} ${ALIGN[item.align ?? "start"]}`}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(index)}
                    onPointerEnter={preloadLightbox}
                    onFocus={preloadLightbox}
                    onTouchStart={preloadLightbox}
                    data-cursor="open"
                    aria-label={fill(dict.work.openPhoto, { n: index + 1, total: images.length, alt: item.image.alt })}
                    className="group relative block w-full overflow-hidden bg-basalt-deep outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-bronze"
                  >
                    <ProjectImage
                      image={item.image}
                      sizes={gallerySizes(item.span)}
                      className="h-auto w-full transition-transform duration-[1200ms] ease-architect group-hover:scale-[1.035]"
                    />
                    <span
                      aria-hidden
                      className="absolute bottom-4 end-4 inline-flex h-11 w-11 scale-75 items-center justify-center rounded-full bg-travertine/90 text-basalt opacity-0 backdrop-blur transition-[opacity,transform] duration-500 ease-architect group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100"
                    >
                      <Plus size={18} strokeWidth={1.5} />
                    </span>
                  </button>
                </Reveal>
              );
            })}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {open !== null && (
          <Lightbox
            images={images}
            index={open}
            title={project.title}
            onClose={() => setOpen(null)}
            onIndexChange={setOpen}
          />
        )}
      </AnimatePresence>
    </>
  );
}
