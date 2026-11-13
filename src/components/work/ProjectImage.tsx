"use client";

import { getImageProps, type ImageLoaderProps } from "next/image";
import { preload } from "react-dom";
import { useCallback, useState, type CSSProperties } from "react";
import type { ProjectImage as ProjectImageData } from "@/lib/projects";
import { imageFile, imageSrcSet } from "@/lib/image-srcset";

type Props = {
  image: ProjectImageData;
  /** Same meaning as next/image `sizes`: how wide the image renders at each breakpoint. */
  sizes: string;
  className?: string;
  /** Fill the (positioned) parent instead of using the photo's own proportions. */
  fill?: boolean;
  priority?: boolean;
  /** Override the browser's lazy loading, e.g. for an image that starts off-screen but must be ready. */
  loading?: "eager" | "lazy";
  style?: CSSProperties;
};

/**
 * Serves the pre-generated WebP widths from /public (see scripts/process_project_images.py), so the
 * browser still picks the right size for each screen while no image processing happens at request
 * time. That keeps photos fast on phones and makes them load identically in development, production
 * and any host. next/image supplies the attributes, but its srcset is replaced by one that names each
 * file by its real width (see lib/image-srcset.ts); the blur placeholder and the preload of a
 * `priority` image, which its <Image> wrapper handled, are done here.
 */
export function ProjectImage({ image, sizes, className = "", fill = false, priority = false, loading, style }: Props) {
  const [loaded, setLoaded] = useState(false);
  // An image that finished loading before hydration fires no load event, so also check on mount.
  const checkLoaded = useCallback((img: HTMLImageElement | null) => {
    if (img?.complete) setLoaded(true);
  }, []);

  const loader = ({ width }: ImageLoaderProps) =>
    imageFile(image, image.widths.find((w) => w >= width) ?? image.widths[image.widths.length - 1]);
  const srcSet = imageSrcSet(image);

  const { props } = getImageProps({
    loader,
    src: image.src,
    alt: image.alt,
    sizes,
    placeholder: loaded ? "empty" : "blur",
    blurDataURL: image.blur,
    className,
    style,
    ...(priority ? { preload: true } : {}),
    ...(loading ? { loading } : {}),
    ...(fill ? { fill: true } : { width: image.width, height: image.height }),
  });

  if (priority) preload(props.src, { as: "image", imageSrcSet: srcSet, imageSizes: sizes });

  return (
    // eslint-disable-next-line @next/next/no-img-element -- next/image cannot take a srcset, see above
    <img {...props} alt={image.alt} srcSet={srcSet} ref={checkLoaded} onLoad={() => setLoaded(true)} />
  );
}
