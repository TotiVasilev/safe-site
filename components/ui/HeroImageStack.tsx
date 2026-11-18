"use client";

import { useEffect, useState } from "react";

type Slide = { image: string; alt?: string };
const defaultSlides: Slide[] = [
  { image: "/hero/stack/slide-1.webp", alt: "Детайл на сейфова врата и заключващ механизъм" },
  { image: "/hero/stack/slide-2.webp", alt: "Банкови сейфови касети" },
  { image: "/hero/stack/slide-3.webp", alt: "Отворена трезорна врата със светлина" },
];

export default function HeroImageStack({ slides: configuredSlides, mobileImage }: { slides?: Slide[]; mobileImage?: string }) {
  const slides = configuredSlides?.filter((slide) => slide?.image?.trim()) ?? defaultSlides;
  const [active, setActive] = useState(0);
  const activeIndex = slides.length ? active % slides.length : 0;

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % slides.length), 3000);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="b-stack" role="img" aria-label="Снимки на решения за сигурност от ТЕТРАЕДЪР">
      <div className="b-stack-mobile-image" data-cms-field="mobileHeroImage" style={{ backgroundImage: `url(${JSON.stringify(mobileImage?.trim() || slides[0]?.image || defaultSlides[0].image)})` }} aria-hidden="true" />
      {slides.map((slide, index) => (
        <div
          key={`${slide.image}-${index}`}
          className={`b-stack-fade${index === activeIndex ? " is-active" : ""}`}
          style={{ backgroundImage: `url("${slide.image}")` }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
