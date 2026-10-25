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
      >
        <span className="about-logo-reveal__symbol-wrap" onMouseEnter={() => setShineKey((key) => key + 1)}>
          <img
            key={`spin-${spinKey}`}
            className="about-logo-reveal__symbol"
            src="/branding/tetraedar-shuriken.svg"
            alt=""
            width={310}
            height={310}
            draggable={false}
          />
          {shineKey > 0 && (
            <svg key={`polish-${shineKey}`} className="about-logo-reveal__polish" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
              <defs>
                <clipPath id="tetraedar-polish-shape">
                  <g transform="translate(0 -8)">
                  <path d="M100 25 L122 118 L108 132 L92 132 L78 118 Z" />
                  <path d="M108 117 L196 190 L100 163 L90 145 Z" />
                  <path d="M92 117 L5 190 L100 163 L110 145 Z" />
                  <circle cx="100" cy="137" r="21" />
                  </g>
                </clipPath>
                <mask id="tetraedar-polish-hole">
                  <rect width="200" height="200" fill="white" />
                  <circle cx="100" cy="129" r="10.5" fill="black" />
                </mask>
                <linearGradient id="tetraedar-polish-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0" stopColor="white" stopOpacity="0" />
                  <stop offset=".35" stopColor="white" stopOpacity=".08" />
                  <stop offset=".47" stopColor="white" stopOpacity=".6" />
                  <stop offset=".5" stopColor="white" stopOpacity=".95" />
                  <stop offset=".54" stopColor="white" stopOpacity=".65" />
                  <stop offset=".7" stopColor="white" stopOpacity=".08" />
                  <stop offset="1" stopColor="white" stopOpacity="0" />
                </linearGradient>
              </defs>
              <g clipPath="url(#tetraedar-polish-shape)" mask="url(#tetraedar-polish-hole)">
                <rect x="-100" y="0" width="90" height="200" fill="url(#tetraedar-polish-gradient)">
                  <animate attributeName="x" from="-100" to="220" dur="1.9s" calcMode="spline" keyTimes="0;1" keySplines="0.35 0 0.65 1" fill="freeze" />
                </rect>
              </g>
            </svg>
          )}
        </span>
        <div className="about-logo-reveal__wordmark">ТЕТРАЕДЪР</div>
      </button>
    </div>
  );
}
