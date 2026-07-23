"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  LockKeyhole,
  Route,
  Swords,
  Zap
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type BeatAlignment = "left" | "right" | "center";

type Beat = {
  id: string;
  start: number;
  end: number;
  align: BeatAlignment;
  title: { lead: string; accent: string };
  body: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
};

const beats: readonly Beat[] = [
  {
    id: "doom",
    start: 0,
    end: 0.235,
    align: "left",
    title: { lead: "Choose the rank", accent: "worth forging." },
    body: "Set your current medal, target, server, role, and delivery style. The route is defined before the campaign begins.",
    primary: { label: "Forge rank route", href: "/pricing" },
    secondary: { label: "Explore contracts", href: "/services" }
  },
  {
    id: "shadow-fiend",
    start: 0.19,
    end: 0.435,
    align: "right",
    title: { lead: "Every bracket has a", accent: "different fight." },
    body: "Region, role, party eligibility, hero pool, and queue conditions shape the campaign before the first match is scheduled.",
    primary: { label: "See the campaign", href: "/how-it-works" },
    secondary: { label: "Meet the roster", href: "/boosters" }
  },
  {
    id: "ember-spirit",
    start: 0.39,
    end: 0.635,
    align: "left",
    title: { lead: "Solo direction or", accent: "Duo execution." },
    body: "Choose Solo Assist, Duo Queue, calibration, fixed wins, behavior recovery, or a focused coaching session.",
    primary: { label: "Open MMR boost", href: "/services/mmr-boost" },
    secondary: { label: "Compare services", href: "/services" }
  },
  {
    id: "lina",
    start: 0.59,
    end: 0.835,
    align: "right",
    title: { lead: "Your account stays", accent: "in your hands." },
    body: "No passwords, Steam Guard codes, or remote access. Track scheduling, messages, matches, and milestones in one private workspace.",
    primary: { label: "Review delivery", href: "/how-it-works" },
    secondary: { label: "Read verified reviews", href: "/reviews" }
  },
  {
    id: "dragon-knight",
    start: 0.79,
    end: 1,
    align: "left",
    title: { lead: "Forge the route.", accent: "Siege the rank." },
    body: "Build a live server-priced campaign and move through every checkpoint with the scope visible.",
    primary: { label: "Start the campaign", href: "/pricing" },
    secondary: { label: "Start with coaching", href: "/services/coaching" }
  }
];

const heroScenes = [
  { id: "doom", name: "Doom", src: "/media/dire-forge/scenes/doom.webp" },
  { id: "shadow-fiend", name: "Shadow Fiend", src: "/media/dire-forge/scenes/shadow-fiend.webp" },
  { id: "ember-spirit", name: "Ember Spirit", src: "/media/dire-forge/scenes/ember-spirit.webp" },
  { id: "lina", name: "Lina", src: "/media/dire-forge/scenes/lina.webp" },
  { id: "dragon-knight", name: "Dragon Knight", src: "/media/dire-forge/scenes/dragon-knight.webp" }
] as const;

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

export function ForgeHero() {
  const stageRef = useRef<HTMLElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const beatRefs = useRef<Array<HTMLDivElement | null>>([]);
  const sceneRefs = useRef<Array<HTMLDivElement | null>>([]);
  const loadedScenesRef = useRef(new Set<string>());
  const [cinematicEnabled, setCinematicEnabled] = useState(false);
  const [ready, setReady] = useState(false);

  const markSceneLoaded = (sceneName: string) => {
    loadedScenesRef.current.add(sceneName);
    if (loadedScenesRef.current.size === heroScenes.length) setReady(true);
  };

  useEffect(() => {
    const media = window.matchMedia(
      "(min-width: 769px) and (prefers-reduced-motion: no-preference)"
    );
    const sync = () => setCinematicEnabled(media.matches);

    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const stage = stageRef.current;

    if (!stage) return;

    if (!cinematicEnabled) {
      stage.style.setProperty("--forge-hero-progress", "0");
      sceneRefs.current.forEach((element, index) => {
        if (!element) return;
        element.style.opacity = index === 0 ? "1" : "0";
        element.style.visibility = index === 0 ? "visible" : "hidden";
      });
      beatRefs.current.forEach((element, index) => {
        if (!element) return;
        element.style.opacity = index === 0 ? "1" : "0";
        element.style.pointerEvents = "none";
        element.inert = index !== 0;
        element.setAttribute("aria-hidden", index === 0 ? "false" : "true");
      });
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let targetProgress = 0;
    let renderedProgress = 0;
    let animationFrame = 0;
    let running = false;
    let lastFrameTime = performance.now();
    let stageStart = 0;
    let stageTravel = 1;

    const renderBeats = (progress: number) => {
      beatRefs.current.forEach((element, index) => {
        const beat = beats[index];
        if (!element || !beat) return;

        const fadeWindow = 0.055;
        const fadeIn = beat.start === 0
          ? 1
          : clamp((progress - beat.start) / fadeWindow);
        const fadeOut = beat.end === 1
          ? 1
          : clamp((beat.end - progress) / fadeWindow);
        const opacity = Math.min(fadeIn, fadeOut);
        const direction = beat.align === "right" ? -1 : 1;
        const visible = opacity > 0.002;

        element.style.opacity = opacity.toFixed(3);
        element.style.visibility = visible ? "visible" : "hidden";
        if (!visible) return;
        element.style.setProperty(
          "--beat-shift",
          `${(1 - opacity) * 58 * direction}px`
        );
        element.style.setProperty("--beat-lift", `${(1 - opacity) * 18}px`);
        element.style.setProperty("--beat-scale", `${0.97 + opacity * 0.03}`);
        element.style.pointerEvents = "none";
        element.inert = opacity <= 0.72;
        element.setAttribute("aria-hidden", opacity > 0.1 ? "false" : "true");
      });

    };

    const renderScenes = (progress: number) => {
      sceneRefs.current.forEach((element, index) => {
        const beat = beats[index];
        if (!element || !beat) return;

        const fadeWindow = 0.065;
        const fadeIn = beat.start === 0
          ? 1
          : clamp((progress - beat.start) / fadeWindow);
        const fadeOut = beat.end === 1
          ? 1
          : clamp((beat.end - progress) / fadeWindow);
        const opacity = Math.min(fadeIn, fadeOut);
        const localProgress = clamp(
          (progress - beat.start) / Math.max(0.001, beat.end - beat.start)
        );
        const direction = beat.align === "right" ? -1 : 1;
        const visible = opacity > 0.002;

        element.style.opacity = opacity.toFixed(3);
        element.style.visibility = visible ? "visible" : "hidden";
        element.style.setProperty(
          "--scene-drift",
          `${(localProgress - 0.5) * 18 * direction}px`
        );
        element.style.setProperty(
          "--scene-scale",
          `${1 + Math.sin(localProgress * Math.PI) * 0.012}`
        );
      });
    };

    const render = (progress: number) => {
      stage.style.setProperty("--forge-hero-progress", progress.toFixed(4));
      stage.style.setProperty(
        "--forge-fire-intensity",
        `${0.72 + Math.sin(progress * Math.PI * 5) * 0.12}`
      );

      if (counterRef.current) {
        counterRef.current.textContent = String(Math.round(progress * 100)).padStart(2, "0");
      }

      renderBeats(progress);
      renderScenes(progress);
    };

    const tick = (timestamp: number) => {
      const difference = targetProgress - renderedProgress;
      const elapsed = Math.max(16, Math.min(64, timestamp - lastFrameTime));
      const response = 1 - Math.exp(-elapsed / 55);
      lastFrameTime = timestamp;

      renderedProgress = reducedMotion.matches
        ? targetProgress
        : Math.abs(difference) < 0.00035
          ? targetProgress
          : renderedProgress + difference * response;

      render(renderedProgress);

      if (Math.abs(targetProgress - renderedProgress) > 0.00035) {
        animationFrame = window.requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };

    const requestTick = () => {
      if (running) return;
      running = true;
      lastFrameTime = performance.now();
      animationFrame = window.requestAnimationFrame(tick);
    };

    const syncTarget = () => {
      targetProgress = clamp((window.scrollY - stageStart) / stageTravel);
      requestTick();
    };

    const measure = () => {
      const headerHeight = Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--header-height")
      ) || 0;
      const viewport = Math.max(1, window.innerHeight - headerHeight);

      stageStart = stage.offsetTop - headerHeight;
      stageTravel = Math.max(1, stage.offsetHeight - viewport);
      syncTarget();
    };

    window.addEventListener("scroll", syncTarget, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    reducedMotion.addEventListener("change", measure);

    const resizeObserver = typeof ResizeObserver === "undefined"
      ? null
      : new ResizeObserver(measure);
    resizeObserver?.observe(stage);
    const header = document.querySelector<HTMLElement>(".dota-command-header");
    if (header) resizeObserver?.observe(header);

    measure();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", syncTarget);
      window.removeEventListener("resize", measure);
      reducedMotion.removeEventListener("change", measure);
      resizeObserver?.disconnect();
    };
  }, [cinematicEnabled]);

  return (
    <section
      ref={stageRef}
      className="forge-hero"
      aria-label="Interactive Dota 2 rank campaign introduction"
    >
      <div className="forge-hero__sticky">
        <div className="forge-hero__battlefield" aria-hidden="true">
          <div className="forge-hero__furnace" />
          <div className="forge-hero__lane" />
          {heroScenes.map((scene, index) => (
            <div
              key={scene.name}
              ref={(element) => {
                sceneRefs.current[index] = element;
              }}
              className={`forge-hero__scene forge-hero__scene--${scene.id}${index === 0 ? " is-current" : ""}`}
            >
              <Image
                src={scene.src}
                alt=""
                fill
                priority={index === 0}
                loading={index === 0 ? undefined : "eager"}
                sizes="100vw"
                onLoad={() => markSceneLoaded(scene.name)}
              />
            </div>
          ))}
        </div>

        <div className="forge-hero__architecture" aria-hidden="true">
          <i /><i /><i /><i />
        </div>
        <div className="forge-hero__heat" aria-hidden="true" />
        <div className="forge-hero__inferno" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        <div className="forge-hero__smoke" aria-hidden="true"><i /><i /><i /><i /></div>
        <div className="forge-hero__embers" aria-hidden="true">
          {Array.from({ length: 16 }, (_, index) => <i key={index} />)}
        </div>
        <div className="forge-hero__grade" aria-hidden="true" />
        <div className="forge-hero__grain" aria-hidden="true" />

        <div className="forge-hero__beats">
          {beats.map((beat, index) => {
            const Heading = index === 0 ? "h1" : "h2";

            return (
              <div
                key={beat.id}
                ref={(element) => {
                  beatRefs.current[index] = element;
                  if (element) element.inert = index !== 0;
                }}
                className={`forge-beat forge-beat--${beat.align} forge-beat--${beat.id}`}
                aria-hidden={index === 0 ? "false" : "true"}
              >
                <div className="forge-beat__panel">
                  <Heading>
                    <span>{beat.title.lead}</span>{" "}
                    <em>{beat.title.accent}</em>
                  </Heading>
                  <p className="forge-beat__body">{beat.body}</p>

                  <div className="forge-beat__actions">
                    <Link href={beat.primary.href} className="molten-button">
                      <span>{beat.primary.label}</span><i><ArrowRight /></i>
                    </Link>
                    <Link href={beat.secondary.href} className="molten-button molten-button--secondary">
                      <span>{beat.secondary.label}</span><i><ArrowUpRight /></i>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <aside className="forge-hero__route" aria-label="Example rank route">
          <div className="forge-hero__route-head">
            <span><Zap /> Route preview</span><small>EU West</small>
          </div>
          <div className="forge-hero__route-ranks">
            <span><small>Current rank</small><strong>Legend III</strong></span>
            <i><Route /></i>
            <span><small>Target rank</small><strong>Ancient I</strong></span>
          </div>
          <div className="forge-hero__route-tags">
            <span><Check /> Solo Assist</span><span>Mid</span><span><LockKeyhole /> Private</span>
          </div>
        </aside>

        <div className="forge-hero__scroll-cue">
          <div><span ref={counterRef}>00</span><small>/ 100</small></div>
          <p>Scroll to direct the battle</p>
          <i aria-hidden="true"><span /></i>
        </div>

        {cinematicEnabled ? (
          <div className={`forge-hero__loader${ready ? " is-ready" : ""}`} aria-live="polite">
            <span><Swords /></span>
            <div><i /><i /><i /></div>
            <p>Igniting battlefield</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
