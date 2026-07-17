import Link from "next/link";
import { ArrowUpRight, ChevronRight, Gem, Sparkles } from "lucide-react";
import { RankMedal } from "@/components/commerce/rank-medal";
import { rankFamilies } from "@/lib/data/ranks";

const divisions = ["I", "II", "III", "IV", "V"] as const;

export function RankLadder() {
  return (
    <section className="war-ranks war-section dota-rank-journey" data-rank-journey>
      <div className="war-ranks__glow dota-rank-journey__glow" aria-hidden="true" />
      <div className="dota-rank-journey__stars" aria-hidden="true"><span /><span /><span /><span /></div>

      <div className="dota-rank-journey__sticky">
        <div className="container-shell">
          <div className="war-section-heading war-section-heading--split dota-heading" data-reveal>
            <div>
              <div className="war-chapter"><span>03</span><i /> Medal ascent</div>
              <h2>Every star.<br /><em>Every division.</em></h2>
            </div>
            <div>
              <p>No vague medal-family packages. Trace the exact route from your current division to the target and watch the campaign advance toward Immortal.</p>
              <Link href="/pricing">Open medal forge <ArrowUpRight /></Link>
            </div>
          </div>

          <div className="dota-rank-journey__hud" data-reveal>
            <span><small>Current position</small><strong>Legend III</strong></span>
            <div><i /><b /><i /></div>
            <span><small>Target territory</small><strong>Ancient II</strong></span>
            <p><Gem /> +700 MMR route · Duo Queue · North America</p>
          </div>
        </div>

        <div className="dota-rank-journey__viewport">
          <div className="war-rank-path dota-rank-journey__track">
            <div className="war-rank-path__line dota-rank-journey__line" aria-hidden="true"><span /></div>
            {rankFamilies.map((rank, index) => (
              <div
                key={rank}
                className={`war-rank-step dota-rank-step ${rank === "Legend" ? "is-current" : ""} ${rank === "Ancient" ? "is-target" : ""}`}
              >
                <span className="war-rank-step__index">{String(index + 1).padStart(2, "0")}</span>
                <div className="dota-rank-step__platform" aria-hidden="true"><i /><i /></div>
                <RankMedal rank={rank} size="lg" className="war-rank-step__medal dota-rank-step__medal" />
                {rank === "Immortal" ? (
                  <div className="war-rank-step__divisions"><b><Sparkles /> Leaderboard</b></div>
                ) : (
                  <div className="war-rank-step__divisions">
                    {divisions.map((division) => <span key={division}>{division}</span>)}
                  </div>
                )}
                <strong className="dota-rank-step__name">{rank}</strong>
                {rank !== "Immortal" ? <ChevronRight className="war-rank-step__arrow" aria-hidden="true" /> : null}
              </div>
            ))}
          </div>
        </div>

        <div className="container-shell dota-rank-journey__footer">
          <span>Scroll to travel through the medal archive</span>
          <div><i /></div>
          <p>Exact eligibility and final pricing are confirmed in the configurator.</p>
        </div>
      </div>
    </section>
  );
}
