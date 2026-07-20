"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Crosshair,
  GraduationCap,
  Route,
  ShieldCheck,
  Sparkles,
  Swords,
  Trophy
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const beats = [
  {
    start: 0,
    end: 0.22,
    align: "left",
    kicker: "Highground / Dota 2 rank services",
    title: "Your next rank is not luck.",
    body: "Build a private climb route around your medal, server, role, and preferred delivery style.",
    primary: { label: "Build my rank route", href: "/pricing" },
    secondary: { label: "Explore services", href: "/services" }
  },
  {
    start: 0.18,
    end: 0.43,
    align: "right",
    kicker: "01 / Read the fight",
    title: "The outcome is decided before the first spell lands.",
    body: "Replay analysis and role-specific coaching turn positioning, map reads, and decision timing into repeatable wins.",
    primary: { label: "Book coaching", href: "/services/coaching" },
    secondary: { label: "How it works", href: "/how-it-works" }
  },
  {
    start: 0.39,
    end: 0.66,
    align: "left",
    kicker: "02 / Execute under pressure",
    title: "Mechanics matter. Consistency climbs.",
    body: "Choose Solo delivery, Duo Queue, calibration, behavior score recovery, or fixed-win packages with clear progress tracking.",
    primary: { label: "View MMR boost", href: "/services/mmr-boost" },
    secondary: { label: "Meet the roster", href: "/boosters" }
  },
  {
    start: 0.62,
    end: 0.86,
    align: "right",
    kicker: "03 / Control the tempo",
    title: "Private delivery. Clear milestones. No guessing.",
    body: "Follow your order from a secure workspace, message your assigned expert, and stay in control of scheduling and preferences.",
    primary: { label: "See the process", href: "/how-it-works" },
    secondary: { label: "Read reviews", href: "/reviews" }
  },
  {
    start: 0.82,
    end: 1,
    align: "center",
    kicker: "The decisive moment",
    title: "Take the high ground.",
    body: "Choose the result you want. We will build the route to reach it.",
    primary: { label: "Start my climb", href: "/pricing" },
    secondary: { label: "Talk to a coach", href: "/services/coaching" }
  }
] as const;

const services = [
  {
    number: "01",
    icon: Route,
    title: "MMR Boost",
    body: "Select current MMR, target medal, server, and Solo or Duo delivery.",
    href: "/services/mmr-boost",
    meta: "Custom rank route"
  },
  {
    number: "02",
    icon: Crosshair,
    title: "Calibration",
    body: "Structured five- or ten-match calibration blocks with progress visibility.",
    href: "/services/mmr-calibration",
    meta: "5 or 10 matches"
  },
  {
    number: "03",
    icon: GraduationCap,
    title: "Coaching",
    body: "Replay review, live sessions, hero pool planning, and role development.",
    href: "/services/coaching",
    meta: "Role-specific training"
  }
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
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    const video = videoRef.current;
    if (!stage || !video) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let targetProgress = 0;
    let renderedProgress = 0;
    let frame = 0;
    let running = false;
    let metadataReady = video.readyState >= 1;
    let lastVideoTime = -1;

    const setBeatStyles = (progress: number) => {
      beatRefs.current.forEach((element, index) => {
        if (!element) return;
        const beat = beats[index];
        const fadeWindow = index === beats.length - 1 ? 0.075 : 0.065;
        const fadeIn = clamp((progress - beat.start) / fadeWindow);
        const fadeOut = clamp((beat.end - progress) / fadeWindow);
        const opacity = Math.min(fadeIn, fadeOut);
        const direction = beat.align === "right" ? -1 : 1;
        const shift = (1 - opacity) * 34;
        element.style.opacity = opacity.toFixed(3);
        element.style.setProperty("--beat-shift", `${shift * direction}px`);
        element.style.pointerEvents = opacity > 0.72 ? "auto" : "none";
        element.setAttribute("aria-hidden", opacity > 0.1 ? "false" : "true");
      });
    };

    const syncTarget = () => {
      const header = Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--header-height")
      ) || 0;
      const start = stage.offsetTop - header;
      const viewport = Math.max(1, window.innerHeight - header);
      const travel = Math.max(1, stage.offsetHeight - viewport);
      targetProgress = clamp((window.scrollY - start) / travel);
      requestTick();
    };

    const render = (progress: number) => {
      stage.style.setProperty("--duel-progress", progress.toFixed(4));
      stage.style.setProperty("--video-x", `${50 + clamp((progress - 0.42) / 0.38) * 7}%`);

      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${progress})`;
      }
      if (counterRef.current) {
        counterRef.current.textContent = String(Math.round(progress * 100)).padStart(2, "0");
      }

      setBeatStyles(progress);

      if (metadataReady && Number.isFinite(video.duration) && video.duration > 0) {
        const desiredTime = progress * Math.max(0, video.duration - 0.045);
        if (Math.abs(desiredTime - lastVideoTime) >= 1 / 80) {
          video.currentTime = desiredTime;
          lastVideoTime = desiredTime;
        }
      }
    };

    const tick = () => {
      const difference = targetProgress - renderedProgress;
      renderedProgress = reducedMotion.matches
        ? targetProgress
        : Math.abs(difference) < 0.00035
          ? targetProgress
          : renderedProgress + difference * 0.16;

      render(renderedProgress);

      if (Math.abs(targetProgress - renderedProgress) > 0.00035) {
        frame = window.requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };

    const requestTick = () => {
      if (running) return;
      running = true;
      frame = window.requestAnimationFrame(tick);
    };

    const onMetadata = () => {
      metadataReady = true;
      video.pause();
      setReady(true);
      render(renderedProgress);
    };

    const unlockVideo = () => {
      const promise = video.play();
      if (promise) {
        promise
          .then(() => {
            video.pause();
            render(renderedProgress);
          })
          .catch(() => undefined);
      }
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
      window.cancelAnimationFrame(frame);
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
      <section ref={stageRef} className="duel-scroll" aria-label="Interactive Dota 2 battle introduction">
        <div className="duel-scroll__sticky">
          <video
            ref={videoRef}
            className="duel-scroll__video"
            muted
            playsInline
            preload="auto"
            poster="/media/highground-duel-poster.webp"
            aria-hidden="true"
          >
            <source src="/media/highground-duel-scroll.mp4" type="video/mp4" />
          </video>

          <div className="duel-scroll__grade" aria-hidden="true" />
          <div className="duel-scroll__vignette" aria-hidden="true" />
          <div className="duel-scroll__scanlines" aria-hidden="true" />

          <div className="duel-scroll__hud" aria-hidden="true">
            <div className="duel-scroll__hud-brand">
              <span className="duel-scroll__hud-rune"><Swords /></span>
              <span><small>Live contract system</small><strong>Highground Command</strong></span>
            </div>
            <div className="duel-scroll__hud-status">
              <span className={ready ? "is-ready" : ""} />
              {ready ? "Sequence linked" : "Loading battle sequence"}
            </div>
          </div>

          <div className="duel-scroll__beats">
            {beats.map((beat, index) => (
              <div
                key={beat.title}
                ref={(element) => { beatRefs.current[index] = element; }}
                className={`duel-beat duel-beat--${beat.align}`}
                aria-hidden={index === 0 ? "false" : "true"}
              >
                <div className="duel-beat__line" aria-hidden="true" />
                <p className="duel-beat__kicker">{beat.kicker}</p>
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
            ))}
          </div>

          <div className="duel-scroll__timeline" aria-hidden="true">
            <div className="duel-scroll__timeline-copy">
              <span ref={counterRef}>00</span><small>/ 100</small>
            </div>
            <div className="duel-scroll__timeline-track"><span ref={progressRef} /></div>
            <p>Scroll to control the fight</p>
          </div>

          <div className={`duel-scroll__loader${ready ? " is-ready" : ""}`} aria-live="polite">
            <span />
            <p>{ready ? "Battle sequence ready" : "Preparing battle sequence"}</p>
          </div>
        </div>
      </section>

      <section className="climb-deck">
        <div className="climb-deck__glow climb-deck__glow--radiant" aria-hidden="true" />
        <div className="climb-deck__glow climb-deck__glow--dire" aria-hidden="true" />
        <div className="container-shell climb-deck__inner">
          <header className="climb-deck__header">
            <div>
              <p className="climb-deck__eyebrow"><Sparkles /> Choose your objective</p>
              <h2>One account. One clear route upward.</h2>
            </div>
            <p>Start with the result you need. Every service is configured around your current rank, region, schedule, and preferred delivery method.</p>
          </header>

          <div className="climb-deck__services">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Link key={service.href} href={service.href} className="objective-card">
                  <div className="objective-card__top"><span>{service.number}</span><Icon /></div>
                  <p>{service.meta}</p>
                  <h3>{service.title}</h3>
                  <div className="objective-card__body">{service.body}</div>
                  <span className="objective-card__link">Open contract <ArrowUpRight /></span>
                </Link>
              );
            })}
          </div>

          <div className="climb-deck__trust">
            <div><ShieldCheck /><span><strong>Private by default</strong><small>Secure delivery workspace</small></span></div>
            <div><Trophy /><span><strong>Progress visible</strong><small>Milestones and updates</small></span></div>
            <div><Check /><span><strong>Player-controlled</strong><small>Preferences stay yours</small></span></div>
          </div>
        </div>
      </section>

      <section className="final-command">
        <div className="final-command__grid" aria-hidden="true" />
        <div className="container-shell final-command__inner">
          <p><Swords /> Ready for the next medal?</p>
          <h2>Stop queuing without a plan.</h2>
          <div className="final-command__copy">
            <span>Configure your target, compare delivery modes, and see your route before placing an order.</span>
            <div>
              <Link href="/pricing" className="duel-button duel-button--primary">Build rank route <ArrowRight /></Link>
              <Link href="/services/coaching" className="duel-button duel-button--ghost">Start with coaching <GraduationCap /></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
