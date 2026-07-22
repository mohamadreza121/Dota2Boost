import { Check, Eye, LockKeyhole, MessageSquare, Radio, Route, Swords } from "lucide-react";

export function WorkspacePreview({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`war-workspace${compact ? " war-workspace--compact" : ""}`} aria-label="Illustrative private order workspace preview">
      <div className="war-workspace__bar">
        <div><span><LockKeyhole aria-hidden="true" /> Private order</span><small>Illustrative interface preview</small></div>
        <p><i /><span>Campaign active</span></p>
      </div>

      <div className="war-workspace__summary">
        <span><small>Route</small><strong>Legend III → Ancient II</strong></span>
        <span><small>Mode</small><strong>Duo Queue</strong></span>
        <span><small>Region</small><strong>EU West</strong></span>
      </div>

      <div className="war-workspace__body">
        <div className="war-workspace__timeline">
          <div className="is-complete"><span><Check /></span><p><strong>Scope confirmed</strong><small>Rank path, region, role, and mode recorded</small></p></div>
          <div className="is-complete"><span><Check /></span><p><strong>Specialist fit checked</strong><small>Role, language, and schedule aligned</small></p></div>
          <div className="is-active"><span><Swords /></span><p><strong>Delivery checkpoint</strong><small>Progress and order notes remain visible</small></p></div>
          <div><span><Eye /></span><p><strong>Completion review</strong><small>Final status and customer confirmation</small></p></div>
        </div>

        <div className="war-workspace__channel">
          <div className="war-workspace__channel-head"><MessageSquare /><span><strong>Order channel</strong><small>Scheduling and campaign notes</small></span><Radio /></div>
          <div className="war-message war-message--system"><Route /><p><strong>Route locked</strong><small>The selected scope is attached to this order.</small></p></div>
          <div className="war-message"><span>HG</span><p><strong>Operations</strong><small>Your role and schedule preferences are ready for confirmation.</small></p></div>
          {!compact ? <div className="war-message war-message--customer"><span>MK</span><p><strong>Customer</strong><small>Evening queue block works. Keep Mid as the preferred role.</small></p></div> : null}
        </div>
      </div>
    </div>
  );
}
