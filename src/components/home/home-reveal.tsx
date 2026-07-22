"use client";

import { useEffect } from "react";

export function HomeReveal() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".war-table");
    if (!root) return;

    const elements = Array.from(root.querySelectorAll<HTMLElement>("[data-war-reveal]"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    document.documentElement.classList.add("war-motion-ready");

    if (reducedMotion.matches || typeof IntersectionObserver === "undefined") {
      elements.forEach((element) => element.classList.add("is-visible"));
      return () => document.documentElement.classList.remove("war-motion-ready");
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8%", threshold: 0.08 }
    );

    elements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("war-motion-ready");
    };
  }, []);

  return null;
}
