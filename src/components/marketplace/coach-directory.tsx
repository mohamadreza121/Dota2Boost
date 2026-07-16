"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { BoosterCard } from "@/components/marketplace/coach-card";
import type { Booster } from "@/types/domain";

const controlClass = "min-h-11 rounded-xl border border-white/10 bg-panel px-3 text-xs font-semibold text-[#d4d8d5] focus:border-cyan/60 focus:outline-none";

export function BoosterDirectory({ boosters }: { boosters: Booster[] }) {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("All roles");
  const [region, setRegion] = useState("All regions");
  const [language, setLanguage] = useState("All languages");
  const [tier, setTier] = useState("All tiers");
  const [availability, setAvailability] = useState("Any availability");
  const [minimumRating, setMinimumRating] = useState("0");
  const [maximumPrice, setMaximumPrice] = useState("10000");
  const [boostingType, setBoostingType] = useState("All boost types");

  const visible = useMemo(() => boosters.filter((booster) => {
    const haystack = `${booster.displayName} ${booster.roles.join(" ")} ${booster.specialties.join(" ")} ${booster.currentRank} ${booster.peakRank} ${booster.boostingTypes.join(" ")}`.toLowerCase();
    return haystack.includes(query.toLowerCase())
      && (role === "All roles" || booster.roles.includes(role))
      && (region === "All regions" || booster.region === region)
      && (language === "All languages" || booster.languages.includes(language))
      && (tier === "All tiers" || booster.tier === tier)
      && (availability === "Any availability" || booster.availability === availability)
      && booster.rating >= Number(minimumRating)
      && booster.startingPrice <= Number(maximumPrice)
      && (boostingType === "All boost types" || booster.boostingTypes.includes(boostingType));
  }), [boosters, query, role, region, language, tier, availability, minimumRating, maximumPrice, boostingType]);

  return (
    <div>
      <div className="surface grid gap-3 rounded-2xl p-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="relative lg:col-span-2"><span className="sr-only">Search booster name, rank, role, or specialty</span><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-mist" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, rank, role, specialty…" className={`${controlClass} w-full pl-9`} /></label>
        <select aria-label="Filter by role" className={controlClass} value={role} onChange={(event) => setRole(event.target.value)}><option>All roles</option>{["Carry", "Mid", "Offlane", "Soft Support", "Hard Support"].map((item) => <option key={item}>{item}</option>)}</select>
        <select aria-label="Filter by region" className={controlClass} value={region} onChange={(event) => setRegion(event.target.value)}><option>All regions</option>{Array.from(new Set(boosters.map((booster) => booster.region))).map((item) => <option key={item}>{item}</option>)}</select>
        <select aria-label="Filter by language" className={controlClass} value={language} onChange={(event) => setLanguage(event.target.value)}><option>All languages</option>{Array.from(new Set(boosters.flatMap((booster) => booster.languages))).map((item) => <option key={item}>{item}</option>)}</select>
        <select aria-label="Filter by booster tier" className={controlClass} value={tier} onChange={(event) => setTier(event.target.value)}><option>All tiers</option><option>Pro</option><option>Master</option><option>Elite</option></select>
        <select aria-label="Filter by availability" className={controlClass} value={availability} onChange={(event) => setAvailability(event.target.value)}><option>Any availability</option>{Array.from(new Set(boosters.map((booster) => booster.availability))).map((item) => <option key={item}>{item}</option>)}</select>
        <select aria-label="Filter by minimum rating" className={controlClass} value={minimumRating} onChange={(event) => setMinimumRating(event.target.value)}><option value="0">Any rating</option><option value="4.95">4.95+</option><option value="4.98">4.98+</option></select>
        <select aria-label="Filter by maximum starting price" className={controlClass} value={maximumPrice} onChange={(event) => setMaximumPrice(event.target.value)}><option value="10000">Any price</option><option value="6000">Up to $60</option><option value="7000">Up to $70</option><option value="8000">Up to $80</option></select>
        <select aria-label="Filter by boost type" className={controlClass} value={boostingType} onChange={(event) => setBoostingType(event.target.value)}><option>All boost types</option>{Array.from(new Set(boosters.flatMap((booster) => booster.boostingTypes))).map((item) => <option key={item}>{item}</option>)}</select>
      </div>
      <div className="mt-6 flex items-center justify-between text-xs text-mist"><p>{visible.length} verified booster{visible.length === 1 ? "" : "s"}</p><p className="flex items-center gap-2"><SlidersHorizontal className="size-3.5" />Filters update instantly</p></div>
      {visible.length ? <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{visible.map((booster) => <BoosterCard key={booster.slug} booster={booster} />)}</div> : <div className="mt-7 rounded-2xl border border-dashed border-white/15 py-20 text-center"><p className="font-bold">No exact match yet.</p><p className="mt-2 text-sm text-mist">Clear a filter or ask support for a manual match.</p></div>}
    </div>
  );
}
