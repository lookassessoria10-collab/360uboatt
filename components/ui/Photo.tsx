"use client";

import Image, { type ImageLoader, type ImageProps } from "next/image";
import type { MediaImage } from "@/types/boat";

const UNSPLASH_HOST = "https://images.unsplash.com/";

/** Usa o CDN do Unsplash (imgix) para redimensionar, sem reprocessar no servidor. */
const unsplashLoader: ImageLoader = ({ src, width, quality }) => {
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 72));
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "max");
  return url.toString();
};

type PhotoProps = { image: MediaImage } & Omit<ImageProps, "src" | "alt" | "width" | "height" | "loader">;

/** Imagem otimizada a partir de um `MediaImage` (local em /public ou Unsplash). */
export function Photo({ image, fill, ...props }: PhotoProps) {
  const loader = image.src.startsWith(UNSPLASH_HOST) ? unsplashLoader : undefined;
  if (fill) {
    return <Image src={image.src} alt={image.alt} fill loader={loader} {...props} />;
  }
  return <Image src={image.src} alt={image.alt} width={image.width} height={image.height} loader={loader} {...props} />;
}
