"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AvailabilityToggle({ initialAvailable }: { initialAvailable: boolean }) {
  const router = useRouter();
  const [available, setAvailable] = useState(initialAvailable);
  const [pending, setPending] = useState(false);
  async function toggle() {
    setPending(true);
    const next = !available;
    const response = await fetch("/api/coach/availability", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isAvailable: next }) });
    if (response.ok) { setAvailable(next); router.refresh(); }
    setPending(false);
  }
  return <button onClick={toggle} disabled={pending} className={`rounded-full border px-4 py-2.5 text-xs font-bold transition ${available ? "border-cyan/25 bg-cyan/[0.06] text-cyan" : "border-white/15 bg-white/[0.04] text-mist"}`}><span className={`mr-2 inline-block size-1.5 rounded-full ${available ? "bg-cyan" : "bg-mist"}`} />{pending ? "Updating…" : available ? "Available for assignment" : "Not taking assignments"}</button>;
}

export function AssignmentDecision({ assignmentId }: { assignmentId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState<"accept" | "decline" | null>(null);
  async function decide(action: "accept" | "decline") {
    setPending(action);
    const response = await fetch(`/api/coach/assignments/${assignmentId}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action }) });
    if (response.ok) router.refresh();
    setPending(null);
  }
  return <div className="mt-5 flex gap-2 border-t border-white/[0.07] pt-3"><button onClick={() => decide("decline")} disabled={Boolean(pending)} className="rounded-full border border-white/10 px-3 py-2 text-[0.62rem] font-bold text-mist">{pending === "decline" ? "Declining…" : "Decline"}</button><button onClick={() => decide("accept")} disabled={Boolean(pending)} className="rounded-full bg-cyan px-3 py-2 text-[0.62rem] font-black text-[#061011]">{pending === "accept" ? "Accepting…" : "Accept assignment"}</button></div>;
}
