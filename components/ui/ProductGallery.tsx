"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type ProductGalleryProps = {
  productName: string;
  mainImage?: string;
  images?: string[];
};

export default function ProductGallery({
  productName,
  mainImage,
  images = [],
}: ProductGalleryProps) {
  const galleryImages = useMemo(
    () =>
      Array.from(
        new Set(
          [mainImage, ...images].filter(
            (image): image is string => Boolean(image)
          )
        )
      ),
    [mainImage, images]
  );

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (activeIndex >= galleryImages.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, galleryImages.length]);

  if (galleryImages.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center overflow-hidden rounded-3xl bg-neutral-100">
        <span className="text-xs uppercase tracking-[0.3em] text-black/20">
          SAFETY
        </span>
      </div>
    );
  }

  const showPrevious = () => {
    setActiveIndex((current) =>
      current === 0 ? galleryImages.length - 1 : current - 1
    );
  };

  const showNext = () => {
    setActiveIndex((current) =>
      current === galleryImages.length - 1 ? 0 : current + 1
    );
  };

  return (
    <div>
      <div className="group relative aspect-square overflow-hidden rounded-3xl bg-neutral-100">
        {galleryImages.map((image, index) => (
          <Image
            key={`${image}-${index}`}
            src={image}
            alt={
              index === 0
                ? productName
                : `${productName} - изображение ${index + 1}`
            }
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority={index === 0}
            className={`object-contain p-4 transition-all duration-500 sm:p-6 ${
              index === activeIndex
                ? "scale-100 opacity-100"
                : "pointer-events-none scale-[0.99] opacity-0"
            }`}
          />
        ))}

        {galleryImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={showPrevious}
              aria-label="Предишно изображение"
              className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-xl opacity-0 shadow-sm backdrop-blur transition-all hover:scale-105 hover:bg-white group-hover:opacity-100 sm:left-5 [@media(hover:none)]:opacity-100"
            >
              ←
            </button>

            <button
              type="button"
              onClick={showNext}
              aria-label="Следващо изображение"
              className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-xl opacity-0 shadow-sm backdrop-blur transition-all hover:scale-105 hover:bg-white group-hover:opacity-100 sm:right-5 [@media(hover:none)]:opacity-100"
            >
              →
            </button>

            <div className="absolute bottom-4 left-1/2 rounded-full bg-black/55 px-3 py-1.5 text-xs text-white backdrop-blur">
              {activeIndex + 1} / {galleryImages.length}
            </div>
          </>
        )}
      </div>

      {galleryImages.length > 1 && (
        <div className="mt-4 grid grid-cols-5 gap-2 sm:gap-3">
          {galleryImages.map((image, index) => (
            <button
              key={`thumbnail-${image}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Покажи изображение ${index + 1}`}
              className={`relative aspect-square overflow-hidden rounded-xl border bg-neutral-100 transition-all ${
                index === activeIndex
                  ? "border-black ring-1 ring-black"
                  : "border-black/10 hover:border-black/35"
              }`}
            >
              <Image
                src={image}
                alt=""
                fill
                sizes="120px"
                className="object-contain p-1.5"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
