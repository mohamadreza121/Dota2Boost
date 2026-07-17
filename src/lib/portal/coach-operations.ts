import { createClient } from "@/lib/supabase/server";

export interface CoachAssignment {
  id: string;
  orderId: string;
  publicReference: string;
  status: "assigned" | "accepted" | "declined" | "replaced" | "completed" | "cancelled" | "proposed";
  compensationAmount: number;
  serviceName: string;
  scope: string;
  progressPercent: number;
  completedMilestones: number;
  totalMilestones: number;
  assignedAt: string;
}

export interface CoachOperations {
  isAvailable: boolean;
  tier: string;
  currentRank: string;
  averageRating: number;
  completedSessions: number;
  assignments: CoachAssignment[];
  pendingCount: number;
  activeCount: number;
  earningsReserved: number;
  earningsReleased: number;
}

type RawAssignment = { id: string; order_id: string; status: CoachAssignment["status"]; compensation_amount: number; assigned_at: string };
type RawOrder = { id: string; public_reference: string; service_id: string; requirements: Record<string, unknown> | null };
type RawService = { id: string; name: string; slug: string };
type RawMilestone = { order_id: string; status: string };

function text(value: unknown) { return typeof value === "string" && value.trim() ? value.trim() : null; }
function number(value: unknown) { return typeof value === "number" && Number.isFinite(value) ? value : null; }

function scope(slug: string, requirements: Record<string, unknown>) {
  const current = text(requirements.current_rank);
  const target = text(requirements.target_rank);
  const mmr = number(requirements.mmr_amount);
  const matches = number(requirements.match_count);
  const wins = number(requirements.win_count);
  if (slug === "mmr-boost") return [current && target ? `${current} → ${target}` : null, mmr ? `+${mmr.toLocaleString()} MMR` : null].filter(Boolean).join(" · ") || "MMR climb";
  if (slug === "mmr-calibration") return `${matches ?? 5} calibration matches`;
  if (slug === "win-boost") return `${wins ?? 0} assisted wins`;
  if (slug === "behavior-score-boost") return "Behavior score recovery";
  return "Dota 2 coaching";
}

export async function getCoachOperations(coachId: string): Promise<CoachOperations | null> {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("coach_profiles")
    .select("is_available, tier, current_rank, average_rating, completed_sessions")
    .eq("profile_id", coachId)
    .single();
  if (!profile) return null;

  const { data: assignmentRows } = await supabase
    .from("order_assignments")
    .select("id, order_id, status, compensation_amount, assigned_at")
    .eq("coach_id", coachId)
    .in("status", ["assigned", "accepted"])
    .order("assigned_at", { ascending: false });
  const assignments = (assignmentRows ?? []) as unknown as RawAssignment[];
  const orderIds = assignments.map((assignment) => assignment.order_id);
  const [{ data: orderRows }, { data: transferRows }] = await Promise.all([
    orderIds.length ? supabase.from("orders").select("id, public_reference, service_id, requirements").in("id", orderIds) : Promise.resolve({ data: [] }),
    supabase.from("transfers").select("amount, status").eq("coach_id", coachId)
  ]);
  const orders = (orderRows ?? []) as unknown as RawOrder[];
  const serviceIds = [...new Set(orders.map((order) => order.service_id))];
  const [{ data: serviceRows }, { data: milestoneRows }] = await Promise.all([
    serviceIds.length ? supabase.from("services").select("id, name, slug").in("id", serviceIds) : Promise.resolve({ data: [] }),
    orderIds.length ? supabase.from("order_milestones").select("order_id, status").in("order_id", orderIds) : Promise.resolve({ data: [] })
  ]);
  const orderMap = new Map(orders.map((order) => [order.id, order]));
  const serviceMap = new Map(((serviceRows ?? []) as unknown as RawService[]).map((service) => [service.id, service]));
  const milestoneMap = new Map<string, RawMilestone[]>();
  for (const milestone of (milestoneRows ?? []) as unknown as RawMilestone[]) milestoneMap.set(milestone.order_id, [...(milestoneMap.get(milestone.order_id) ?? []), milestone]);
  const mapped = assignments.flatMap((assignment) => {
    const order = orderMap.get(assignment.order_id);
    if (!order) return [];
    const service = serviceMap.get(order.service_id) ?? { id: order.service_id, name: "Dota 2 service", slug: "coaching" };
    const milestones = milestoneMap.get(order.id) ?? [];
    const completed = milestones.filter((milestone) => ["approved", "completed"].includes(milestone.status)).length;
    return [{
      id: assignment.id,
      orderId: order.id,
      publicReference: order.public_reference,
      status: assignment.status,
      compensationAmount: assignment.compensation_amount,
      serviceName: service.name,
      scope: scope(service.slug, order.requirements ?? {}),
      progressPercent: milestones.length ? Math.round((completed / milestones.length) * 100) : 0,
      completedMilestones: completed,
      totalMilestones: milestones.length,
      assignedAt: assignment.assigned_at
    }];
  });
  const transfers = (transferRows ?? []) as Array<{ amount: number; status: string }>;
  return {
    isAvailable: Boolean(profile.is_available), tier: profile.tier as string, currentRank: profile.current_rank as string,
    averageRating: Number(profile.average_rating ?? 0), completedSessions: Number(profile.completed_sessions ?? 0),
    assignments: mapped, pendingCount: mapped.filter((assignment) => assignment.status === "assigned").length,
    activeCount: mapped.filter((assignment) => assignment.status === "accepted").length,
    earningsReserved: mapped.filter((assignment) => assignment.status === "accepted").reduce((sum, assignment) => sum + assignment.compensationAmount, 0),
    earningsReleased: transfers.filter((transfer) => transfer.status === "created").reduce((sum, transfer) => sum + Number(transfer.amount), 0)
  };
}
