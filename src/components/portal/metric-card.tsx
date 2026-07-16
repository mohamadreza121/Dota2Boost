import type { LucideIcon } from "lucide-react";

export function MetricCard({ icon: Icon, label, value, detail, tone = "neutral" }: { icon: LucideIcon; label: string; value: string; detail: string; tone?: "neutral" | "red" | "cyan" | "gold" }) {
  const tones = { neutral: "text-mist bg-white/[0.04]", red: "text-crimson bg-crimson/10", cyan: "text-cyan bg-cyan/10", gold: "text-amber bg-amber/10" };
  return <article className="rounded-2xl border border-white/[0.08] bg-black/15 p-4"><div className={`grid size-8 place-items-center rounded-lg ${tones[tone]}`}><Icon className="size-4" /></div><p className="mt-5 text-[0.58rem] font-bold tracking-[0.11em] text-mist uppercase">{label}</p><p className="mt-1 text-2xl font-black">{value}</p><p className="mt-2 text-[0.65rem] text-mist">{detail}</p></article>;
}
