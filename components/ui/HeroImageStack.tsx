"use client";

import { useEffect, useState } from "react";

const slides = [
  { src: "/hero/stack/slide-1.webp", alt: "Детайл на сейфова врата и заключващ механизъм" },
  { src: "/hero/stack/slide-2.webp", alt: "Банкови сейфови касети" },
  { src: "/hero/stack/slide-3.webp", alt: "Отворена трезорна врата със светлина" },
];

export default function HeroImageStack() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setActive((current) => (current + 1) % slides.length), 3000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="b-stack" role="img" aria-label="Снимки на решения за сигурност от ТЕТРАЕДЪР">
      {slides.map((slide, index) => (
        <div
          key={slide.src}
          className={`b-stack-fade${index === active ? " is-active" : ""}`}
          style={{ backgroundImage: `url("${slide.src}")` }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
