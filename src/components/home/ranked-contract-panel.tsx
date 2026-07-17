"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Check, LoaderCircle, ShieldCheck, Swords } from "lucide-react";
import { RankMedal } from "@/components/commerce/rank-medal";
import { rankIndex, rankOptions } from "@/lib/data/ranks";
import type { PriceQuote } from "@/lib/pricing";
import type { PricingInput } from "@/lib/validation/pricing";
import { formatCurrency } from "@/lib/utils";

const initialInput: PricingInput = {
  service: "mmr-boost",
  boostMode: "Duo",
  currentRank: "Legend III",
  targetRank: "Ancient I",
  mmrAmount: 500,
  matchCount: 5,
  behaviorScoreAmount: 2000,
  winCount: 5,
  sessionCount: 1,
  role: "Carry",
  region: "North America",
  language: "English",
  boosterTier: "Pro",
  priority: "Standard",
  preferredHeroes: []
};

const mmrScopes = [300, 500, 1000] as const;
const regions = ["North America", "Europe West", "Europe East", "Southeast Asia", "South America", "Australia"] as const;

export function RankedContractPanel() {
  const [input, setInput] = useState<PricingInput>(initialInput);
  const [quote, setQuote] = useState<PriceQuote | null>(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const payload = useMemo(() => ({ ...input, preferredHeroes: [] }), [input]);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setBusy(true);
      try {
        const response = await fetch("/api/pricing", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: controller.signal
        });
        const body = (await response.json()) as { quote?: PriceQuote; error?: string };
        if (!response.ok || !body.quote) throw new Error(body.error ?? "Quote unavailable");
        setQuote(body.quote);
        setError(null);
      } catch (cause) {
        if (cause instanceof DOMException && cause.name === "AbortError") return;
        setQuote(null);
        setError("Open the full configurator for a live quote.");
      } finally {
        if (!controller.signal.aborted) setBusy(false);
      }
    }, 220);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [payload]);

  function update<Key extends keyof PricingInput>(key: Key, value: PricingInput[Key]) {
    setInput((current) => ({ ...current, [key]: value }));
    setQuote(null);
    setError(null);
  }

  function updateCurrentRank(rank: PricingInput["currentRank"]) {
    setInput((current) => ({
      ...current,
      currentRank: rank,
      targetRank: rankIndex(current.targetRank) <= rankIndex(rank)
        ? rankOptions[Math.min(rankIndex(rank) + 1, rankOptions.length - 1)]!
        : current.targetRank
    }));
    setQuote(null);
  }

  return (
    <div className="war-contract" data-reveal="right">
      <div className="war-contract__cap">
        <div>
          <p>Ranked contract</p>
          <strong>HG // MMR ASCENT</strong>
        </div>
        <span><span className="war-live-dot" /> Live quote</span>
      </div>

      <div className="war-contract__body">
        <div className="war-rank-route">
          <label>
            <span>Current medal</span>
            <RankMedal rank={input.currentRank} size="lg" label={false} className="war-rank-medal" />
            <select value={input.currentRank} onChange={(event) => updateCurrentRank(event.target.value as PricingInput["currentRank"])}>
              {rankOptions.slice(0, -1).map((rank) => <option key={rank}>{rank}</option>)}
            </select>
          </label>
          <div className="war-rank-route__versus" aria-hidden="true"><Swords /></div>
          <label>
            <span>Target medal</span>
            <RankMedal rank={input.targetRank} size="lg" label={false} selected className="war-rank-medal" />
            <select value={input.targetRank} onChange={(event) => update("targetRank", event.target.value as PricingInput["targetRank"])}>
              {rankOptions.filter((rank) => rankIndex(rank) > rankIndex(input.currentRank)).map((rank) => <option key={rank}>{rank}</option>)}
            </select>
          </label>
        </div>

        <fieldset className="war-mode-select">
          <legend>Battle plan</legend>
          <div>
            {(["Solo", "Duo"] as const).map((mode) => (
              <button key={mode} type="button" aria-pressed={input.boostMode === mode} onClick={() => update("boostMode", mode)}>
                <span>{mode === "Solo" ? "Solo Assist" : "Duo Queue"}</span>
                <small>{mode === "Solo" ? "Live direction" : "Separate accounts"}</small>
                {input.boostMode === mode ? <Check aria-hidden="true" /> : null}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="war-scope-select">
          <legend>MMR scope</legend>
          <div>
            {mmrScopes.map((amount) => (
              <button key={amount} type="button" aria-pressed={input.mmrAmount === amount} onClick={() => update("mmrAmount", amount)}>
                +{amount.toLocaleString()}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="war-region-select">
          <span>Server region</span>
          <select value={input.region} onChange={(event) => update("region", event.target.value as PricingInput["region"])}>
            {regions.map((region) => <option key={region}>{region}</option>)}
          </select>
        </label>

        <div className="war-contract__quote">
          <div>
            <span>Estimated contract</span>
            <strong>{busy ? <LoaderCircle className="animate-spin" /> : quote ? formatCurrency(quote.total) : "—"}</strong>
            <small>{error ?? "Server-priced in CAD · before tax"}</small>
          </div>
          <Link href="/pricing">Open full contract <ArrowUpRight /></Link>
        </div>

        <p className="war-contract__safety"><ShieldCheck /> You stay in control. We never request Steam credentials or remote access.</p>
      </div>
    </div>
  );
}
