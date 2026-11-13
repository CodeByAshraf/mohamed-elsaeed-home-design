import type { ImageAsset } from "@/lib/projects";

/** The pre-generated WebP of `image` at one of its `widths` (see scripts/process_project_images.py). */
export function imageFile(image: Pick<ImageAsset, "src">, width: number) {
  return `${image.src}-${width}.webp`;
}

/**
 * `srcset` naming every file by its real pixel width. next/image cannot produce this: it labels each
 * URL with a width from its global deviceSizes/imageSizes list, so a 1600px file was also offered as
 * 1920w, 2048w and 3840w, and a photo sized from its intrinsic width (the lightbox) could render at
 * 1600/3840 of the space it had.
 */
export function imageSrcSet(image: Pick<ImageAsset, "src" | "widths">) {
  return image.widths.map((w) => `${imageFile(image, w)} ${w}w`).join(", ");
}
