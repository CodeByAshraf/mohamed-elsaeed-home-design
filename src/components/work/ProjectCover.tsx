import { ProjectImage } from "@/components/work/ProjectImage";
import type { ProjectImage as ProjectImageData } from "@/lib/projects";

/**
 * Project cover at the photo's own 4:3 proportions, sized to fit the screen height, so tall
 * features (like the Shubar arches) are never cropped. It rises into view like a curtain and
 * settles from a slight zoom (CSS: [data-reveal="curtain"] in globals.css). No scroll drift:
 * drifting needs extra image beyond the frame, which would clip the top and bottom of the photo.
 */
export function ProjectCover({ image }: { image: ProjectImageData }) {
  return (
    <div
      data-reveal="curtain"
      suppressHydrationWarning
      className="relative mx-auto aspect-[4/3] w-[min(100%,calc(86svh*4/3))] overflow-hidden bg-basalt-deep"
    >
      <div className="reveal-zoom absolute inset-0">
        <ProjectImage image={image} fill priority sizes="(min-width: 640px) 90vw, 100vw" className="object-cover object-center" />
      </div>
    </div>
  );
}
