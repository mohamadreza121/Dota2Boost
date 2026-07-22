import { Eye, LockKeyhole, Route } from "lucide-react";

const conditions = [
  {
    icon: LockKeyhole,
    title: "Your account stays in your hands",
    body: "Solo Assist and Duo Queue are customer-operated. No credentials or remote access."
  },
  {
    icon: Route,
    title: "Exact scope before payment",
    body: "The route, service conditions, region, role, and delivery mode are visible before checkout."
  },
  {
    icon: Eye,
    title: "Private progress workspace",
    body: "Scheduling, messages, milestones, and support remain attached to one order record."
  }
] as const;

export function CampaignTrustStrip() {
  return (
    <section className="war-conditions" aria-labelledby="war-conditions-title">
      <div className="container-shell war-conditions__inner">
        <header className="war-conditions__intro" data-war-reveal>
          <p className="war-kicker"><span>Checkpoint</span><i /> Command conditions</p>
          <h2 id="war-conditions-title">Control is a product boundary.</h2>
        </header>
        <div className="war-conditions__route" aria-hidden="true"><i /><i /><i /></div>
        <div className="war-conditions__items">
          {conditions.map((item, index) => {
            const Icon = item.icon;
            return (
              <article key={item.title} data-war-reveal>
                <span><small>0{index + 1}</small><Icon aria-hidden="true" /></span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
