"use client";

import { useMemo, useState } from "react";
import { Check, LoaderCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { calculateQuote } from "@/lib/pricing";
import { formatCurrency } from "@/lib/utils";
import type { PricingInput } from "@/lib/validation/pricing";

const initialInput: PricingInput = {
  service: "live-coaching",
  currentRank: "Legend",
  targetGoal: "Improve decision making",
  role: "Carry",
  region: "North America",
  language: "English",
  sessionCount: 2,
  sessionDuration: "60",
  replayCount: 1,
  coachTier: "Master",
  priority: "Standard",
  teamSize: 1,
  preferredHeroes: []
};

const inputClass = "mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-black/20 px-3.5 text-sm text-white transition focus:border-cyan/60 focus:outline-none";

export function PricingConfigurator({ compact = false }: { compact?: boolean }) {
  const [input, setInput] = useState<PricingInput>(initialInput);
  const [heroes, setHeroes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const quote = useMemo(() => calculateQuote({ ...input, preferredHeroes: heroes.split(",").map((hero) => hero.trim()).filter(Boolean).slice(0, 8) }), [input, heroes]);

  function update<Key extends keyof PricingInput>(key: Key, value: PricingInput[Key]) {
    setInput((current) => ({ ...current, [key]: value }));
  }

  async function startCheckout() {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input, preferredHeroes: heroes.split(",").map((hero) => hero.trim()).filter(Boolean).slice(0, 8) })
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
      setBusy(false);
    }
  }

  return (
    <div className={`grid gap-5 ${compact ? "" : "lg:grid-cols-[1fr_390px] lg:items-start"}`}>
      <div className="surface rounded-[1.6rem] p-5 sm:p-7">
        <div className="flex flex-col justify-between gap-3 border-b border-white/[0.08] pb-6 sm:flex-row sm:items-center">
          <div><p className="text-[0.65rem] font-bold tracking-[0.15em] text-amber uppercase">Service configurator</p><h2 className="mt-2 text-xl font-bold">Build your coaching brief</h2></div>
          <Badge tone="cyan">Updates instantly</Badge>
        </div>
        <div className="mt-6 grid gap-x-5 gap-y-5 sm:grid-cols-2">
          <label className="text-xs font-bold text-[#cdd1ce]">Coaching service
            <select className={inputClass} value={input.service} onChange={(event) => update("service", event.target.value as PricingInput["service"])}>
              <option value="live-coaching">Live coaching</option><option value="replay-analysis">Replay analysis</option><option value="role-mastery">Role mastery</option><option value="hero-mastery">Hero mastery</option><option value="guided-rank-improvement">Guided improvement</option><option value="team-coaching">Team coaching</option><option value="monthly-membership">Monthly membership</option>
            </select>
          </label>
          <label className="text-xs font-bold text-[#cdd1ce]">Main role
            <select className={inputClass} value={input.role} onChange={(event) => update("role", event.target.value as PricingInput["role"])}>
              {(["Carry", "Mid", "Offlane", "Soft Support", "Hard Support", "Flexible"] as const).map((role) => <option key={role}>{role}</option>)}
            </select>
          </label>
          <label className="text-xs font-bold text-[#cdd1ce]">Current rank
            <select className={inputClass} value={input.currentRank} onChange={(event) => update("currentRank", event.target.value)}>
              {["Herald", "Guardian", "Crusader", "Archon", "Legend", "Ancient", "Divine", "Immortal"].map((rank) => <option key={rank}>{rank}</option>)}
            </select>
          </label>
          <label className="text-xs font-bold text-[#cdd1ce]">Target goal
            <input className={inputClass} maxLength={80} value={input.targetGoal} onChange={(event) => update("targetGoal", event.target.value)} />
          </label>
          <label className="text-xs font-bold text-[#cdd1ce]">Region
            <select className={inputClass} value={input.region} onChange={(event) => update("region", event.target.value as PricingInput["region"])}>
              {(["North America", "Europe West", "Europe East", "Southeast Asia", "South America", "Australia"] as const).map((region) => <option key={region}>{region}</option>)}
            </select>
          </label>
          <label className="text-xs font-bold text-[#cdd1ce]">Preferred language
            <select className={inputClass} value={input.language} onChange={(event) => update("language", event.target.value)}><option>English</option><option>French</option><option>Spanish</option><option>German</option><option>Mandarin</option><option>Russian</option></select>
          </label>
          <label className="text-xs font-bold text-[#cdd1ce]">Number of sessions
            <select className={inputClass} value={input.sessionCount} onChange={(event) => update("sessionCount", Number(event.target.value))}>{[1, 2, 3, 4, 6, 8, 12].map((count) => <option key={count} value={count}>{count}</option>)}</select>
          </label>
          <label className="text-xs font-bold text-[#cdd1ce]">Session duration
            <select className={inputClass} value={input.sessionDuration} onChange={(event) => update("sessionDuration", event.target.value as PricingInput["sessionDuration"])}><option value="60">60 minutes</option><option value="90">90 minutes</option><option value="120">120 minutes</option></select>
          </label>
          <label className="text-xs font-bold text-[#cdd1ce]">Replay reviews
            <select className={inputClass} value={input.replayCount} onChange={(event) => update("replayCount", Number(event.target.value))}>{[0, 1, 2, 3, 4, 6, 8].map((count) => <option key={count} value={count}>{count}</option>)}</select>
          </label>
          <label className="text-xs font-bold text-[#cdd1ce]">Coach tier
            <select className={inputClass} value={input.coachTier} onChange={(event) => update("coachTier", event.target.value as PricingInput["coachTier"])}><option>Pro</option><option>Master</option><option>Elite</option></select>
          </label>
          <label className="text-xs font-bold text-[#cdd1ce]">Delivery priority
            <select className={inputClass} value={input.priority} onChange={(event) => update("priority", event.target.value as PricingInput["priority"])}><option>Flexible</option><option>Standard</option><option>Priority</option></select>
          </label>
          {input.service === "team-coaching" ? <label className="text-xs font-bold text-[#cdd1ce]">Team size<select className={inputClass} value={input.teamSize} onChange={(event) => update("teamSize", Number(event.target.value))}>{[2, 3, 4, 5].map((count) => <option key={count}>{count}</option>)}</select></label> : null}
          <label className="text-xs font-bold text-[#cdd1ce] sm:col-span-2">Preferred heroes <span className="font-normal text-mist">(optional, comma-separated)</span>
            <input className={inputClass} value={heroes} onChange={(event) => setHeroes(event.target.value)} placeholder="e.g. Juggernaut, Luna, Sven" maxLength={160} />
          </label>
        </div>
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-cyan/15 bg-cyan/[0.05] p-4 text-xs leading-5 text-[#aeb9b7]"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-cyan" /><p>Never enter Steam credentials, passwords, authentication codes, or recovery codes. Your account stays under your control.</p></div>
      </div>

      {!compact ? <aside className="surface top-24 rounded-[1.6rem] p-6 lg:sticky">
        <div className="flex items-center justify-between"><p className="text-xs font-black tracking-[0.13em] uppercase">Plan estimate</p><span className="text-[0.6rem] font-bold text-cyan uppercase">CAD</span></div>
        <div className="mt-6 space-y-3">
          {quote.lines.map((line) => <div key={line.label} className="flex items-start justify-between gap-5 text-sm"><span className="text-mist">{line.label}</span><span className="font-semibold">{line.amount < 0 ? "−" : ""}{formatCurrency(Math.abs(line.amount))}</span></div>)}
          {quote.discount ? <div className="flex justify-between gap-5 text-sm text-cyan"><span>Multi-session saving</span><span>−{formatCurrency(quote.discount)}</span></div> : null}
        </div>
        <div className="mt-6 flex items-end justify-between border-t border-white/[0.09] pt-5"><div><p className="text-[0.62rem] font-bold tracking-wider text-mist uppercase">Estimated total</p><p className="mt-1 text-3xl font-black">{formatCurrency(quote.total)}</p></div><Badge tone="gold">One-time</Badge></div>
        <Button onClick={startCheckout} disabled={busy} className="mt-6 w-full">{busy ? <><LoaderCircle className="size-4 animate-spin" />Preparing checkout</> : "Continue securely"}</Button>
        {error ? <p role="alert" className="mt-3 text-xs leading-5 text-[#ef9a9a]">{error}</p> : null}
        <ul className="mt-5 space-y-2 text-[0.68rem] text-mist"><li className="flex gap-2"><Check className="size-3.5 text-cyan" />Price recalculated on the server</li><li className="flex gap-2"><Check className="size-3.5 text-cyan" />Coach availability confirmed after payment</li><li className="flex gap-2"><Check className="size-3.5 text-cyan" />No MMR or rank result is guaranteed</li></ul>
      </aside> : null}
    </div>
  );
}
