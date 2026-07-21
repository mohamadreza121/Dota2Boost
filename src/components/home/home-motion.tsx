"use client";

import { useEffect } from "react";

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

export function HomeMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".dire-forge");
    if (!root) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const revealElements = Array.from(
      root.querySelectorAll<HTMLElement>("[data-forge-reveal]")
    );
    const rankSection = root.querySelector<HTMLElement>("[data-rank-forge]");
    let frame = 0;

    document.documentElement.classList.add("forge-motion-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-forged");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -7%", threshold: 0.08 }
    );

    revealElements.forEach((element) => observer.observe(element));

    if (reducedMotion.matches) {
      revealElements.forEach((element) => element.classList.add("is-forged"));
      return () => {
        observer.disconnect();
        document.documentElement.classList.remove("forge-motion-ready");
      };
    }

    const updateScroll = () => {
      frame = 0;
      const rect = root.getBoundingClientRect();
      const travel = Math.max(1, rect.height - window.innerHeight);
      const pageProgress = clamp(-rect.top / travel);
      root.style.setProperty("--forge-page-progress", pageProgress.toFixed(4));

      if (rankSection) {
        const rankRect = rankSection.getBoundingClientRect();
        const rankProgress = clamp(
          (window.innerHeight - rankRect.top) / (window.innerHeight + rankRect.height * 0.35)
        );
        rankSection.style.setProperty("--rank-forge-progress", rankProgress.toFixed(4));
      }
    };

    const requestScrollUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateScroll);
    };

    const handlePointer = (event: PointerEvent) => {
      if (!finePointer.matches) return;
      root.style.setProperty("--forge-pointer-x", `${event.clientX}px`);
      root.style.setProperty("--forge-pointer-y", `${event.clientY}px`);
    };

    window.addEventListener("scroll", requestScrollUpdate, { passive: true });
    window.addEventListener("resize", requestScrollUpdate, { passive: true });
    window.addEventListener("pointermove", handlePointer, { passive: true });
    updateScroll();

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", requestScrollUpdate);
      window.removeEventListener("resize", requestScrollUpdate);
      window.removeEventListener("pointermove", handlePointer);
      document.documentElement.classList.remove("forge-motion-ready");
    };
  }, []);

  return null;
}
