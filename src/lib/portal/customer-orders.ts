import { createClient } from "@/lib/supabase/server";

export type CustomerOrderStatus = "draft" | "payment_pending" | "paid" | "matching" | "coach_assigned" | "awaiting_customer" | "in_progress" | "delivery_submitted" | "customer_review" | "completed" | "disputed" | "cancelled" | "refunded";

export interface CustomerOrderSummary {
  id: string;
  publicReference: string;
  status: CustomerOrderStatus;
  serviceName: string;
  serviceSlug: string;
  scope: string;
  progressPercent: number;
  completedMilestones: number;
  totalMilestones: number;
  createdAt: string;
  requirements: Record<string, unknown>;
}

type RawOrder = {
  id: string;
  public_reference: string;
  status: CustomerOrderStatus;
  service_id: string;
  requirements: Record<string, unknown> | null;
  created_at: string;
};

type RawService = { id: string; name: string; slug: string };
type RawMilestone = { order_id: string; status: string };

function textValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function numberValue(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function describeScope(serviceSlug: string, requirements: Record<string, unknown>) {
  const currentRank = textValue(requirements.current_rank) ?? textValue(requirements.currentRank);
  const targetRank = textValue(requirements.target_rank) ?? textValue(requirements.targetRank);
  const mmr = numberValue(requirements.mmr_amount) ?? numberValue(requirements.mmrAmount);
  const currentMmr = numberValue(requirements.current_mmr) ?? numberValue(requirements.currentMmr);
  const targetMmr = numberValue(requirements.target_mmr) ?? numberValue(requirements.targetMmr);
  const wins = numberValue(requirements.win_count) ?? numberValue(requirements.winCount);
  const matches = numberValue(requirements.match_count) ?? numberValue(requirements.matchCount);
  const lowPriorityWins = numberValue(requirements.low_priority_wins) ?? numberValue(requirements.lowPriorityWins);
  const score = numberValue(requirements.behavior_score_amount) ?? numberValue(requirements.behaviorScoreAmount);
  const mode = textValue(requirements.boost_mode) ?? textValue(requirements.boostMode);

  if (serviceSlug === "mmr-boost") return [currentMmr !== null && targetMmr !== null ? `${currentMmr.toLocaleString()} → ${targetMmr.toLocaleString()} MMR` : currentRank && targetRank ? `${currentRank} → ${targetRank}` : null, mmr ? `+${mmr.toLocaleString()} MMR` : null, mode].filter(Boolean).join(" · ") || "Configured MMR climb";
  if (serviceSlug === "mmr-calibration") return [matches ? `${matches} assisted calibration games` : "Calibration assistance", mode].filter(Boolean).join(" · ");
  if (serviceSlug === "low-priority-recovery") return lowPriorityWins ? `${lowPriorityWins} required Single Draft wins · ${mode ?? "Guided self-play"}` : "Low Priority Recovery Assist";
  if (serviceSlug === "behavior-score-boost") return score ? `+${score.toLocaleString()} behavior score scope` : "Behavior score recovery";
  if (serviceSlug === "win-boost") return wins ? `${wins} assisted wins` : "Assisted win package";
  return "Private Dota 2 coaching";
}

export async function getCustomerOrders(customerId: string): Promise<CustomerOrderSummary[]> {
  const supabase = await createClient();
  const { data: orderRows } = await supabase
    .from("orders")
    .select("id, public_reference, status, service_id, requirements, created_at")
    .eq("customer_id", customerId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  const orders = (orderRows ?? []) as unknown as RawOrder[];
  if (!orders.length) return [];

  const orderIds = orders.map((order) => order.id);
  const serviceIds = [...new Set(orders.map((order) => order.service_id))];
  const [{ data: serviceRows }, { data: milestoneRows }] = await Promise.all([
    supabase.from("services").select("id, name, slug").in("id", serviceIds),
    supabase.from("order_milestones").select("order_id, status").in("order_id", orderIds)
  ]);
  const services = new Map(((serviceRows ?? []) as unknown as RawService[]).map((service) => [service.id, service]));
  const milestoneMap = new Map<string, RawMilestone[]>();
  for (const milestone of (milestoneRows ?? []) as unknown as RawMilestone[]) {
    milestoneMap.set(milestone.order_id, [...(milestoneMap.get(milestone.order_id) ?? []), milestone]);
  }

  return orders.map((order) => {
    const service = services.get(order.service_id) ?? { id: order.service_id, name: "Dota 2 service", slug: "coaching" };
    const milestones = milestoneMap.get(order.id) ?? [];
    const completed = milestones.filter((milestone) => ["approved", "completed"].includes(milestone.status)).length;
    const progressPercent = milestones.length ? Math.round((completed / milestones.length) * 100) : 0;
    const requirements = order.requirements ?? {};
    return {
      id: order.id,
      publicReference: order.public_reference,
      status: order.status,
      serviceName: service.name,
      serviceSlug: service.slug,
      scope: describeScope(service.slug, requirements),
      progressPercent,
      completedMilestones: completed,
      totalMilestones: milestones.length,
      createdAt: order.created_at,
      requirements
    };
  });
}

export async function getCustomerOrder(customerId: string, orderId: string) {
  const orders = await getCustomerOrders(customerId);
  return orders.find((order) => order.id === orderId) ?? null;
}

export async function getCustomerConversationId(customerId: string, orderId: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("conversations").select("id, conversation_members!inner(user_id, removed_at)").eq("order_id", orderId).eq("conversation_members.user_id", customerId).is("conversation_members.removed_at", null).maybeSingle();
  return data?.id ?? null;
}
