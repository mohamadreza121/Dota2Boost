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
  start: number;
  end: number;
  align: BeatAlignment;
  title: string;
  body: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
};

const beats: readonly Beat[] = [
  {
    start: 0,
    end: 0.235,
    align: "left",
    title: "Choose the rank worth forging.",
    body: "Set your current medal, target, server, role, and delivery style. The route is defined before the campaign begins.",
    primary: { label: "Forge rank route", href: "/pricing" },
    secondary: { label: "Explore contracts", href: "/services" }
  },
  {
    start: 0.19,
    end: 0.435,
    align: "right",
    title: "Every bracket has a different fight.",
    body: "Region, role, party eligibility, hero pool, and queue conditions shape the campaign before the first match is scheduled.",
    primary: { label: "See the campaign", href: "/how-it-works" },
    secondary: { label: "Meet the roster", href: "/boosters" }
  },
  {
    start: 0.39,
    end: 0.635,
    align: "left",
    title: "Solo direction or Duo execution.",
    body: "Choose Solo Assist, Duo Queue, calibration, fixed wins, behavior recovery, or a focused coaching session.",
    primary: { label: "Open MMR boost", href: "/services/mmr-boost" },
    secondary: { label: "Compare services", href: "/services" }
  },
  {
    start: 0.59,
    end: 0.835,
    align: "right",
    title: "Your account stays in your hands.",
    body: "No passwords, Steam Guard codes, or remote access. Track scheduling, messages, matches, and milestones in one private workspace.",
    primary: { label: "Review delivery", href: "/how-it-works" },
    secondary: { label: "Read verified reviews", href: "/reviews" }
  },
  {
    start: 0.79,
    end: 1,
    align: "left",
    title: "Forge the route. Siege the rank.",
    body: "Build a live server-priced campaign and move through every checkpoint with the scope visible.",
    primary: { label: "Start the campaign", href: "/pricing" },
    secondary: { label: "Start with coaching", href: "/services/coaching" }
  }
];

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

export function ForgeHero() {
  const stageRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const beatRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(
      "(min-width: 769px) and (prefers-reduced-motion: no-preference)"
    );
    const sync = () => setVideoEnabled(media.matches);

    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    const video = videoRef.current;

    if (!stage) return;

    if (!videoEnabled) {
      stage.style.setProperty("--forge-hero-progress", "0");
      beatRefs.current.forEach((element, index) => {
        if (!element) return;
        element.style.opacity = index === 0 ? "1" : "0";
        element.style.pointerEvents = index === 0 ? "auto" : "none";
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
    let metadataReady = Boolean(
      video && video.readyState >= HTMLMediaElement.HAVE_METADATA
    );
    let lastVideoTime = -1;

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

        element.style.opacity = opacity.toFixed(3);
        element.style.setProperty(
          "--beat-shift",
          `${(1 - opacity) * 58 * direction}px`
        );
        element.style.setProperty("--beat-lift", `${(1 - opacity) * 18}px`);
        element.style.setProperty("--beat-blur", `${(1 - opacity) * 7}px`);
        element.style.setProperty("--beat-scale", `${0.97 + opacity * 0.03}`);
        element.style.pointerEvents = opacity > 0.72 ? "auto" : "none";
        element.inert = opacity <= 0.72;
        element.setAttribute("aria-hidden", opacity > 0.1 ? "false" : "true");
      });

    };

    const render = (progress: number) => {
      stage.style.setProperty("--forge-hero-progress", progress.toFixed(4));
      stage.style.setProperty(
        "--video-x",
        `${50 + Math.sin(progress * Math.PI * 2) * 1.25}%`
      );
      stage.style.setProperty(
        "--video-shift",
        `${(progress - 0.5) * -2.4}vw`
      );
      stage.style.setProperty(
        "--video-scale",
        `${1 + Math.sin(progress * Math.PI) * 0.025}`
      );
      stage.style.setProperty(
        "--forge-fire-intensity",
        `${0.72 + Math.sin(progress * Math.PI * 5) * 0.12}`
      );

      if (counterRef.current) {
        counterRef.current.textContent = String(Math.round(progress * 100)).padStart(2, "0");
      }

      renderBeats(progress);

      if (
        video &&
        metadataReady &&
        Number.isFinite(video.duration) &&
        video.duration > 0
      ) {
        const desiredTime = progress * Math.max(0, video.duration - 0.045);

        if (Math.abs(desiredTime - lastVideoTime) >= 1 / 72) {
          try {
            video.currentTime = desiredTime;
            lastVideoTime = desiredTime;
          } catch {
            // Safari may reject a seek until the media element is initialized.
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
      const headerHeight = Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--header-height")
      ) || 0;
      const start = stage.offsetTop - headerHeight;
      const viewport = Math.max(1, window.innerHeight - headerHeight);
      const travel = Math.max(1, stage.offsetHeight - viewport);

      targetProgress = clamp((window.scrollY - start) / travel);
      requestTick();
    };

    const onMetadata = () => {
      if (!video) return;
      metadataReady = true;
      video.pause();
      setReady(true);
      render(renderedProgress);
    };

    const unlockVideo = () => {
      if (!video) return;
      const playAttempt = video.play();
      if (!playAttempt) return;

      void playAttempt
        .then(() => {
          video.pause();
          render(renderedProgress);
        })
        .catch(() => undefined);
    };

    video?.addEventListener("loadedmetadata", onMetadata);
    video?.addEventListener("loadeddata", onMetadata);
    window.addEventListener("scroll", syncTarget, { passive: true });
    window.addEventListener("resize", syncTarget, { passive: true });
    window.addEventListener("touchstart", unlockVideo, { once: true, passive: true });
    reducedMotion.addEventListener("change", syncTarget);

    if (video && videoEnabled) {
      video.load();
      if (metadataReady) onMetadata();
    }

    syncTarget();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      video?.removeEventListener("loadedmetadata", onMetadata);
      video?.removeEventListener("loadeddata", onMetadata);
      window.removeEventListener("scroll", syncTarget);
      window.removeEventListener("resize", syncTarget);
      window.removeEventListener("touchstart", unlockVideo);
      reducedMotion.removeEventListener("change", syncTarget);
    };
  }, [videoEnabled]);

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
          <Image
            src="/media/dire-forge/dire-forge-poster.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className={`forge-hero__poster${ready && videoEnabled && !videoFailed ? " is-superseded" : ""}`}
          />
          {videoEnabled ? (
            <video
              ref={videoRef}
              className={`forge-hero__video${ready && !videoFailed ? " is-ready" : ""}`}
              muted
              playsInline
              preload="auto"
              poster="/media/dire-forge/dire-forge-poster.webp"
              onError={() => {
                setVideoFailed(true);
                setReady(true);
              }}
            >
              <source
                src="/media/dire-forge/dire-forge-scroll.mp4"
                type="video/mp4"
              />
            </video>
          ) : null}
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
                key={beat.title}
                ref={(element) => {
                  beatRefs.current[index] = element;
                  if (element) element.inert = index !== 0;
                }}
                className={`forge-beat forge-beat--${beat.align}`}
                aria-hidden={index === 0 ? "false" : "true"}
              >
                <div className="forge-beat__panel">
                  <Heading>{beat.title}</Heading>
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

        {videoEnabled ? (
          <div className={`forge-hero__loader${ready ? " is-ready" : ""}`} aria-live="polite">
            <span><Swords /></span>
            <div><i /><i /><i /></div>
            <p>{videoFailed ? "Static battlefield active" : "Igniting battlefield"}</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
