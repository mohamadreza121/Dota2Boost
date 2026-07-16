"use client";

import { useMemo, useState } from "react";
import { Check, LoaderCircle, ShieldCheck, TicketPercent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { calculateQuote, type PriceQuote } from "@/lib/pricing";
import { formatCurrency } from "@/lib/utils";
import { rankOptions, type PricingInput } from "@/lib/validation/pricing";

const initialInput: PricingInput = {
  service: "rank-boost",
  currentRank: "Legend",
  targetRank: "Ancient",
  role: "Carry",
  region: "North America",
  language: "English",
  winCount: 5,
  queueMode: "Party Queue",
  boosterTier: "Master",
  priority: "Standard",
  partySize: 1,
  preferredHeroes: []
};

const inputClass = "mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-black/25 px-3.5 text-sm text-white transition focus:border-cyan/60 focus:outline-none";

interface DiscountedQuote {
  quote: PriceQuote;
  promotion?: { code: string; amount: number };
}

export function PricingConfigurator({ compact = false }: { compact?: boolean }) {
  const [input, setInput] = useState<PricingInput>(initialInput);
  const [heroes, setHeroes] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [discountedQuote, setDiscountedQuote] = useState<DiscountedQuote | null>(null);
  const [discountBusy, setDiscountBusy] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const localQuote = useMemo(
    () => calculateQuote({ ...input, discountCode: undefined, preferredHeroes: heroes.split(",").map((hero) => hero.trim()).filter(Boolean).slice(0, 8) }),
    [input, heroes]
  );
  const quote = discountedQuote?.quote ?? localQuote;

  function update<Key extends keyof PricingInput>(key: Key, value: PricingInput[Key]) {
    setInput((current) => ({ ...current, [key]: value }));
    setDiscountedQuote(null);
    setError(null);
  }

  function payload() {
    return {
      ...input,
      discountCode: discountedQuote?.promotion?.code,
      preferredHeroes: heroes.split(",").map((hero) => hero.trim()).filter(Boolean).slice(0, 8)
    };
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
        body: JSON.stringify({ ...payload(), discountCode: code })
      });
      const body = (await response.json()) as DiscountedQuote & { error?: string };
      if (!response.ok) throw new Error(body.error ?? "That code could not be applied.");
      setDiscountedQuote(body);
    } catch (discountError) {
      setDiscountedQuote(null);
      setError(discountError instanceof Error ? discountError.message : "That code could not be applied.");
    } finally {
      setDiscountBusy(false);
    }
  }

  async function startCheckout() {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload())
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
    <div className={`grid gap-5 ${compact ? "" : "lg:grid-cols-[1fr_400px] lg:items-start"}`}>
      <div className="surface rounded-[1.8rem] p-5 sm:p-7">
        <div className="flex flex-col justify-between gap-3 border-b border-white/[0.08] pb-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-[0.65rem] font-bold tracking-[0.15em] text-amber uppercase">Boost configurator</p>
            <h2 className="mt-2 text-xl font-bold">Build your self-play order</h2>
          </div>
          <Badge tone="cyan">Live estimate</Badge>
        </div>

        <div className="mt-6 grid gap-x-5 gap-y-5 sm:grid-cols-2">
          <label className="text-xs font-bold text-[#cdd1ce]">Boosting service
            <select className={inputClass} value={input.service} onChange={(event) => update("service", event.target.value as PricingInput["service"])}>
              <option value="rank-boost">Rank boost</option>
              <option value="win-boost">Win boost</option>
              <option value="calibration-support">Calibration support</option>
              <option value="duo-lane-boost">Duo lane boost</option>
              <option value="mmr-sprint">MMR sprint</option>
              <option value="stack-boost">Stack boost</option>
              <option value="priority-membership">Priority membership</option>
            </select>
          </label>
          <label className="text-xs font-bold text-[#cdd1ce]">Your role
            <select className={inputClass} value={input.role} onChange={(event) => update("role", event.target.value as PricingInput["role"])}>
              {(["Carry", "Mid", "Offlane", "Soft Support", "Hard Support", "Flexible"] as const).map((role) => <option key={role}>{role}</option>)}
            </select>
          </label>
          <label className="text-xs font-bold text-[#cdd1ce]">Current rank
            <select className={inputClass} value={input.currentRank} onChange={(event) => update("currentRank", event.target.value as PricingInput["currentRank"])}>
              {rankOptions.map((rank) => <option key={rank}>{rank}</option>)}
            </select>
          </label>
          <label className="text-xs font-bold text-[#cdd1ce]">Target rank
            <select className={inputClass} value={input.targetRank} onChange={(event) => update("targetRank", event.target.value as PricingInput["targetRank"])}>
              {rankOptions.map((rank) => <option key={rank}>{rank}</option>)}
            </select>
          </label>
          <label className="text-xs font-bold text-[#cdd1ce]">Region
            <select className={inputClass} value={input.region} onChange={(event) => update("region", event.target.value as PricingInput["region"])}>
              {(["North America", "Europe West", "Europe East", "Southeast Asia", "South America", "Australia"] as const).map((region) => <option key={region}>{region}</option>)}
            </select>
          </label>
          <label className="text-xs font-bold text-[#cdd1ce]">Language
            <select className={inputClass} value={input.language} onChange={(event) => update("language", event.target.value)}>
              <option>English</option><option>French</option><option>Spanish</option><option>German</option><option>Mandarin</option><option>Russian</option>
            </select>
          </label>
          <label className="text-xs font-bold text-[#cdd1ce]">Assisted wins
            <select className={inputClass} value={input.winCount} onChange={(event) => update("winCount", Number(event.target.value))}>
              {[3, 5, 7, 10, 15, 20].map((count) => <option key={count} value={count}>{count} wins</option>)}
            </select>
          </label>
          <label className="text-xs font-bold text-[#cdd1ce]">Queue format
            <select className={inputClass} value={input.queueMode} onChange={(event) => update("queueMode", event.target.value as PricingInput["queueMode"])}>
              <option>Party Queue</option><option>Duo Lane</option><option>Full Stack</option>
            </select>
          </label>
          <label className="text-xs font-bold text-[#cdd1ce]">Booster tier
            <select className={inputClass} value={input.boosterTier} onChange={(event) => update("boosterTier", event.target.value as PricingInput["boosterTier"])}>
              <option>Pro</option><option>Master</option><option>Elite</option>
            </select>
          </label>
          <label className="text-xs font-bold text-[#cdd1ce]">Delivery priority
            <select className={inputClass} value={input.priority} onChange={(event) => update("priority", event.target.value as PricingInput["priority"])}>
              <option>Flexible</option><option>Standard</option><option>Priority</option>
            </select>
          </label>
          {input.service === "stack-boost" || input.queueMode === "Full Stack" ? (
            <label className="text-xs font-bold text-[#cdd1ce]">Party size
              <select className={inputClass} value={input.partySize} onChange={(event) => update("partySize", Number(event.target.value))}>
                {[2, 3, 4, 5].map((count) => <option key={count}>{count}</option>)}
              </select>
            </label>
          ) : null}
          <label className="text-xs font-bold text-[#cdd1ce] sm:col-span-2">Preferred heroes <span className="font-normal text-mist">(optional)</span>
            <input className={inputClass} value={heroes} onChange={(event) => { setHeroes(event.target.value); setDiscountedQuote(null); }} placeholder="e.g. Luna, Sven, Crystal Maiden" maxLength={160} />
          </label>
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-xl border border-cyan/15 bg-cyan/[0.05] p-4 text-xs leading-5 text-[#aeb9b7]">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-cyan" />
          <p>You play every match on your own account. Never enter Steam credentials, passwords, authentication codes, recovery codes, or remote-access details.</p>
        </div>
      </div>

      {!compact ? (
        <aside className="surface top-24 rounded-[1.8rem] p-6 lg:sticky">
          <div className="flex items-center justify-between">
            <p className="text-xs font-black tracking-[0.13em] uppercase">Order estimate</p>
            <span className="text-[0.6rem] font-bold text-cyan uppercase">CAD</span>
          </div>
          <div className="mt-6 space-y-3">
            {quote.lines.map((line) => (
              <div key={line.label} className="flex items-start justify-between gap-5 text-sm">
                <span className="text-mist">{line.label}</span>
                <span className="font-semibold">{line.amount < 0 ? "−" : ""}{formatCurrency(Math.abs(line.amount))}</span>
              </div>
            ))}
            {quote.discount ? <div className="flex justify-between gap-5 text-sm text-cyan"><span>Package saving</span><span>−{formatCurrency(quote.discount)}</span></div> : null}
            {discountedQuote?.promotion ? <div className="flex justify-between gap-5 text-sm text-amber"><span>{discountedQuote.promotion.code}</span><span>−{formatCurrency(discountedQuote.promotion.amount)}</span></div> : null}
          </div>

          <div className="mt-6 flex items-end justify-between border-t border-white/[0.09] pt-5">
            <div><p className="text-[0.62rem] font-bold tracking-wider text-mist uppercase">Estimated total</p><p className="mt-1 text-3xl font-black">{formatCurrency(quote.total)}</p></div>
            <Badge tone="gold">Before tax</Badge>
          </div>

          <div className="mt-5 rounded-xl border border-white/[0.08] bg-black/20 p-3">
            <label className="text-[0.62rem] font-bold tracking-wider text-mist uppercase" htmlFor="discount-code">Discount code</label>
            <div className="mt-2 flex gap-2">
              <div className="relative min-w-0 flex-1"><TicketPercent className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-mist" /><input id="discount-code" value={discountCode} onChange={(event) => { setDiscountCode(event.target.value.toUpperCase()); setDiscountedQuote(null); }} maxLength={32} placeholder="HIGHGROUND10" className="min-h-11 w-full rounded-lg border border-white/10 bg-black/30 pl-9 pr-3 text-xs font-bold tracking-wider uppercase focus:border-cyan/60 focus:outline-none" /></div>
              <Button variant="secondary" onClick={applyDiscount} disabled={discountBusy || !discountCode.trim()} className="rounded-lg px-4 text-xs">
                {discountBusy ? <LoaderCircle className="size-4 animate-spin" /> : "Apply"}
              </Button>
            </div>
          </div>

          <Button onClick={startCheckout} disabled={busy} className="mt-5 w-full">
            {busy ? <><LoaderCircle className="size-4 animate-spin" />Preparing checkout</> : "Continue to secure checkout"}
          </Button>
          {error ? <p role="alert" className="mt-3 text-xs leading-5 text-[#ef9a9a]">{error}</p> : null}
          <ul className="mt-5 space-y-2 text-[0.68rem] text-mist">
            <li className="flex gap-2"><Check className="size-3.5 text-cyan" />Price and discount revalidated on the server</li>
            <li className="flex gap-2"><Check className="size-3.5 text-cyan" />Tax calculated securely by Stripe</li>
            <li className="flex gap-2"><Check className="size-3.5 text-cyan" />Compatibility confirmed before delivery</li>
            <li className="flex gap-2"><Check className="size-3.5 text-cyan" />No rank or MMR result is guaranteed</li>
          </ul>
        </aside>
      ) : null}
    </div>
  );
}
