"use client";

import { useEffect, useMemo, useState, type ComponentType } from "react";
import { AlertTriangle, Check, Gauge, GraduationCap, LoaderCircle, ShieldCheck, Target, TicketPercent, TrendingUp, Trophy } from "lucide-react";
import { RankMedal } from "@/components/commerce/rank-medal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { PriceQuote } from "@/lib/pricing";
import { formatCurrency } from "@/lib/utils";
import { maximumPricedMmr, rankFamilies, rankFamilyOf, rankFromMmr } from "@/lib/data/ranks";
import type { PricingInput } from "@/lib/validation/pricing";

const initialInput: PricingInput = {
  service: "mmr-boost",
  boostMode: "Duo",
  currentRank: "Legend III",
  targetRank: "Ancient I",
  currentMmr: 3400,
  targetMmr: 3900,
  mmrAmount: 500,
  calibrationType: "Recalibration activated",
  rankConfidence: 25,
  matchCount: 10,
  lowPriorityWins: 3,
  currentBehaviorScore: 8000,
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

const inputClass = "mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-black/25 px-3.5 text-sm text-white transition focus:border-cyan/60 focus:outline-none";

const serviceChoices: Array<{ value: PricingInput["service"]; label: string; hint: string; icon: ComponentType<{ className?: string }> }> = [
  { value: "mmr-boost", label: "MMR Boost", hint: "Exact MMR route", icon: TrendingUp },
  { value: "mmr-calibration", label: "Calibration", hint: "Rank Confidence", icon: Target },
  { value: "low-priority-recovery", label: "Low Priority", hint: "Required wins", icon: AlertTriangle },
  { value: "behavior-score-boost", label: "Behavior Score", hint: "Recovery scope", icon: ShieldCheck },
  { value: "win-boost", label: "Win Boost", hint: "Duo packages", icon: Trophy },
  { value: "coaching", label: "Coaching", hint: "Secondary service", icon: GraduationCap }
];

interface ServerQuote {
  quote: PriceQuote;
  promotion?: { code: string; amount: number };
  calculatedAt?: string;
}

function supportsMmr(service: PricingInput["service"]) {
  return service === "mmr-boost" || service === "mmr-calibration" || service === "win-boost";
}

export function PricingConfigurator({ compact = false }: { compact?: boolean }) {
  const [input, setInput] = useState<PricingInput>(initialInput);
  const [currentMmrDraft, setCurrentMmrDraft] = useState<string | null>(null);
  const [targetMmrDraft, setTargetMmrDraft] = useState<string | null>(null);
  const [heroes, setHeroes] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [serverQuote, setServerQuote] = useState<ServerQuote | null>(null);
  const [quoteBusy, setQuoteBusy] = useState(true);
  const [discountBusy, setDiscountBusy] = useState(false);
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const basePayload = useMemo(() => ({
    ...input,
    discountCode: undefined,
    preferredHeroes: heroes.split(",").map((hero) => hero.trim()).filter(Boolean).slice(0, 8)
  }), [input, heroes]);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setQuoteBusy(true);
      setServerQuote(null);
      try {
        const response = await fetch("/api/pricing", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(basePayload),
          signal: controller.signal
        });
        const body = (await response.json()) as ServerQuote & { error?: string };
        if (!response.ok || !body.quote) throw new Error(body.error ?? "A server quote is not available.");
        setServerQuote(body);
        setError(null);
      } catch (quoteError) {
        if (quoteError instanceof DOMException && quoteError.name === "AbortError") return;
        setError(quoteError instanceof Error ? quoteError.message : "A server quote is not available.");
      } finally {
        if (!controller.signal.aborted) setQuoteBusy(false);
      }
    }, 220);
    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [basePayload]);

  function update<Key extends keyof PricingInput>(key: Key, value: PricingInput[Key]) {
    setInput((current) => ({ ...current, [key]: value }));
    setServerQuote(null);
    setError(null);
  }

  function selectService(service: PricingInput["service"]) {
    setInput((current) => ({
      ...current,
      service,
      boostMode: service === "win-boost" ? "Duo" : service === "behavior-score-boost" || service === "coaching" ? "Solo" : current.boostMode,
      targetRank: service === "mmr-boost" ? current.targetRank : current.currentRank,
      targetMmr: service === "mmr-boost" ? current.targetMmr : current.currentMmr,
      mmrAmount: service === "mmr-boost" ? current.targetMmr - current.currentMmr : current.mmrAmount
    }));
    setServerQuote(null);
    setError(null);
  }

  function updateCurrentMmr(value: number) {
    const currentMmr = Math.max(0, Math.min(maximumPricedMmr - 100, value));
    setInput((current) => ({
      ...current,
      currentMmr,
      currentRank: rankFromMmr(currentMmr),
      targetMmr: current.service === "mmr-boost" ? Math.max(currentMmr + 100, current.targetMmr) : currentMmr,
      targetRank: current.service === "mmr-boost" ? rankFromMmr(Math.max(currentMmr + 100, current.targetMmr)) : rankFromMmr(currentMmr),
      mmrAmount: current.service === "mmr-boost" ? Math.max(currentMmr + 100, current.targetMmr) - currentMmr : current.mmrAmount
    }));
    setServerQuote(null);
    setError(null);
  }

  function updateTargetMmr(value: number) {
    setInput((current) => {
      const targetMmr = Math.max(current.currentMmr + 100, Math.min(maximumPricedMmr, value));
      return { ...current, targetMmr, targetRank: rankFromMmr(targetMmr), mmrAmount: targetMmr - current.currentMmr };
    });
    setServerQuote(null);
    setError(null);
  }

  function handleCurrentMmrChange(value: string) {
    setCurrentMmrDraft(value);
    if (!/^\d+$/.test(value)) return;
    const mmr = Number(value);
    if (mmr >= 0 && mmr <= maximumPricedMmr - 100) {
      setCurrentMmrDraft(null);
      updateCurrentMmr(mmr);
    }
  }

  function handleTargetMmrChange(value: string) {
    setTargetMmrDraft(value);
    if (!/^\d+$/.test(value)) return;
    const mmr = Number(value);
    if (mmr >= input.currentMmr + 100 && mmr <= maximumPricedMmr) {
      setTargetMmrDraft(null);
      updateTargetMmr(mmr);
    }
  }

  function restoreMmrDraft(field: "current" | "target") {
    if (field === "current") setCurrentMmrDraft(null);
    else setTargetMmrDraft(null);
  }

  function checkoutPayload(promotion = serverQuote?.promotion?.code) {
    return { ...basePayload, discountCode: promotion };
  }

  async function applyDiscount() {
    const code = discountCode.trim().toUpperCase();
    if (!code) return;
    setDiscountBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkoutPayload(code))
      });
      const body = (await response.json()) as ServerQuote & { error?: string };
      if (!response.ok || !body.quote) throw new Error(body.error ?? "That code could not be applied.");
      setServerQuote(body);
    } catch (discountError) {
      setError(discountError instanceof Error ? discountError.message : "That code could not be applied.");
    } finally {
      setDiscountBusy(false);
    }
  }

  async function startCheckout() {
    if (!serverQuote) return;
    setCheckoutBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkoutPayload())
      });
      const body = (await response.json()) as { url?: string; error?: string };
      if (response.status === 401) {
        window.location.assign("/auth/sign-in?next=/pricing");
        return;
      }
      if (!response.ok || !body.url) throw new Error(body.error ?? "Checkout could not be started.");
      window.location.assign(body.url);
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Checkout could not be started.");
    } finally {
      setCheckoutBusy(false);
    }
  }

  const quote = serverQuote?.quote;
  const showModes = input.service === "mmr-boost" || input.service === "mmr-calibration" || input.service === "low-priority-recovery";

  return (
    <div className={`grid gap-5 ${compact ? "" : "xl:grid-cols-[1fr_410px] xl:items-start"}`}>
      <div className="surface rounded-[1.8rem] p-5 sm:p-7">
        <div className="flex flex-col justify-between gap-3 border-b border-white/[0.08] pb-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-[0.65rem] font-bold tracking-[0.15em] text-amber uppercase">MMR service configurator</p>
            <h2 className="mt-2 text-2xl font-black">Configure the exact boost.</h2>
          </div>
          <Badge tone="cyan"><span className="mr-1.5 size-1.5 rounded-full bg-cyan" />Server-priced</Badge>
        </div>

        <fieldset className="mt-6">
          <legend className="text-xs font-black tracking-[0.12em] text-mist uppercase">1. Choose a service</legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {serviceChoices.map((choice) => {
              const Icon = choice.icon;
              const selected = input.service === choice.value;
              return <button key={choice.value} type="button" onClick={() => selectService(choice.value)} className={`min-h-28 rounded-xl border p-3 text-left transition ${selected ? "border-crimson/50 bg-crimson/[0.11] shadow-[inset_0_0_24px_rgb(214_79_82_/_0.08)]" : "border-white/[0.08] bg-black/15 hover:border-white/20"}`}><Icon className={`size-4 ${selected ? "text-crimson" : "text-mist"}`} /><span className="mt-5 block text-xs font-black">{choice.label}</span><span className="mt-1 block text-[0.58rem] text-mist">{choice.hint}</span></button>;
            })}
          </div>
        </fieldset>

        {showModes ? (
          <fieldset className="mt-7">
            <legend className="text-xs font-black tracking-[0.12em] text-mist uppercase">2. Pick a mode</legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {(["Solo", "Duo"] as const).map((mode) => {
                const lowPriority = input.service === "low-priority-recovery";
                return <button key={mode} type="button" onClick={() => update("boostMode", mode)} className={`rounded-xl border p-4 text-left transition ${input.boostMode === mode ? "border-cyan/45 bg-cyan/[0.08]" : "border-white/[0.08] bg-black/15 hover:border-white/20"}`}><span className="flex items-center justify-between text-sm font-black">{lowPriority ? mode === "Solo" ? "Guided Self-Play" : "Eligible Party Assist" : mode === "Solo" ? "Solo Assist" : "Duo Queue"}{input.boostMode === mode ? <Check className="size-4 text-cyan" /> : null}</span><span className="mt-2 block text-xs leading-5 text-mist">{lowPriority ? mode === "Solo" ? "You play every Single Draft game while a specialist guides the recovery plan." : "You stay on your account and queue with a specialist only where party rules allow." : mode === "Solo" ? "You stay at the controls while a verified expert directs the live plan." : "A compatible high-MMR booster queues beside you on a separate account."}</span></button>;
              })}
            </div>
          </fieldset>
        ) : null}

        {supportsMmr(input.service) ? (
          <fieldset className="mt-7">
            <legend className="text-xs font-black tracking-[0.12em] text-mist uppercase">{showModes ? "3" : "2"}. Enter exact MMR</legend>
            <div className={`mt-4 grid gap-4 ${input.service === "mmr-boost" ? "sm:grid-cols-2" : "max-w-sm"}`}>
              <label className="rounded-2xl border border-white/[0.08] bg-black/15 p-4 text-xs font-bold text-[#cdd1ce]">
                <span className="flex items-center gap-4"><RankMedal rank={input.currentRank} size="sm" label={false} /><span>{input.service === "mmr-calibration" ? "Previous or estimated MMR" : "Current MMR"}<small className="mt-1 block font-normal text-mist">{input.currentRank}</small></span></span>
                <input className={inputClass} type="number" inputMode="numeric" min={0} max={maximumPricedMmr - 100} step={1} value={currentMmrDraft ?? input.currentMmr} onChange={(event) => handleCurrentMmrChange(event.target.value)} onBlur={() => restoreMmrDraft("current")} />
              </label>
              {input.service === "mmr-boost" ? <label className="rounded-2xl border border-white/[0.08] bg-black/15 p-4 text-xs font-bold text-[#cdd1ce]"><span className="flex items-center gap-4"><RankMedal rank={input.targetRank} size="sm" label={false} /><span>Target MMR<small className="mt-1 block font-normal text-mist">{input.targetRank}</small></span></span><input className={inputClass} type="number" inputMode="numeric" min={input.currentMmr + 100} max={maximumPricedMmr} step={1} value={targetMmrDraft ?? input.targetMmr} onChange={(event) => handleTargetMmrChange(event.target.value)} onBlur={() => restoreMmrDraft("target")} /></label> : null}
            </div>
            <p className="mt-3 text-[0.68rem] leading-5 text-mist">Medals are derived automatically from exact MMR. The quote prices each part of the route once across its actual bracket—there is no separate medal-step charge.</p>
            <div className="mt-5 overflow-x-auto pb-2">
              <div className="rank-medal-track grid min-w-[700px] grid-cols-8 gap-2">
                {rankFamilies.map((family) => {
                  const selected = rankFamilyOf(input.currentRank) === family || (input.service === "mmr-boost" && rankFamilyOf(input.targetRank) === family);
                  return <div key={family} className="rounded-xl p-1"><RankMedal rank={family} size="sm" selected={selected} /></div>;
                })}
              </div>
            </div>
          </fieldset>
        ) : null}

        <div className="mt-7 grid gap-x-5 gap-y-5 sm:grid-cols-2">
          {input.service === "mmr-boost" ? <div className="rounded-xl border border-amber/15 bg-amber/[0.04] p-4"><span className="text-[0.62rem] font-bold tracking-wider text-mist uppercase">Calculated route</span><strong className="mt-2 block text-lg">{input.mmrAmount.toLocaleString()} MMR</strong></div> : null}
          {input.service === "mmr-calibration" ? <>
            <label className="text-xs font-bold text-[#cdd1ce]">Calibration state<select className={inputClass} value={input.calibrationType} onChange={(event) => update("calibrationType", event.target.value as PricingInput["calibrationType"])}><option>New account</option><option>Recalibration activated</option><option>Returning player</option></select></label>
            <label className="text-xs font-bold text-[#cdd1ce]">Current Rank Confidence<input className={inputClass} type="number" min={0} max={100} value={input.rankConfidence} onChange={(event) => update("rankConfidence", Number(event.target.value))} /></label>
            <label className="text-xs font-bold text-[#cdd1ce]">Assisted games<select className={inputClass} value={input.matchCount} onChange={(event) => update("matchCount", Number(event.target.value))}>{Array.from({ length: 30 }, (_, index) => index + 1).map((count) => <option key={count} value={count}>{count} game{count === 1 ? "" : "s"}</option>)}</select></label>
            <label className="text-xs font-bold text-[#cdd1ce]">Current behavior score<input className={inputClass} type="number" min={0} max={12000} step={100} value={input.currentBehaviorScore} onChange={(event) => update("currentBehaviorScore", Number(event.target.value))} /></label>
          </> : null}
          {input.service === "low-priority-recovery" ? <>
            <label className="text-xs font-bold text-[#cdd1ce]">Required Single Draft wins<select className={inputClass} value={input.lowPriorityWins} onChange={(event) => update("lowPriorityWins", Number(event.target.value))}>{Array.from({ length: 10 }, (_, index) => index + 1).map((count) => <option key={count} value={count}>{count} required win{count === 1 ? "" : "s"}</option>)}</select></label>
            <label className="text-xs font-bold text-[#cdd1ce]">Current behavior score<input className={inputClass} type="number" min={0} max={12000} step={100} value={input.currentBehaviorScore} onChange={(event) => update("currentBehaviorScore", Number(event.target.value))} /></label>
          </> : null}
          {input.service === "behavior-score-boost" ? <label className="text-xs font-bold text-[#cdd1ce]">Behavior-score recovery<select className={inputClass} value={input.behaviorScoreAmount} onChange={(event) => update("behaviorScoreAmount", Number(event.target.value))}>{Array.from({ length: 12 }, (_, index) => (index + 1) * 500).map((amount) => <option key={amount} value={amount}>+{amount.toLocaleString()} score</option>)}</select></label> : null}
          {input.service === "win-boost" ? <label className="text-xs font-bold text-[#cdd1ce]">Assisted wins<select className={inputClass} value={input.winCount} onChange={(event) => update("winCount", Number(event.target.value))}>{[3, 5, 7, 10, 15, 20].map((count) => <option key={count} value={count}>{count} wins</option>)}</select></label> : null}
          {input.service === "coaching" ? <label className="text-xs font-bold text-[#cdd1ce]">Private sessions<select className={inputClass} value={input.sessionCount} onChange={(event) => update("sessionCount", Number(event.target.value))}>{[1, 2, 4, 6, 8].map((count) => <option key={count} value={count}>{count} session{count === 1 ? "" : "s"}</option>)}</select></label> : null}
          <label className="text-xs font-bold text-[#cdd1ce]">Your role<select className={inputClass} value={input.role} onChange={(event) => update("role", event.target.value as PricingInput["role"])}>{(["Carry", "Mid", "Offlane", "Soft Support", "Hard Support", "Flexible"] as const).map((role) => <option key={role}>{role}</option>)}</select></label>
          <label className="text-xs font-bold text-[#cdd1ce]">Region<select className={inputClass} value={input.region} onChange={(event) => update("region", event.target.value as PricingInput["region"])}>{(["North America", "Europe West", "Europe East", "Southeast Asia", "South America", "Australia"] as const).map((region) => <option key={region}>{region}</option>)}</select></label>
          <label className="text-xs font-bold text-[#cdd1ce]">Language<select className={inputClass} value={input.language} onChange={(event) => update("language", event.target.value)}><option>English</option><option>French</option><option>Spanish</option><option>German</option><option>Mandarin</option><option>Russian</option></select></label>
          <label className="text-xs font-bold text-[#cdd1ce]">Booster tier<select className={inputClass} value={input.boosterTier} onChange={(event) => update("boosterTier", event.target.value as PricingInput["boosterTier"])}><option>Pro</option><option>Master</option><option>Elite</option></select></label>
          <label className="text-xs font-bold text-[#cdd1ce]">Delivery priority<select className={inputClass} value={input.priority} onChange={(event) => update("priority", event.target.value as PricingInput["priority"])}><option>Flexible</option><option>Standard</option><option>Priority</option></select></label>
          <label className="text-xs font-bold text-[#cdd1ce] sm:col-span-2">Preferred heroes <span className="font-normal text-mist">(optional)</span><input className={inputClass} value={heroes} onChange={(event) => { setHeroes(event.target.value); setServerQuote(null); }} placeholder="e.g. Luna, Sven, Crystal Maiden" maxLength={160} /></label>
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-xl border border-cyan/15 bg-cyan/[0.05] p-4 text-xs leading-5 text-[#aeb9b7]">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-cyan" />
          <p>Solo and Duo are customer-operated services. Never enter Steam credentials, passwords, Steam Guard codes, recovery codes, authentication cookies, or remote-access details.</p>
        </div>
      </div>

      {!compact ? (
        <aside className="surface top-24 rounded-[1.8rem] p-6 xl:sticky">
          <div className="flex items-center justify-between">
            <p className="text-xs font-black tracking-[0.13em] uppercase">Server quote</p>
            <span className="flex items-center gap-2 text-[0.6rem] font-bold text-cyan uppercase">{quoteBusy ? <LoaderCircle className="size-3 animate-spin" /> : <Gauge className="size-3" />}CAD</span>
          </div>
          {quote ? <>
            <p className="mt-5 rounded-xl border border-white/[0.08] bg-black/20 p-3 text-xs font-bold leading-5">{quote.summary}</p>
            <div className="mt-5 space-y-3">
              {quote.lines.map((line) => <div key={line.label} className="flex items-start justify-between gap-5 text-sm"><span className="text-mist">{line.label}</span><span className="font-semibold">{line.amount < 0 ? "−" : ""}{formatCurrency(Math.abs(line.amount))}</span></div>)}
              {quote.discount ? <div className="flex justify-between gap-5 text-sm text-cyan"><span>Package saving</span><span>−{formatCurrency(quote.discount)}</span></div> : null}
              {serverQuote?.promotion ? <div className="flex justify-between gap-5 text-sm text-amber"><span>{serverQuote.promotion.code}</span><span>−{formatCurrency(serverQuote.promotion.amount)}</span></div> : null}
            </div>
            <div className="mt-6 flex items-end justify-between border-t border-white/[0.09] pt-5"><div><p className="text-[0.62rem] font-bold tracking-wider text-mist uppercase">Estimated total</p><p className="mt-1 text-3xl font-black">{formatCurrency(quote.total)}</p></div><Badge tone="gold">Before tax</Badge></div>
          </> : <div className="mt-6 grid min-h-52 place-items-center rounded-xl border border-white/[0.08] bg-black/15 text-center"><div>{quoteBusy ? <LoaderCircle className="mx-auto size-6 animate-spin text-cyan" /> : <Gauge className="mx-auto size-6 text-mist" />}<p className="mt-3 text-xs text-mist">{quoteBusy ? "Calculating on the server…" : "Adjust the configuration to request a new quote."}</p></div></div>}

          <div className="mt-5 rounded-xl border border-white/[0.08] bg-black/20 p-3">
            <label className="text-[0.62rem] font-bold tracking-wider text-mist uppercase" htmlFor="discount-code">Discount code</label>
            <div className="mt-2 flex gap-2"><div className="relative min-w-0 flex-1"><TicketPercent className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-mist" /><input id="discount-code" value={discountCode} onChange={(event) => setDiscountCode(event.target.value.toUpperCase())} maxLength={32} placeholder="HIGHGROUND10" className="min-h-11 w-full rounded-lg border border-white/10 bg-black/30 pl-9 pr-3 text-xs font-bold tracking-wider uppercase focus:border-cyan/60 focus:outline-none" /></div><Button variant="secondary" onClick={applyDiscount} disabled={discountBusy || quoteBusy || !discountCode.trim()} className="rounded-lg px-4 text-xs">{discountBusy ? <LoaderCircle className="size-4 animate-spin" /> : "Apply"}</Button></div>
          </div>

          <Button onClick={startCheckout} disabled={checkoutBusy || quoteBusy || !quote} className="mt-5 w-full">{checkoutBusy ? <><LoaderCircle className="size-4 animate-spin" />Preparing Stripe Checkout</> : "Continue to secure checkout"}</Button>
          {error ? <p role="alert" className="mt-3 text-xs leading-5 text-[#ef9a9a]">{error}</p> : null}
          <ul className="mt-5 space-y-2 text-[0.68rem] text-mist">
            <li className="flex gap-2"><Check className="size-3.5 text-cyan" />Quote and discount calculated again on the server</li>
            <li className="flex gap-2"><Check className="size-3.5 text-cyan" />Order created before hosted Stripe Checkout</li>
            <li className="flex gap-2"><Check className="size-3.5 text-cyan" />Tax and receipt handled by Stripe</li>
            <li className="flex gap-2"><Check className="size-3.5 text-cyan" />No rank, MMR, score, or match result is guaranteed</li>
          </ul>
        </aside>
      ) : null}
    </div>
  );
}
