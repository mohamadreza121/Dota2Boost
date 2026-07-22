"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, LockKeyhole, Route } from "lucide-react";
import { useMemo, useState, type CSSProperties, type ChangeEvent } from "react";
import {
  rankFamilyOf,
  rankIndex,
  rankMedals,
  rankOptions,
  type RankName
} from "@/lib/data/ranks";

const regions = ["EU West", "North America", "Southeast Asia"] as const;
const roles = ["Carry", "Mid", "Offlane", "Soft Support", "Hard Support"] as const;
const deliveryModes = ["Solo Assist", "Duo Queue"] as const;

type RoutePreviewProps = {
  variant?: "compact" | "expanded";
};

export function RankRoutePreview({ variant = "compact" }: RoutePreviewProps) {
  const [currentRank, setCurrentRank] = useState<RankName>("Legend III");
  const [targetRank, setTargetRank] = useState<RankName>("Ancient II");
  const [region, setRegion] = useState<(typeof regions)[number]>("EU West");
  const [role, setRole] = useState<(typeof roles)[number]>("Mid");
  const [deliveryMode, setDeliveryMode] = useState<(typeof deliveryModes)[number]>("Solo Assist");

  const targetOptions = useMemo(() => {
    const start = Math.min(rankIndex(currentRank) + 1, rankOptions.length - 1);
    return rankOptions.slice(start);
  }, [currentRank]);

  const currentMedal = rankMedals[rankFamilyOf(currentRank)];
  const targetMedal = rankMedals[rankFamilyOf(targetRank)];
  const routeLength = Math.max(1, rankIndex(targetRank) - rankIndex(currentRank));
  const routePosition = Math.min(100, Math.max(16, (routeLength / 20) * 100));
  const routeStyle = { "--route-position": `${routePosition}%` } as CSSProperties;

  function updateCurrentRank(nextRank: RankName) {
    setCurrentRank(nextRank);
    if (rankIndex(nextRank) >= rankIndex(targetRank)) {
      const nextTarget = rankOptions[Math.min(rankIndex(nextRank) + 1, rankOptions.length - 1)];
      if (nextTarget) setTargetRank(nextTarget);
    }
  }

  return (
    <div className={`war-route-preview war-route-preview--${variant}`}>
      <div className="war-route-preview__head">
        <span><Route aria-hidden="true" /> Campaign route</span>
        <small>Exploratory preview</small>
      </div>

      <div className="war-route-preview__medals" style={routeStyle}>
        <div className="war-route-medal">
          <span>Current rank</span>
          <Image
            src={currentMedal.image}
            alt={`${rankFamilyOf(currentRank)} rank medal`}
            width={112}
            height={112}
          />
          <strong>{currentRank}</strong>
        </div>

        <div className="war-route-track" aria-hidden="true">
          <svg viewBox="0 0 420 90" preserveAspectRatio="none">
            <path className="war-route-track__bed" d="M10 64 C86 2 146 82 218 38 C290 -4 336 50 410 20" />
            <path className="war-route-track__active" pathLength="1" d="M10 64 C86 2 146 82 218 38 C290 -4 336 50 410 20" />
          </svg>
          <i className="war-route-track__marker"><Route /></i>
          <span className="war-route-track__count">{routeLength} divisions</span>
        </div>

        <div className="war-route-medal war-route-medal--target">
          <span>Target rank</span>
          <Image
            src={targetMedal.image}
            alt={`${rankFamilyOf(targetRank)} rank medal`}
            width={112}
            height={112}
          />
          <strong>{targetRank}</strong>
        </div>
      </div>

      <div className="war-route-controls">
        <label>
          <span>Current</span>
          <select value={currentRank} onChange={(event: ChangeEvent<HTMLSelectElement>) => updateCurrentRank(event.target.value as RankName)}>
            {rankOptions.slice(0, -1).map((rank) => <option key={rank} value={rank}>{rank}</option>)}
          </select>
        </label>
        <label>
          <span>Target</span>
          <select value={targetRank} onChange={(event: ChangeEvent<HTMLSelectElement>) => setTargetRank(event.target.value as RankName)}>
            {targetOptions.map((rank) => <option key={rank} value={rank}>{rank}</option>)}
          </select>
        </label>
        <label>
          <span>Region</span>
          <select value={region} onChange={(event: ChangeEvent<HTMLSelectElement>) => setRegion(event.target.value as (typeof regions)[number])}>
            {regions.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label>
          <span>Role</span>
          <select value={role} onChange={(event: ChangeEvent<HTMLSelectElement>) => setRole(event.target.value as (typeof roles)[number])}>
            {roles.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label>
          <span>Delivery</span>
          <select value={deliveryMode} onChange={(event: ChangeEvent<HTMLSelectElement>) => setDeliveryMode(event.target.value as (typeof deliveryModes)[number])}>
            {deliveryModes.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
      </div>

      <div className="war-route-preview__footer">
        <p><LockKeyhole aria-hidden="true" /><span><strong>Customer-controlled access</strong><small>No password, Steam Guard code, or remote access.</small></span></p>
        {variant === "expanded" ? (
          <Link href="/pricing" className="war-action-button">
            <span>Configure live route</span><ArrowRight aria-hidden="true" />
          </Link>
        ) : (
          <span className="war-route-ready"><Check aria-hidden="true" /> Scope visible before payment</span>
        )}
      </div>
    </div>
  );
}
