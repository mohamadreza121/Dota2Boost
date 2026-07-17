import Link from "next/link";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { RankMedal } from "@/components/commerce/rank-medal";
import { rankFamilies } from "@/lib/data/ranks";

const divisions = ["I", "II", "III", "IV", "V"] as const;

export function RankLadder() {
  return (
    <section className="war-ranks war-section">
      <div className="war-ranks__glow" aria-hidden="true" />
      <div className="container-shell">
        <div className="war-section-heading war-section-heading--split" data-reveal>
          <div>
            <div className="war-chapter"><span>03</span><i /> Medal archive</div>
            <h2>Every star.<br /><em>Every division.</em></h2>
          </div>
          <div>
            <p>No vague “Legend to Ancient” packages. Choose the exact I–V starting point and the exact medal you want to pursue.</p>
            <Link href="/pricing">Open medal configurator <ArrowUpRight /></Link>
          </div>
        </div>

        <div className="war-rank-path" data-reveal>
          <div className="war-rank-path__line" aria-hidden="true" />
          {rankFamilies.map((rank, index) => (
            <div key={rank} className={`war-rank-step ${rank === "Legend" ? "is-current" : ""} ${rank === "Ancient" ? "is-target" : ""}`}>
              <span className="war-rank-step__index">{String(index + 1).padStart(2, "0")}</span>
              <RankMedal rank={rank} size="lg" className="war-rank-step__medal" />
              {rank === "Immortal" ? (
                <div className="war-rank-step__divisions"><b>Leaderboard</b></div>
              ) : (
                <div className="war-rank-step__divisions">
                  {divisions.map((division) => <span key={division}>{division}</span>)}
                </div>
              )}
              {rank !== "Immortal" ? <ChevronRight className="war-rank-step__arrow" aria-hidden="true" /> : null}
            </div>
          ))}
        </div>

        <div className="war-rank-example" data-reveal>
          <span><small>Example start</small><strong>Legend III</strong></span>
          <i />
          <span><small>Example target</small><strong>Ancient I</strong></span>
          <p>Exact route: 3 medal divisions · +500 MMR scope · Duo Queue</p>
        </div>
      </div>
    </section>
  );
}
