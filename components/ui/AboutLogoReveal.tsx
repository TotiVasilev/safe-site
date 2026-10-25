"use client";

import { useEffect, useRef, useState } from "react";
import "./AboutLogoReveal.css";

/** Plays once when the About section enters the viewport. */
export default function AboutLogoReveal() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [spinKey, setSpinKey] = useState(0);
  const [shineKey, setShineKey] = useState(0);

  useEffect(() => {
    const element = rootRef.current;
    if (!element) return;
    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef} className={`about-logo-reveal${visible ? " is-visible" : ""}`} aria-label="ТЕТРАЕДЪР">
      <button
        type="button"
        className="about-logo-reveal__lockup"
        aria-label="Завърти логото на ТЕТРАЕДЪР"
        onClick={() => setSpinKey((key) => key + 1)}
        onMouseEnter={() => setShineKey((key) => key + 1)}
      >
        <span className="about-logo-reveal__symbol-wrap">
          {shineKey > 0 && <span key={`shine-${shineKey}`} className="about-logo-reveal__shine" aria-hidden="true" />}
        <img
          key={`spin-${spinKey}`}
          className="about-logo-reveal__symbol"
          src="/branding/tetraedar-shuriken.svg"
          alt=""
          width={310}
          height={310}
          draggable={false}
        />
        </span>
        <div className="about-logo-reveal__wordmark">ТЕТРАЕДЪР</div>
      </button>
    </div>
  );
}
