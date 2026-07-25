"use client";

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

type StoneTone = "ash" | "deep" | "lichen" | "pale";

interface StonePiece {
  d: string;
  tone: StoneTone;
  className?: string;
}

const desktopStones: StonePiece[] = [
  { d: "M62 112 78 82l34-10 42 7 21-8 45 10 17 31-8 65-25 20-55-8-32 10-44-12-23 8-32-19Z", tone: "pale" },
  { d: "m222 96 20-26 47-5 22 10 54-7 36 20 4 68-27 26-58-7-39 9-54-11-20 6-34-19Z", tone: "ash" },
  { d: "m397 89 24-24 56 2 21 9 58-5 25 18 7 72-31 22-52-10-35 8-52-9-25 5-24-16Z", tone: "pale" },
  { d: "m579 90 23-18 62-4 26 11 54-7 30 22-2 66-22 21-62-8-36 8-51-9-26 7-27-18Z", tone: "lichen" },
  { d: "m755 91 26-21 55 2 29 10 49-4 34 25-6 66-28 20-53-9-43 7-46-7-25 6-29-21Z", tone: "ash" },
  { d: "m925 99 30-23 54 4 25-7 49 11 35 32-8 61-28 19-51-5-37 7-43-13-34 8-30-19Z", tone: "pale" },
  { d: "m1067 122 27-20 47 9 26 29-5 48 11 31-17 44 8 39-30 30-57-4-16-26 8-48-14-27 8-40Z", tone: "deep" },
  { d: "m64 176 31-15 50 9 27 28-5 51 13 24-14 49 4 38-28 26-56-5-22-20 6-51-14-32 9-39Z", tone: "ash" },
  { d: "m50 306 28-21 55 6 27 24-3 49 13 28-18 43-1 42-31 22-55-9-20-23 7-42-13-33 8-40Z", tone: "pale" },
  { d: "m55 432 27-22 52 7 28 21-1 43 16 27-18 36-1 31-31 24-49-6-27-23 4-38-11-30 9-37Z", tone: "deep" },
  { d: "m77 505 27-20 52 8 23-9 48 16 18 32-9 51-30 20-52-5-33 7-46-12-28 7-31-21Z", tone: "pale" },
  { d: "m222 503 25-16 58 5 24-8 52 13 23 32-7 50-27 20-53-8-39 8-46-10-30 7-32-22Z", tone: "deep" },
  { d: "m397 505 25-18 56 7 24-9 54 12 25 33-8 52-27 18-57-8-36 8-47-11-29 7-31-21Z", tone: "ash" },
  { d: "m579 506 28-20 55 6 26-8 52 14 25 31-6 51-29 21-54-9-40 8-45-10-30 6-30-20Z", tone: "pale" },
  { d: "m754 503 28-17 58 7 25-9 50 13 27 31-5 52-30 19-55-7-39 7-47-11-30 7-30-22Z", tone: "deep" },
  { d: "m927 499 28-15 55 7 24-8 48 12 34 31-7 50-28 20-53-5-38 5-43-12-33 8-31-23Z", tone: "pale" },
  { d: "m1069 462 25-17 46 8 25 25-4 46 13 26-15 35 5 31-31 25-52-5-17-25 7-37-13-27 7-33Z", tone: "ash" },
  { d: "m1082 326 25-18 45 8 24 26-4 43 12 25-14 38 5 35-30 25-51-6-18-23 7-40-13-29 8-34Z", tone: "pale" }
];

const mobileStones: StonePiece[] = [
  { d: "M53 98 72 67l52-8 31 11 47-7 31 24-7 83-32 25-52-8-39 10-52-12-30 7-36-21Z", tone: "pale" },
  { d: "m224 83 28-25 62 4 31 11 58-6 35 28-8 78-34 22-56-9-45 8-51-10-32 5-38-23Z", tone: "ash" },
  { d: "m430 86 27-22 59 4 28 11 53-4 44 27-9 75-35 23-54-8-44 8-50-11-30 6-40-25Z", tone: "lichen" },
  { d: "m55 169 31-17 52 10 28 28-5 80 16 31-19 54 3 42-32 27-56-8-21-27 7-70-13-39 9-45Z", tone: "ash" },
  { d: "m47 339 31-22 53 8 28 27-4 75 16 35-19 48 2 43-31 26-56-8-23-27 7-65-13-41 10-43Z", tone: "pale" },
  { d: "m49 520 29-22 54 9 26 28-3 72 16 34-18 52 1 43-31 25-57-7-22-28 7-65-13-39 9-45Z", tone: "deep" },
  { d: "m52 698 29-21 53 8 27 28-4 75 17 33-19 50 3 46-34 25-53-8-22-27 6-68-13-39 8-42Z", tone: "pale" },
  { d: "m64 830 27-22 57 8 26-9 52 15 29 33-8 66-31 23-55-8-39 8-48-12-31 7-32-21Z", tone: "ash" },
  { d: "m229 832 28-20 59 7 27-9 54 15 29 31-7 66-33 22-55-9-43 9-49-12-31 6-33-21Z", tone: "pale" },
  { d: "m431 831 30-19 57 7 28-9 52 14 38 33-9 64-34 22-54-8-42 7-48-11-34 7-35-23Z", tone: "deep" },
  { d: "m577 690 27-20 48 8 25 29-5 70 13 36-17 48 4 42-30 28-51-8-18-27 7-63-13-37 7-39Z", tone: "ash" },
  { d: "m588 506 26-19 45 8 24 27-4 72 13 34-17 48 3 42-29 27-50-8-18-27 6-65-12-34 7-40Z", tone: "pale" },
  { d: "m587 326 28-20 44 8 25 26-5 72 13 35-17 48 3 41-30 28-50-8-18-26 6-65-12-35 8-41Z", tone: "deep" },
  { d: "m578 167 27-19 47 8 24 27-5 70 14 35-18 47 4 42-30 27-50-7-18-27 6-63-13-36 8-41Z", tone: "pale" }
];

function StoneDefs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-stone-ash`} x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#8b8a74" />
        <stop offset=".24" stopColor="#595b4d" />
        <stop offset=".62" stopColor="#30342c" />
        <stop offset="1" stopColor="#171b17" />
      </linearGradient>
      <linearGradient id={`${id}-stone-deep`} x1=".12" y1="0" x2=".85" y2="1">
        <stop stopColor="#606152" />
        <stop offset=".34" stopColor="#3c4036" />
        <stop offset=".72" stopColor="#242820" />
        <stop offset="1" stopColor="#121611" />
      </linearGradient>
      <linearGradient id={`${id}-stone-lichen`} x1=".1" y1="0" x2=".9" y2="1">
        <stop stopColor="#82836b" />
        <stop offset=".38" stopColor="#515745" />
        <stop offset=".7" stopColor="#30372b" />
        <stop offset="1" stopColor="#171c15" />
      </linearGradient>
      <linearGradient id={`${id}-stone-pale`} x1=".08" y1="0" x2=".9" y2="1">
        <stop stopColor="#a4a18a" />
        <stop offset=".25" stopColor="#747564" />
        <stop offset=".65" stopColor="#3e4238" />
        <stop offset="1" stopColor="#1d211b" />
      </linearGradient>
      <linearGradient id={`${id}-slate`} x1="0" y1="0" x2=".9" y2="1">
        <stop stopColor="#3d4438" />
        <stop offset=".24" stopColor="#252c24" />
        <stop offset=".7" stopColor="#171d18" />
        <stop offset="1" stopColor="#0c110d" />
      </linearGradient>
      <linearGradient id={`${id}-moss`} x1="0" y1="0" x2="0" y2="1">
        <stop stopColor="#86941d" />
        <stop offset=".4" stopColor="#4c6011" />
        <stop offset="1" stopColor="#172407" />
      </linearGradient>
      <linearGradient id={`${id}-rune`} x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#e4f4a6" />
        <stop offset=".45" stopColor="#9bc96f" />
        <stop offset="1" stopColor="#4e713a" />
      </linearGradient>
      <radialGradient id={`${id}-dust`}>
        <stop stopColor="#d5d2a5" stopOpacity=".2" />
        <stop offset="1" stopColor="#d5d2a5" stopOpacity="0" />
      </radialGradient>
      <filter id={`${id}-shadow`} x="-25%" y="-30%" width="150%" height="170%" colorInterpolationFilters="sRGB">
        <feDropShadow dx="0" dy="20" stdDeviation="15" floodColor="#000" floodOpacity=".86" />
      </filter>
      <filter id={`${id}-contact`} x="-20%" y="-20%" width="140%" height="150%" colorInterpolationFilters="sRGB">
        <feDropShadow dx="0" dy="7" stdDeviation="5" floodColor="#000" floodOpacity=".9" />
      </filter>
      <filter id={`${id}-surface`} x="-6%" y="-8%" width="112%" height="116%">
        <feTurbulence type="fractalNoise" baseFrequency=".025 .08" numOctaves="2" seed="8" result="noise" />
        <feColorMatrix in="noise" values=".42 0 0 0 .15  0 .44 0 0 .14  0 0 .38 0 .1  0 0 0 .5 0" result="grain" />
        <feBlend in="SourceGraphic" in2="grain" mode="multiply" />
      </filter>
      <filter id={`${id}-glow`} x="-80%" y="-80%" width="260%" height="260%">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
  );
}

function StonePieces({ pieces, id }: { pieces: StonePiece[]; id: string }) {
  return pieces.map((piece, index) => (
    <g key={`${piece.d}-${index}`} className={`coaching-artifact__stone-piece ${piece.className ?? ""}`}>
      <path d={piece.d} fill={`url(#${id}-stone-${piece.tone})`} />
      <path d={piece.d} fill="none" stroke="#d1cba5" strokeOpacity=".26" strokeWidth="2" />
      <path d={piece.d} fill="none" stroke="#050806" strokeOpacity=".72" strokeWidth="5" transform="translate(0 5)" />
    </g>
  ));
}

function Moss({ id, mobile = false }: { id: string; mobile?: boolean }) {
  const path = mobile
    ? "M70 90c48-25 88 8 135-9 39-13 67 16 111-3 49-22 84 16 131-1 50-18 93 13 157 0"
    : "M82 106c51-27 92 9 139-9 42-16 77 15 124-5 48-20 88 17 139-2 50-20 86 17 137 0 50-17 94 14 145 1 52-14 96 12 158 0 44-8 78 9 122 4";

  return (
    <g className="coaching-artifact__moss" fill={`url(#${id}-moss)`}>
      <path d={path} fill="none" stroke={`url(#${id}-moss)`} strokeWidth={mobile ? 17 : 15} strokeLinecap="round" strokeDasharray="1 3 8 2 3 5" />
      {[
        [112, 94, 12], [159, 104, 8], [252, 84, 9], [337, 96, 11], [472, 87, 8], [530, 101, 12],
        ...(mobile ? [] : [[674, 92, 10], [803, 98, 8], [966, 96, 12]])
      ].map(([cx, cy, r], index) => <circle key={index} cx={cx} cy={cy} r={r} />)}
    </g>
  );
}

function DesktopStoneWall({ id }: { id: string }) {
  return (
    <svg className="coaching-artifact__art coaching-artifact__art--desktop" viewBox="0 0 1200 650" aria-hidden="true" focusable="false">
      <StoneDefs id={id} />
      <g className="coaching-artifact__layer coaching-artifact__layer--far" filter={`url(#${id}-shadow)`}>
        <path d="M69 99 116 62l920 4 89 45 18 418-53 73-965 4-70-42Z" fill="#030604" />
      </g>
      <g className="coaching-artifact__layer coaching-artifact__layer--mid" filter={`url(#${id}-surface)`}>
        <StonePieces pieces={desktopStones} id={id} />
      </g>
      <g className="coaching-artifact__layer coaching-artifact__layer--near" filter={`url(#${id}-contact)`}>
        <path d="m247 177 31-19 799 7 39 31-8 267-26 34-814 4-28-28Z" fill="#070b08" opacity=".95" />
        <path d="m265 169 41-13 754 10 38 25-9 259-31 31-772 2-34-27Z" fill={`url(#${id}-slate)`} stroke="#a7a384" strokeOpacity=".25" strokeWidth="3" />
        <path d="m278 187 42-14 724 8 28 19-8 232-24 26-742 3-28-21Z" fill="none" stroke="#0b0e0b" strokeWidth="10" opacity=".74" />
        <path d="M310 211h712l18 17M319 427h697l18-15" fill="none" stroke="#9da67b" strokeOpacity=".16" strokeWidth="2" />
        <path className="coaching-artifact__ornament" d="M421 221h146l14 11 14-11h212M420 414h145l15-11 15 11h213" fill="none" stroke="#b0ba81" strokeWidth="1.4" />
        <path className="coaching-artifact__ornament" d="m578 221 7-8 7 8-7 8Zm0 193 7-8 7 8-7 8Z" fill="#7e965b" />
      </g>
      <Moss id={id} />
      <g className="coaching-artifact__cracks" fill="none" stroke="#090b08" strokeLinecap="round">
        <path d="m172 93-13 21 9 14-17 22 7 24" />
        <path d="m349 75-9 21 13 18-19 19" />
        <path d="m721 82-12 19 9 17-17 22 11 18" />
        <path d="m1018 88-15 22 11 19-19 20" />
        <path d="m105 347 19 10-11 21 17 17-12 24" />
        <path d="m950 526-10 18 14 16-8 18" />
      </g>
      <g className="coaching-artifact__lichen-flecks" fill="#9bad45">
        <circle cx="198" cy="180" r="5" /><circle cx="214" cy="188" r="3" /><circle cx="1094" cy="244" r="4" />
        <circle cx="84" cy="443" r="5" /><circle cx="1056" cy="492" r="4" /><circle cx="384" cy="548" r="3" />
      </g>
      <path className="coaching-artifact__light-sweep" d="m201 67 173-5 226 526-147 17Z" fill={`url(#${id}-light)`} opacity="0" />
      <defs>
        <linearGradient id={`${id}-light`} x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#fff" stopOpacity="0" />
          <stop offset=".5" stopColor="#fff7c7" stopOpacity=".3" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g className="coaching-artifact__dust">
        <circle cx="83" cy="76" r="27" fill={`url(#${id}-dust)`} /><circle cx="1118" cy="151" r="35" fill={`url(#${id}-dust)`} />
      </g>
    </svg>
  );
}

function MobileStoneWall({ id }: { id: string }) {
  return (
    <svg className="coaching-artifact__art coaching-artifact__art--mobile" viewBox="0 0 720 980" aria-hidden="true" focusable="false">
      <StoneDefs id={id} />
      <g className="coaching-artifact__layer coaching-artifact__layer--far" filter={`url(#${id}-shadow)`}>
        <path d="M54 82 106 43l512 11 52 42 10 790-52 54-531 3-49-53Z" fill="#030604" />
      </g>
      <g className="coaching-artifact__layer coaching-artifact__layer--mid" filter={`url(#${id}-surface)`}>
        <StonePieces pieces={mobileStones} id={id} />
      </g>
      <g className="coaching-artifact__layer coaching-artifact__layer--near" filter={`url(#${id}-contact)`}>
        <path d="m126 247 38-25 420 9 33 33-7 548-31 34-432-1-34-31Z" fill="#060906" />
        <path d="m139 238 39-17 390 10 28 29-7 534-25 29-405 2-31-27Z" fill={`url(#${id}-slate)`} stroke="#a6a182" strokeOpacity=".25" strokeWidth="3" />
        <path d="M171 389h353M170 761h354" fill="none" stroke="#9da67b" strokeOpacity=".16" strokeWidth="2" />
        <path className="coaching-artifact__ornament" d="M189 369h105l12 10 12-10h208M188 780h105l12-10 12 10h207" fill="none" stroke="#aeb67c" strokeWidth="1.5" />
      </g>
      <Moss id={id} mobile />
      <g className="coaching-artifact__cracks" fill="none" stroke="#090b08" strokeLinecap="round">
        <path d="m153 73-12 22 10 15-17 24 7 29" />
        <path d="m498 70-13 23 11 18-18 22" />
        <path d="m92 437 19 11-12 23 18 17-12 25" />
        <path d="m610 602-17 16 13 20-16 22" />
      </g>
    </svg>
  );
}

function StoneCrest({ id }: { id: string }) {
  return (
    <svg className="coaching-artifact__crest-art" viewBox="0 0 300 330" aria-hidden="true" focusable="false">
      <StoneDefs id={`${id}-crest`} />
      <g filter={`url(#${id}-crest-shadow)`}>
        <path d="m57 31 57-18 76 8 48 32 4 129-29 67-68 56-67-42-35-74 5-116Z" fill="#050805" opacity=".95" transform="translate(3 12)" />
        <path d="m49 24 62-17 79 8 54 32 2 128-31 68-70 58-72-43-36-74 6-116Z" fill={`url(#${id}-crest-stone-pale)`} stroke="#c2bea0" strokeOpacity=".38" strokeWidth="3" />
        <path d="m70 51 48-12 63 7 36 23 1 98-24 50-51 43-51-33-27-53 5-91Z" fill={`url(#${id}-crest-stone-deep)`} stroke="#222a1f" strokeWidth="8" />
        <path d="m83 65 38-9 55 6 28 18 1 77-20 42-43 36-40-27-22-43 4-72Z" fill="none" stroke="#a5b783" strokeOpacity=".56" strokeWidth="3" />
      </g>
      <g className="coaching-artifact__crest-rune" fill="none" stroke={`url(#${id}-crest-rune)`} strokeLinecap="round" strokeLinejoin="round">
        <path d="m108 102 36-21 38 22 2 46-38 35-39-28Z" strokeWidth="6" />
        <path d="m113 131 28 3 11-25 11 25 27-3-20 19 8 28-26-14-25 14 8-28Z" strokeWidth="4" />
        <path d="m89 76 17-9M195 71l17 12M93 205l15 10M187 215l16-12" strokeWidth="3" opacity=".65" />
      </g>
      <g className="coaching-artifact__crest-chips" fill="#151b14">
        <path d="m48 72 19-4-6 18-17 9Z" /><path d="m217 49 27-2-2 24-14-5Z" /><path d="m72 245 23 13-22 0Z" />
      </g>
    </svg>
  );
}

function StoneArrow({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 280 76" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-tab`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#5e624f" />
          <stop offset=".5" stopColor="#30372d" />
          <stop offset="1" stopColor="#171d18" />
        </linearGradient>
      </defs>
      <path d="m13 15 20-9 215 4 20 17-7 32-22 11-210-3L8 51Z" fill="#050805" opacity=".9" transform="translate(0 5)" />
      <path d="m10 10 23-8 215 4 22 17-8 30-23 11-211-3L5 47Z" fill={`url(#${id}-tab)`} stroke="#a5a986" strokeOpacity=".35" strokeWidth="2" />
      <path d="m225 22 13 13-13 13M237 35h-31" fill="none" stroke="#b6dd89" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
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
      { threshold: 0.18 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => {
    if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current);
  }, []);

  const applyPointerPosition = useCallback((node: HTMLElement) => {
    const { x, y } = pointerRef.current;
    node.style.setProperty("--artifact-tilt-x", `${(-y * 1.35).toFixed(2)}deg`);
    node.style.setProperty("--artifact-tilt-y", `${(x * 1.75).toFixed(2)}deg`);
    node.style.setProperty("--artifact-far-x", `${(-x * 2).toFixed(2)}px`);
    node.style.setProperty("--artifact-far-y", `${(-y * 1.4).toFixed(2)}px`);
    node.style.setProperty("--artifact-mid-x", `${(x * 2.2).toFixed(2)}px`);
    node.style.setProperty("--artifact-mid-y", `${(y * 1.7).toFixed(2)}px`);
    node.style.setProperty("--artifact-near-x", `${(x * 4.2).toFixed(2)}px`);
    node.style.setProperty("--artifact-near-y", `${(y * 3).toFixed(2)}px`);
    node.style.setProperty("--artifact-crest-x", `${(x * 5).toFixed(2)}px`);
    node.style.setProperty("--artifact-crest-y", `${(y * 4).toFixed(2)}px`);
    node.style.setProperty("--artifact-light-shift", `${(x * 64).toFixed(1)}px`);
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
    animationFrameRef.current = window.requestAnimationFrame(() => applyPointerPosition(node));
  };

  const handlePointerLeave = (event: React.PointerEvent<HTMLElement>) => {
    const node = event.currentTarget;
    pointerRef.current = { x: 0, y: 0 };
    [
      "--artifact-tilt-x", "--artifact-tilt-y", "--artifact-far-x", "--artifact-far-y",
      "--artifact-mid-x", "--artifact-mid-y", "--artifact-near-x", "--artifact-near-y",
      "--artifact-crest-x", "--artifact-crest-y", "--artifact-light-shift"
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
      <DesktopStoneWall id={`${id}-desktop`} />
      <MobileStoneWall id={`${id}-mobile`} />

      <div className="coaching-artifact__crest">
        <StoneCrest id={id} />
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
        <StoneArrow id={id} />
        <span>{ctaLabel}</span>
      </Link>
    </article>
  );
}
