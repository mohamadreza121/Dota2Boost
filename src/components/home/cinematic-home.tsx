"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Crosshair,
  GraduationCap,
  LockKeyhole,
  Route,
  Signal,
  Sparkles,
  Swords,
  Target,
  Trophy,
  Zap
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type BeatAlignment = "left" | "right" | "center";

type Beat = {
  start: number;
  end: number;
  align: BeatAlignment;
  kicker: string;
  title: string;
  body: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
  scene: string;
};

const beats: readonly Beat[] = [
  {
    start: 0,
    end: 0.22,
    align: "left",
    kicker: "Highground / Dota 2 rank services",
    title: "Your next rank is not luck.",
    body: "Build a private climb route around your medal, server, role, and preferred delivery style.",
    primary: { label: "Build my rank route", href: "/pricing" },
    secondary: { label: "Explore services", href: "/services" },
    scene: "Route"
  },
  {
    start: 0.18,
    end: 0.43,
    align: "right",
    kicker: "01 / Read the fight",
    title: "The outcome is decided before the first spell lands.",
    body: "Replay analysis and role-specific coaching turn positioning, map reads, and decision timing into repeatable wins.",
    primary: { label: "Book coaching", href: "/services/coaching" },
    secondary: { label: "How it works", href: "/how-it-works" },
    scene: "Read"
  },
  {
    start: 0.39,
    end: 0.66,
    align: "left",
    kicker: "02 / Execute under pressure",
    title: "Mechanics matter. Consistency climbs.",
    body: "Choose Solo delivery, Duo Queue, calibration, behavior score recovery, or fixed-win packages with clear progress tracking.",
    primary: { label: "View MMR boost", href: "/services/mmr-boost" },
    secondary: { label: "Meet the roster", href: "/boosters" },
    scene: "Execute"
  },
  {
    start: 0.62,
    end: 0.86,
    align: "right",
    kicker: "03 / Control the tempo",
    title: "Private delivery. Clear milestones. No guessing.",
    body: "Follow your order from a secure workspace, message your assigned expert, and stay in control of scheduling and preferences.",
    primary: { label: "See the process", href: "/how-it-works" },
    secondary: { label: "Read reviews", href: "/reviews" },
    scene: "Control"
  },
  {
    start: 0.82,
    end: 1,
    align: "center",
    kicker: "The decisive moment",
    title: "Take the high ground.",
    body: "Choose the result you want. We will build the route to reach it.",
    primary: { label: "Start my climb", href: "/pricing" },
    secondary: { label: "Talk to a coach", href: "/services/coaching" },
    scene: "Climb"
  }
];

const services = [
  {
    number: "01",
    icon: Route,
    title: "MMR Boost",
    body: "Select current MMR, target medal, server, and Solo or Duo delivery.",
    href: "/services/mmr-boost",
    meta: "Custom rank route",
    accent: "violet"
  },
  {
    number: "02",
    icon: Crosshair,
    title: "Calibration",
    body: "Structured five- or ten-match calibration blocks with progress visibility.",
    href: "/services/mmr-calibration",
    meta: "5 or 10 matches",
    accent: "cyan"
  },
  {
    number: "03",
    icon: GraduationCap,
    title: "Coaching",
    body: "Replay review, live sessions, hero pool planning, and role development.",
    href: "/services/coaching",
    meta: "Role-specific training",
    accent: "coral"
  }
] as const;

const trustItems = [
  { icon: LockKeyhole, title: "Private by default", body: "Secure delivery workspace" },
  { icon: Trophy, title: "Progress visible", body: "Clear milestones and updates" },
  { icon: Target, title: "You control the route", body: "Server, role, timing, and mode" }
] as const;

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

export function CinematicHome() {
  const stageRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const beatRefs = useRef<Array<HTMLDivElement | null>>([]);
  const sceneRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [ready, setReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    const video = videoRef.current;

    if (!stage || !video) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let targetProgress = 0;
    let renderedProgress = 0;
    let animationFrame = 0;
    let running = false;
    let metadataReady = video.readyState >= HTMLMediaElement.HAVE_METADATA;
    let lastVideoTime = -1;

    const renderBeats = (progress: number) => {
      let activeIndex = 0;

      beats.forEach((beat, index) => {
        if (progress >= beat.start) activeIndex = index;
      });

      beatRefs.current.forEach((element, index) => {
        const beat = beats[index];
        if (!element || !beat) return;

        const fadeWindow = index === beats.length - 1 ? 0.075 : 0.065;
        const fadeIn = beat.start === 0 ? 1 : clamp((progress - beat.start) / fadeWindow);
        const fadeOut = beat.end === 1 ? 1 : clamp((beat.end - progress) / fadeWindow);
        const opacity = Math.min(fadeIn, fadeOut);
        const direction = beat.align === "right" ? -1 : 1;
        const shift = (1 - opacity) * 42;

        element.style.opacity = opacity.toFixed(3);
        element.style.setProperty("--beat-shift", `${shift * direction}px`);
        element.style.pointerEvents = opacity > 0.72 ? "auto" : "none";
        element.setAttribute("aria-hidden", opacity > 0.1 ? "false" : "true");
      });

      sceneRefs.current.forEach((element, index) => {
        if (!element) return;
        element.dataset.active = index === activeIndex ? "true" : "false";
      });
    };

    const render = (progress: number) => {
      stage.style.setProperty("--duel-progress", progress.toFixed(4));
      stage.style.setProperty("--video-x", `${50 + clamp((progress - 0.42) / 0.38) * 5}%`);

      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${progress})`;
      }

      if (counterRef.current) {
        counterRef.current.textContent = String(Math.round(progress * 100)).padStart(2, "0");
      }

      renderBeats(progress);

      if (metadataReady && Number.isFinite(video.duration) && video.duration > 0) {
        const desiredTime = progress * Math.max(0, video.duration - 0.045);

        if (Math.abs(desiredTime - lastVideoTime) >= 1 / 80) {
          try {
            video.currentTime = desiredTime;
            lastVideoTime = desiredTime;
          } catch {
            // Some browsers reject seeking until the media element is fully initialized.
          }
        }
      }
    };

    const tick = () => {
      const difference = targetProgress - renderedProgress;

      renderedProgress = reducedMotion.matches
        ? targetProgress
        : Math.abs(difference) < 0.00035
          ? targetProgress
          : renderedProgress + difference * 0.14;

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
      animationFrame = window.requestAnimationFrame(tick);
    };

    const syncTarget = () => {
      const headerHeight =
        Number.parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue("--header-height")
        ) || 0;
      const start = stage.offsetTop - headerHeight;
      const viewport = Math.max(1, window.innerHeight - headerHeight);
      const travel = Math.max(1, stage.offsetHeight - viewport);

      targetProgress = clamp((window.scrollY - start) / travel);
      requestTick();
    };

    const onMetadata = () => {
      metadataReady = true;
      video.pause();
      setReady(true);
      render(renderedProgress);
    };

    const unlockVideo = () => {
      const playAttempt = video.play();

      if (!playAttempt) return;

      void playAttempt
        .then(() => {
          video.pause();
          render(renderedProgress);
        })
        .catch(() => undefined);
    };

    video.addEventListener("loadedmetadata", onMetadata);
    video.addEventListener("loadeddata", onMetadata);
    window.addEventListener("scroll", syncTarget, { passive: true });
    window.addEventListener("resize", syncTarget, { passive: true });
    window.addEventListener("touchstart", unlockVideo, { once: true, passive: true });
    reducedMotion.addEventListener("change", syncTarget);

    video.load();

    if (metadataReady) onMetadata();
    syncTarget();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      video.removeEventListener("loadedmetadata", onMetadata);
      video.removeEventListener("loadeddata", onMetadata);
      window.removeEventListener("scroll", syncTarget);
      window.removeEventListener("resize", syncTarget);
      window.removeEventListener("touchstart", unlockVideo);
      reducedMotion.removeEventListener("change", syncTarget);
    };
  }, []);

  return (
    <div className="cinematic-home">
      <section
        ref={stageRef}
        className="duel-scroll"
        aria-label="Interactive Dota 2 battle introduction"
      >
        <div className="duel-scroll__sticky">
          <video
            ref={videoRef}
            className="duel-scroll__video"
            muted
            playsInline
            preload="auto"
            poster="/media/highground-duel-poster.webp"
            aria-hidden="true"
            onError={() => {
              setVideoFailed(true);
              setReady(true);
            }}
          >
            <source src="/media/highground-duel-scroll.mp4" type="video/mp4" />
          </video>

          <div className="duel-scroll__colorwash" aria-hidden="true" />
          <div className="duel-scroll__grade" aria-hidden="true" />
          <div className="duel-scroll__vignette" aria-hidden="true" />
          <div className="duel-scroll__grain" aria-hidden="true" />

          <div className="duel-scroll__chrome" aria-hidden="true">
            <div className="duel-scroll__identity">
              <span className="duel-scroll__identity-mark"><Swords /></span>
              <span>
                <small>Highground intelligence</small>
                <strong>Rank operations</strong>
              </span>
            </div>

            <div className="duel-scroll__signal">
              <Signal />
              <span>{videoFailed ? "Static fallback" : ready ? "Sequence online" : "Syncing sequence"}</span>
            </div>
          </div>

          <div className="duel-scroll__scenes" aria-hidden="true">
            {beats.map((beat, index) => (
              <div
                key={beat.scene}
                ref={(element) => {
                  sceneRefs.current[index] = element;
                }}
                className="duel-scene"
                data-active={index === 0 ? "true" : "false"}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <i />
                <small>{beat.scene}</small>
              </div>
            ))}
          </div>

          <div className="duel-scroll__beats">
            {beats.map((beat, index) => (
              <div
                key={beat.title}
                ref={(element) => {
                  beatRefs.current[index] = element;
                }}
                className={`duel-beat duel-beat--${beat.align}`}
                aria-hidden={index === 0 ? "false" : "true"}
              >
                <div className="duel-beat__panel">
                  <div className="duel-beat__meta">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <i />
                    <small>{beat.kicker}</small>
                  </div>

                  <h1>{beat.title}</h1>
                  <p className="duel-beat__body">{beat.body}</p>

                  <div className="duel-beat__actions">
                    <Link href={beat.primary.href} className="duel-button duel-button--primary">
                      {beat.primary.label}<ArrowRight />
                    </Link>
                    <Link href={beat.secondary.href} className="duel-button duel-button--ghost">
                      {beat.secondary.label}<ArrowUpRight />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="duel-route-card" aria-label="Example rank route">
            <div className="duel-route-card__head">
              <span><Zap /> Live route</span>
              <small>EU West</small>
            </div>
            <div className="duel-route-card__route">
              <span><small>Current</small><strong>Legend III</strong></span>
              <i><ArrowRight /></i>
              <span><small>Target</small><strong>Ancient I</strong></span>
            </div>
            <div className="duel-route-card__tags">
              <span>Solo</span><span>Mid</span><span>Private</span>
            </div>
          </aside>

          <div className="duel-scroll__timeline" aria-hidden="true">
            <div className="duel-scroll__timeline-copy">
              <span ref={counterRef}>00</span><small>/ 100</small>
            </div>
            <div className="duel-scroll__timeline-track"><span ref={progressRef} /></div>
            <p>Scroll to direct the sequence</p>
          </div>

          <div className={`duel-scroll__loader${ready ? " is-ready" : ""}`} aria-live="polite">
            <span className="duel-scroll__loader-mark"><Swords /></span>
            <div><i /><i /><i /></div>
            <p>{videoFailed ? "Static preview active" : "Loading battle sequence"}</p>
          </div>
        </div>
      </section>

      <section className="command-deck">
        <div className="command-deck__aurora" aria-hidden="true" />
        <div className="command-deck__grid" aria-hidden="true" />

        <div className="container-shell command-deck__inner">
          <header className="command-deck__header">
            <div>
              <p className="command-deck__eyebrow"><Sparkles /> Choose your objective</p>
              <h2>A clearer route to the rank you want.</h2>
            </div>
            <div className="command-deck__intro">
              <span>01 — Configure</span>
              <p>Start with the result you need. Every service is configured around your current rank, region, schedule, and preferred delivery method.</p>
            </div>
          </header>

          <div className="command-deck__services">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <Link
                  key={service.href}
                  href={service.href}
                  className={`service-module service-module--${service.accent}`}
                >
                  <div className="service-module__top">
                    <span>{service.number}</span>
                    <span className="service-module__icon"><Icon /></span>
                  </div>
                  <div className="service-module__content">
                    <p>{service.meta}</p>
                    <h3>{service.title}</h3>
                    <div>{service.body}</div>
                  </div>
                  <span className="service-module__link">Open service <ArrowUpRight /></span>
                </Link>
              );
            })}
          </div>

          <div className="command-deck__trust">
            {trustItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title}>
                  <span><Icon /></span>
                  <div><strong>{item.title}</strong><small>{item.body}</small></div>
                  <Check />
                </div>
              );
            })}
          </div>

          <section className="command-cta">
            <div className="command-cta__signal" aria-hidden="true"><span /><span /><span /></div>
            <div>
              <p><Swords /> Ready when you are</p>
              <h2>Turn the next queue into a plan.</h2>
              <span>Configure your current rank, target, server, role, and delivery mode before checkout.</span>
            </div>
            <div className="command-cta__actions">
              <Link href="/pricing" className="duel-button duel-button--primary">
                Configure my order <ArrowRight />
              </Link>
              <Link href="/services/coaching" className="duel-button duel-button--ghost">
                Start with coaching <GraduationCap />
              </Link>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
