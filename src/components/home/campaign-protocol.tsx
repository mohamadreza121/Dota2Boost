import Link from "next/link";
import { ArrowUpRight, Check, Crosshair, Medal, Swords, Target } from "lucide-react";
import { WorkspacePreview } from "@/components/home/workspace-preview";

const steps = [
  { number: "01", icon: Target, title: "Define objective", body: "Choose the service, rank scope, region, role, and customer-operated delivery mode." },
  { number: "02", icon: Medal, title: "Confirm eligibility and fit", body: "Operations checks rank, role, language, region, party rules, and schedule compatibility." },
  { number: "03", icon: Swords, title: "Coordinate and play", body: "Queue on your own account and keep communication inside the private order context." },
  { number: "04", icon: Check, title: "Track milestones and completion", body: "Progress, schedule changes, notes, and final confirmation remain attached to the order." }
] as const;

export function CampaignProtocol() {
  return (
    <section className="war-section war-protocol" aria-labelledby="war-protocol-title">
      <div className="container-shell">
        <header className="war-heading war-heading--split" data-war-reveal>
          <div>
            <p className="war-kicker"><span>04</span><i /> Campaign protocol</p>
            <h2 id="war-protocol-title">A clear route from ready check to completion.</h2>
          </div>
          <div className="war-heading__aside">
            <p>Every checkpoint has an owner, a visible status, and a defined next action. Nothing depends on an informal account handoff.</p>
            <Link href="/how-it-works">Inspect the full process <ArrowUpRight /></Link>
          </div>
        </header>

        <div className="war-protocol__layout">
          <ol className="war-protocol__steps">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <li key={step.number} data-war-reveal>
                  <span className="war-protocol__number">{step.number}</span>
                  <span className="war-protocol__icon"><Icon aria-hidden="true" /></span>
                  <div><h3>{step.title}</h3><p>{step.body}</p></div>
                </li>
              );
            })}
          </ol>

          <div className="war-protocol__workspace" data-war-reveal>
            <p className="war-protocol__label"><Crosshair aria-hidden="true" /> One order. One private command channel.</p>
            <WorkspacePreview compact />
          </div>
        </div>
      </div>
    </section>
  );
}
