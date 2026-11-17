import type { ImgHTMLAttributes } from "react";
import optimizedImages from "@/data/optimized-images.json";

type Variant = { width: number; src: string };
type Asset = { variants: Variant[] };
const manifest = optimizedImages as Record<string, Asset>;

/**
 * Static srcset for locally uploaded CMS product images.
 * The original URL is a safe fallback for unoptimized / newly uploaded files.
 * All output files are created before the Cloudflare static-export build.
 */
export function getProductImageSources(src: string) {
  const variants = manifest[src]?.variants || [];
  return {
    src: variants.length ? variants[variants.length - 1].src : src,
    srcSet: variants.length
      ? variants.map(({ src: url, width }) => `${url} ${width}w`).join(", ")
      : undefined,
  };
}

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet"> & {
  src: string;
  priority?: boolean;
};

export default function OptimizedProductImage({ src, priority = false, loading, ...props }: Props) {
  const sources = getProductImageSources(src);
  return (
    // Generated WebPs retain alpha and appearance. Originals remain available as fallback.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      src={sources.src}
      srcSet={sources.srcSet}
      loading={loading ?? (priority ? "eager" : "lazy")}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
    />
  );
}
