import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Route, Target } from "lucide-react";
import { rankMedals } from "@/lib/data/ranks";

export function FinalRouteCta() {
  return (
    <section className="war-final" aria-labelledby="war-final-title">
      <div className="war-final__contours" aria-hidden="true" />
      <div className="container-shell war-final__inner">
        <div className="war-final__copy" data-war-reveal>
          <p className="war-kicker"><span>Final checkpoint</span><i /> Route ready</p>
          <h2 id="war-final-title">Set the objective.<br />Take the highground.</h2>
          <p>Open the live configurator to define scope, confirm eligibility, and receive the server-priced route before checkout.</p>
          <div>
            <Link href="/pricing" className="war-action-button"><span>Forge rank route</span><ArrowRight /></Link>
            <Link href="/services" className="war-text-link">Compare contracts <ArrowUpRight /></Link>
          </div>
        </div>

        <div className="war-final__target" data-war-reveal aria-label="Example completed route to Ancient rank">
          <div className="war-final__target-head"><Target aria-hidden="true" /><span>Target checkpoint</span><small>Example objective</small></div>
          <Image src={rankMedals.Ancient.image} alt="Ancient rank medal" width={190} height={190} />
          <strong>Ancient II</strong>
          <div className="war-final__route"><span>Legend III</span><i><Route /></i><span>Ancient II</span></div>
        </div>
      </div>
    </section>
  );
}
