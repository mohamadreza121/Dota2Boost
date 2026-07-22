import { Check, Crosshair, Radio, ShieldCheck } from "lucide-react";
import { RankRoutePreview } from "@/components/home/rank-route-preview";

const routeFacts = [
  "Medal and MMR target",
  "Server and party eligibility",
  "Preferred role and queue mode",
  "Live quote inside the full configurator"
] as const;

export function ObjectiveRoute() {
  return (
    <section className="war-section war-objective" aria-labelledby="war-objective-title">
      <div className="war-objective__contours" aria-hidden="true" />
      <div className="container-shell">
        <header className="war-heading war-heading--split" data-war-reveal>
          <div>
            <p className="war-kicker"><span>02</span><i /> Define the objective</p>
            <h2 id="war-objective-title">From current medal to target territory.</h2>
          </div>
          <p>
            The route model makes scope visible before checkout. Pricing is produced by the real configurator from the selected service, rank path, server, mode, and eligibility conditions.
          </p>
        </header>

        <div className="war-objective__layout">
          <div className="war-objective__route" data-war-reveal>
            <RankRoutePreview variant="expanded" />
          </div>

          <aside className="war-brief" data-war-reveal aria-label="Campaign brief">
            <div className="war-brief__head"><Crosshair aria-hidden="true" /><span>Campaign brief</span><small>Route 05-A</small></div>
            <h3>No vague medal package. Define every checkpoint.</h3>
            <p>Move by exact division or MMR amount, then confirm the conditions that shape compatibility and delivery.</p>
            <ul>
              {routeFacts.map((fact) => <li key={fact}><Check aria-hidden="true" />{fact}</li>)}
            </ul>
            <div className="war-brief__signals">
              <span><Radio aria-hidden="true" /><small>Status</small><strong>Preview ready</strong></span>
              <span><ShieldCheck aria-hidden="true" /><small>Access</small><strong>Customer controlled</strong></span>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
