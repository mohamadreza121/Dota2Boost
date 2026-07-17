"use client";

import { useEffect } from "react";

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export function HomeMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".dota-journey");
    if (!root) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.documentElement.classList.add("motion-ready");

    const revealElements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      }
    }, { rootMargin: "0px 0px -8%", threshold: 0.1 });
    revealElements.forEach((element) => observer.observe(element));

    if (reducedMotion) {
      revealElements.forEach((element) => element.classList.add("is-revealed"));
      return () => {
        observer.disconnect();
        document.documentElement.classList.remove("motion-ready");
      };
    }

    let frame = 0;
    const rankSection = document.querySelector<HTMLElement>("[data-rank-journey]");
    const mapFrame = document.querySelector<HTMLElement>("[data-map-frame]");

    const updateScroll = () => {
      frame = 0;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      root.style.setProperty("--page-progress", String(clamp(window.scrollY / maxScroll)));

      if (rankSection) {
        const rect = rankSection.getBoundingClientRect();
        const travel = Math.max(1, rect.height - window.innerHeight);
        const progress = clamp(-rect.top / travel);
        rankSection.style.setProperty("--rank-progress", String(progress));
      }

      if (mapFrame) {
        const rect = mapFrame.getBoundingClientRect();
        const progress = clamp((window.innerHeight - rect.top) / (window.innerHeight + rect.height));
        mapFrame.style.setProperty("--map-progress", String(progress));
      }
    };

    const requestScrollUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateScroll);
    };

    const handlePointer = (event: PointerEvent) => {
      root.style.setProperty("--pointer-x", `${event.clientX}px`);
      root.style.setProperty("--pointer-y", `${event.clientY}px`);
      root.style.setProperty("--pointer-x-ratio", String(event.clientX / window.innerWidth));
      root.style.setProperty("--pointer-y-ratio", String(event.clientY / window.innerHeight));
    };

    const tiltCards = Array.from(document.querySelectorAll<HTMLElement>("[data-tilt]"));
    const cleanups: Array<() => void> = [];

    for (const card of tiltCards) {
      const handleMove = (event: PointerEvent) => {
        const rect = card.getBoundingClientRect();
        const x = clamp((event.clientX - rect.left) / rect.width);
        const y = clamp((event.clientY - rect.top) / rect.height);
        card.style.setProperty("--card-x", String(x));
        card.style.setProperty("--card-y", String(y));
        card.style.setProperty("--tilt-x", `${(0.5 - y) * 7}deg`);
        card.style.setProperty("--tilt-y", `${(x - 0.5) * 7}deg`);
      };
      const reset = () => {
        card.style.setProperty("--tilt-x", "0deg");
        card.style.setProperty("--tilt-y", "0deg");
      };
      card.addEventListener("pointermove", handleMove);
      card.addEventListener("pointerleave", reset);
      cleanups.push(() => {
        card.removeEventListener("pointermove", handleMove);
        card.removeEventListener("pointerleave", reset);
      });
    }

    window.addEventListener("scroll", requestScrollUpdate, { passive: true });
    window.addEventListener("resize", requestScrollUpdate);
    window.addEventListener("pointermove", handlePointer, { passive: true });
    updateScroll();

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      observer.disconnect();
      cleanups.forEach((cleanup) => cleanup());
      window.removeEventListener("scroll", requestScrollUpdate);
      window.removeEventListener("resize", requestScrollUpdate);
      window.removeEventListener("pointermove", handlePointer);
      document.documentElement.classList.remove("motion-ready");
    };
  }, []);

  return null;
}
