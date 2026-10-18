"use client";
import { useEffect } from "react";

/** Reveal each element once as it enters the viewport; no layout shifts. */
export default function KineticMotion() {
  useEffect(() => {
    const site = document.querySelector<HTMLElement>(".blue-site");
    if (!site) return;
    const elements = Array.from(site.querySelectorAll<HTMLElement>("[data-reveal], [data-reveal-group]"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      elements.forEach(el => el.classList.add("is-revealed"));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.08, rootMargin: "0px 0px -6% 0px" });
    // Activate hidden initial state only after observers are registered.
    elements.forEach(el => {
      const delay = el.dataset.revealDelay;
      if (delay && !el.style.getPropertyValue("--reveal-delay")) {
        el.style.setProperty("--reveal-delay", `${Number(delay) * 130}ms`);
      }
      observer.observe(el);
    });
    site.classList.add("motion-ready");
    return () => { observer.disconnect(); site.classList.remove("motion-ready"); };
  }, []);
  return null;
}
