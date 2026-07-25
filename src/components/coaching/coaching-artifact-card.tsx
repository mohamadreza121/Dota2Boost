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
  "r1-a", "r1-b", "r1-c",
  "r2-a", "r2-b", "r2-c",
  "r3-a", "r3-b", "r3-c",
  "r4-a", "r4-b", "r4-c",
  "r5-a", "r5-b", "r5-c"
] as const;

function MasonryWall() {
  return (
    <div className="coaching-artifact__masonry" aria-hidden="true">
      <div className="coaching-artifact__wall-shadow" />

      {masonryPieces.map((piece, index) => (
        <Image
          key={piece}
          className={`coaching-artifact__brick coaching-artifact__brick--${piece}`}
          src={BRICK_SRC}
          alt=""
          width={1000}
          height={563}
          priority={index < 3}
          draggable={false}
        />
      ))}

      <span className="coaching-artifact__joint-moss coaching-artifact__joint-moss--a" />
      <span className="coaching-artifact__joint-moss coaching-artifact__joint-moss--b" />
      <span className="coaching-artifact__joint-moss coaching-artifact__joint-moss--c" />
      <span className="coaching-artifact__joint-moss coaching-artifact__joint-moss--d" />
      <span className="coaching-artifact__wall-fragment coaching-artifact__wall-fragment--a" />
      <span className="coaching-artifact__wall-fragment coaching-artifact__wall-fragment--b" />
      <span className="coaching-artifact__wall-fragment coaching-artifact__wall-fragment--c" />
      <span className="coaching-artifact__material-light" />
    </div>
  );
}

function CarvedOrnaments() {
  return (
    <svg
      className="coaching-artifact__carved-ornaments"
      viewBox="0 0 1200 650"
      aria-hidden="true"
      focusable="false"
    >
      <g className="coaching-artifact__groove coaching-artifact__groove--shadow" fill="none">
        <path d="M435 204h164l14 11 14-11h333" />
        <path d="M436 487h162l15-11 15 11h332" />
        <path d="M354 237v-25l18-18M999 237v-25l-18-18" />
        <path d="M355 458v23l18 18M998 458v23l-18 18" />
      </g>
      <g className="coaching-artifact__groove coaching-artifact__groove--edge" fill="none" transform="translate(0 2)">
        <path d="M435 204h164l14 11 14-11h333" />
        <path d="M436 487h162l15-11 15 11h332" />
        <path d="M354 237v-25l18-18M999 237v-25l-18-18" />
        <path d="M355 458v23l18 18M998 458v23l-18 18" />
      </g>
      <g className="coaching-artifact__carved-sigils">
        <path d="m605 204 8-8 8 8-8 8Z" />
        <path d="m605 487 8-8 8 8-8 8Z" />
      </g>
      <g className="coaching-artifact__wall-cracks" fill="none">
        <path d="m330 166 18 19-11 17 16 20-8 26" />
        <path d="m1032 274-17 18 12 21-16 18 9 27" />
        <path d="m842 512 14 15-10 20 15 17" />
        <path d="m447 521-11 17 13 16-9 18" />
      </g>
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
    node.style.setProperty("--artifact-wall-x", `${(x * 2.2).toFixed(2)}px`);
    node.style.setProperty("--artifact-wall-y", `${(y * 1.6).toFixed(2)}px`);
    node.style.setProperty("--artifact-etch-x", `${(x * 3.3).toFixed(2)}px`);
    node.style.setProperty("--artifact-etch-y", `${(y * 2.4).toFixed(2)}px`);
    node.style.setProperty("--artifact-crest-x", `${(x * 5.1).toFixed(2)}px`);
    node.style.setProperty("--artifact-crest-y", `${(y * 4.2).toFixed(2)}px`);
    node.style.setProperty("--artifact-light-x", `${(x * 74).toFixed(1)}px`);
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
      "--artifact-wall-x",
      "--artifact-wall-y",
      "--artifact-etch-x",
      "--artifact-etch-y",
      "--artifact-crest-x",
      "--artifact-crest-y",
      "--artifact-light-x"
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
      <MasonryWall />
      <CarvedOrnaments />

      <div className="coaching-artifact__crest">
        <ReplayCrest id={id} />
      </div>

      <div className="coaching-artifact__content">
        <p className="coaching-artifact__eyebrow">{eyebrow}</p>
        <h3 data-engraving={title}>{title}</h3>
        <span className="coaching-artifact__title-ornament" aria-hidden="true">
          <i />
          <b>◇</b>
          <i />
        </span>
        <p className="coaching-artifact__description" data-engraving={description}>
          {description}
        </p>
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
        <span>{ctaLabel}</span>
        <span className="coaching-artifact__cta-arrow" aria-hidden="true">
          <i />
          <b>›</b>
        </span>
      </Link>
    </article>
  );
}
