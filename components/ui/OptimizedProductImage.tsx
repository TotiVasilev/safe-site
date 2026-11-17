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

// The product-page gallery is at most 520 CSS px wide on desktop.
// On mobile/tablet it fills the page minus the 24px padding on both sides.
// Share this with hover preloads and the server-rendered image preload hint.
export const PRODUCT_DETAIL_IMAGE_SIZES =
  "(max-width: 1023px) calc(100vw - 48px), 520px";

// Warm only images for cards the visitor actively approaches, not the whole catalog.
// Keep in-flight images alive until load, then rely on the browser's HTTP cache.
const inFlightDetails = new Map<string, HTMLImageElement>();
const warmedDetails = new Set<string>();

export function preloadProductDetailImage(originalSrc: string) {
  if (
    typeof window === "undefined" ||
    !originalSrc ||
    inFlightDetails.has(originalSrc) ||
    warmedDetails.has(originalSrc)
  ) return;

  const { src, srcSet } = getProductImageSources(originalSrc);
  // Don't speculatively download a potentially large unoptimized CMS upload.
  if (!srcSet) return;

  const image = new window.Image();
  inFlightDetails.set(originalSrc, image);
  image.onload = () => {
    inFlightDetails.delete(originalSrc);
    warmedDetails.add(originalSrc);
  };
  image.onerror = () => inFlightDetails.delete(originalSrc);
  image.decoding = "async";
  image.sizes = PRODUCT_DETAIL_IMAGE_SIZES;
  image.srcset = srcSet;
  image.src = src;
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
