"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useId, useRef } from "react";

interface CoachingArtifactCardProps {
  eyebrow: string;
  title: string;
  description: string;
  bestFor: string;
  benefits: readonly string[];
  href: string;
  ctaLabel: string;
}

const BRICK_SRC = "/media/radiant-academy/painted-stone-brick.svg";

const masonryPieces = [
  "top-a",
  "top-b",
  "top-c",
  "top-d",
  "right-a",
  "right-b",
  "bottom-a",
  "bottom-b",
  "bottom-c",
  "bottom-d",
  "left-a",
  "left-b"
] as const;

function MasonryFrame() {
  return (
    <div className="coaching-artifact__masonry" aria-hidden="true">
      <div className="coaching-artifact__contact-shadow" />
      {masonryPieces.map((piece, index) => (
        <Image
          key={piece}
          className={`coaching-artifact__brick coaching-artifact__brick--${piece}`}
          src={BRICK_SRC}
          alt=""
          width={1000}
          height={563}
          priority={index < 4}
          draggable={false}
        />
      ))}
      <span className="coaching-artifact__moss coaching-artifact__moss--a" />
      <span className="coaching-artifact__moss coaching-artifact__moss--b" />
      <span className="coaching-artifact__moss coaching-artifact__moss--c" />
      <span className="coaching-artifact__moss coaching-artifact__moss--d" />
      <span className="coaching-artifact__fragment coaching-artifact__fragment--a" />
      <span className="coaching-artifact__fragment coaching-artifact__fragment--b" />
      <span className="coaching-artifact__fragment coaching-artifact__fragment--c" />
    </div>
  );
}

function SlatePanel({ id }: { id: string }) {
  return (
    <svg
      className="coaching-artifact__slate"
      viewBox="0 0 850 420"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`${id}-slate`} x1=".08" y1="0" x2=".94" y2="1">
          <stop stopColor="#31362f" />
          <stop offset=".38" stopColor="#20251f" />
          <stop offset=".72" stopColor="#141914" />
          <stop offset="1" stopColor="#0a0e0b" />
        </linearGradient>
        <linearGradient id={`${id}-edge`} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#aaa993" stopOpacity=".54" />
          <stop offset=".35" stopColor="#55594d" stopOpacity=".28" />
          <stop offset="1" stopColor="#070a08" stopOpacity=".9" />
        </linearGradient>
        <linearGradient id={`${id}-sweep`} x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#fff" stopOpacity="0" />
          <stop offset=".5" stopColor="#fff4c8" stopOpacity=".22" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <filter id={`${id}-grain`} x="-5%" y="-8%" width="110%" height="116%">
          <feTurbulence type="fractalNoise" baseFrequency=".035 .12" numOctaves="2" seed="17" result="noise" />
          <feColorMatrix
            in="noise"
            values=".35 0 0 0 .08  0 .38 0 0 .08  0 0 .31 0 .07  0 0 0 .28 0"
            result="grain"
          />
          <feBlend in="SourceGraphic" in2="grain" mode="multiply" />
        </filter>
      </defs>
      <path
        className="coaching-artifact__slate-shadow"
        d="M32 48 69 20l727 9 28 35-8 292-34 35-721 5-39-29Z"
        fill="#020403"
        transform="translate(0 13)"
      />
      <path
        d="M25 39 70 14l724 9 34 34-9 292-39 34-716 6-43-29Z"
        fill={`url(#${id}-slate)`}
        stroke={`url(#${id}-edge)`}
        strokeWidth="5"
        filter={`url(#${id}-grain)`}
      />
      <path
        d="m51 65 39-18 678 7 29 26-8 246-28 25-670 7-37-22Z"
        fill="none"
        stroke="#050806"
        strokeOpacity=".84"
        strokeWidth="13"
      />
      <path
        className="coaching-artifact__engraving"
        d="M145 96h186l16 12 16-12h278M145 318h184l18-12 18 12h277"
        fill="none"
        stroke="#9ca77d"
        strokeWidth="1.6"
      />
      <path
        className="coaching-artifact__engraving"
        d="m340 96 8-8 8 8-8 8Zm0 222 8-8 8 8-8 8Z"
        fill="#95a56f"
      />
      <path
        className="coaching-artifact__slate-cracks"
        d="m95 73 19 21-12 18 17 22-8 19m625 156 13 14-10 18 14 14M674 57l-11 19 12 14-17 19"
        fill="none"
        stroke="#080b08"
        strokeLinecap="round"
        strokeWidth="4"
      />
      <path
        className="coaching-artifact__light-sweep"
        d="m147 23 128 0 211 360-145 3Z"
        fill={`url(#${id}-sweep)`}
      />
    </svg>
  );
}

function ReplayCrest({ id }: { id: string }) {
  return (
    <svg
      className="coaching-artifact__crest-art"
      viewBox="0 0 310 340"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`${id}-crest`} x1=".12" y1="0" x2=".9" y2="1">
          <stop stopColor="#9d9982" />
          <stop offset=".2" stopColor="#575a4d" />
          <stop offset=".62" stopColor="#292e28" />
          <stop offset="1" stopColor="#111611" />
        </linearGradient>
        <linearGradient id={`${id}-rune`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#e7edc7" />
          <stop offset=".45" stopColor="#9fba79" />
          <stop offset="1" stopColor="#61764e" />
        </linearGradient>
        <filter id={`${id}-crest-shadow`} x="-35%" y="-30%" width="170%" height="190%">
          <feDropShadow dx="0" dy="18" stdDeviation="12" floodColor="#000" floodOpacity=".82" />
        </filter>
        <filter id={`${id}-rune-glow`} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter={`url(#${id}-crest-shadow)`}>
        <path
          d="m55 39 67-27 84 10 48 44-1 128-35 72-71 57-76-51-34-83 8-108Z"
          fill={`url(#${id}-crest)`}
          stroke="#b6b298"
          strokeOpacity=".58"
          strokeWidth="4"
        />
        <path
          d="m78 67 50-19 62 8 35 31-2 95-26 53-51 42-52-37-25-61 7-82Z"
          fill="#151b16"
          stroke="#4d5746"
          strokeWidth="8"
        />
        <path
          d="m92 83 39-14 51 6 27 24-2 72-21 43-40 34-39-29-19-48 5-62Z"
          fill="none"
          stroke="#9eae7d"
          strokeOpacity=".52"
          strokeWidth="3"
        />
      </g>
      <g
        className="coaching-artifact__crest-rune"
        fill="none"
        stroke={`url(#${id}-rune)`}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#${id}-rune-glow)`}
      >
        <circle cx="148" cy="153" r="54" strokeWidth="5" />
        <path d="m112 174 25-51 20 27 31-40-20 71-29-25Z" strokeWidth="7" />
        <path d="m110 112 16 8m58 70 14 8m-91 14 18-7m62-96 13-10" strokeWidth="3" opacity=".58" />
      </g>
      <path d="m48 83 28-9-7 27-27 13Zm176-39 31 17-4 27-18-12ZM75 260l24 17-21 2Z" fill="#151a15" />
    </svg>
  );
}

function RuneTab({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 300 82" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-tab`} x1=".08" y1="0" x2=".92" y2="1">
          <stop stopColor="#6c6d5c" />
          <stop offset=".42" stopColor="#353b33" />
          <stop offset="1" stopColor="#171d18" />
        </linearGradient>
      </defs>
      <path d="m20 17 23-11 222 5 24 17-8 37-25 11-218-4L11 54Z" fill="#020403" transform="translate(0 5)" />
      <path d="m15 11 28-9 221 5 25 17-9 34-25 11-220-4L7 50Z" fill={`url(#${id}-tab)`} stroke="#aaa98d" strokeOpacity=".5" strokeWidth="2" />
      <path className="coaching-artifact__cta-rune" d="m241 24 15 15-15 15m13-15h-35" fill="none" stroke="#dbe9b7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" />
    </svg>
  );
}

export function CoachingArtifactCard({
  eyebrow,
  title,
  description,
  bestFor,
  benefits,
  href,
  ctaLabel
}: CoachingArtifactCardProps) {
  const reactId = useId();
  const id = `coaching-stone-${reactId.replaceAll(":", "")}`;
  const articleRef = useRef<HTMLElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const node = articleRef.current;
    if (!node) return;

    if (!("IntersectionObserver" in window)) {
      node.dataset.revealed = "true";
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        node.dataset.revealed = "true";
        observer.disconnect();
      },
      { threshold: 0.16 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(
    () => () => {
      if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current);
    },
    []
  );

  const applyPointerPosition = useCallback((node: HTMLElement) => {
    const { x, y } = pointerRef.current;
    node.style.setProperty("--artifact-tilt-x", `${(-y * 1.15).toFixed(2)}deg`);
    node.style.setProperty("--artifact-tilt-y", `${(x * 1.55).toFixed(2)}deg`);
    node.style.setProperty("--artifact-frame-x", `${(x * 2.1).toFixed(2)}px`);
    node.style.setProperty("--artifact-frame-y", `${(y * 1.6).toFixed(2)}px`);
    node.style.setProperty("--artifact-panel-x", `${(x * 3.4).toFixed(2)}px`);
    node.style.setProperty("--artifact-panel-y", `${(y * 2.4).toFixed(2)}px`);
    node.style.setProperty("--artifact-crest-x", `${(x * 5.1).toFixed(2)}px`);
    node.style.setProperty("--artifact-crest-y", `${(y * 4.2).toFixed(2)}px`);
    node.style.setProperty("--artifact-light-shift", `${(x * 70).toFixed(1)}px`);
  }, []);

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
    const node = event.currentTarget;
    const rect = node.getBoundingClientRect();
    pointerRef.current = {
      x: ((event.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((event.clientY - rect.top) / rect.height - 0.5) * 2
    };
    if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = requestAnimationFrame(() => applyPointerPosition(node));
  };

  const handlePointerLeave = (event: React.PointerEvent<HTMLElement>) => {
    pointerRef.current = { x: 0, y: 0 };
    const node = event.currentTarget;
    [
      "--artifact-tilt-x",
      "--artifact-tilt-y",
      "--artifact-frame-x",
      "--artifact-frame-y",
      "--artifact-panel-x",
      "--artifact-panel-y",
      "--artifact-crest-x",
      "--artifact-crest-y",
      "--artifact-light-shift"
    ].forEach((property) => node.style.setProperty(property, property.includes("tilt") ? "0deg" : "0px"));
  };

  return (
    <article
      ref={articleRef}
      className="coaching-artifact"
      data-revealed="false"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <MasonryFrame />

      <div className="coaching-artifact__panel">
        <SlatePanel id={id} />
      </div>

      <div className="coaching-artifact__crest">
        <ReplayCrest id={id} />
      </div>

      <div className="coaching-artifact__content">
        <p className="coaching-artifact__eyebrow">{eyebrow}</p>
        <h3>{title}</h3>
        <span className="coaching-artifact__title-ornament" aria-hidden="true">
          <i />
          <b>◇</b>
          <i />
        </span>
        <p className="coaching-artifact__description">{description}</p>
        <p className="coaching-artifact__best-for">
          <span>Best for</span>
          {bestFor}
        </p>
        <ul className="coaching-artifact__benefits">
          {benefits.slice(0, 3).map((benefit) => (
            <li key={benefit}>
              <span aria-hidden="true">◇</span>
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      <Link className="coaching-artifact__cta" href={href}>
        <RuneTab id={id} />
        <span>{ctaLabel}</span>
      </Link>
    </article>
  );
}
