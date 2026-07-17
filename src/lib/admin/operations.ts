import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export interface AdminOrderRow { id: string; reference: string; service: string; customer: string; customerId: string; status: string; priority: string; total: number; deadlineAt: string | null; createdAt: string; coach: string | null }
export interface AdminPersonRow { id: string; name: string; role: string; status: string; createdAt: string; lastSeenAt: string | null }
export interface AdminBoosterRow { id: string; name: string; rank: string; tier: string; verification: string; available: boolean; public: boolean; rating: number; completed: number }
export interface AdminApplicationRow { id: string; name: string; email: string; rank: string; region: string; status: string; createdAt: string }
export interface AdminPaymentRow { id: string; reference: string; customer: string; status: string; amount: number; refunded: number; currency: string; createdAt: string }
export interface AdminDisputeRow { id: string; reference: string; openedBy: string; reason: string; status: string; description: string; amount: number; decision: string | null; createdAt: string }
export interface AdminReviewRow { id: string; reference: string; customer: string; coach: string; rating: number; feedback: string; public: boolean; verified: boolean; createdAt: string }
export interface AdminRefundRow { id: string; reference: string; status: string; requested: number; approved: number | null; reason: string; createdAt: string }
export interface AdminAuditRow { id: string; actor: string; action: string; entityType: string; reason: string | null; createdAt: string }

export interface AdminOperationsSnapshot {
  generatedAt: string;
  metrics: { grossRevenue: number; netRevenue: number; activeOrders: number; unassignedOrders: number; pendingApplications: number; openDisputes: number; pendingRefunds: number; satisfaction: number; customers: number; availableBoosters: number; refundRate: number };
  orders: AdminOrderRow[];
  customers: AdminPersonRow[];
  boosters: AdminBoosterRow[];
  applications: AdminApplicationRow[];
  payments: AdminPaymentRow[];
  disputes: AdminDisputeRow[];
  reviews: AdminReviewRow[];
  refunds: AdminRefundRow[];
  audit: AdminAuditRow[];
}

type Row = Record<string, unknown>;
const text = (value: unknown, fallback = "—") => typeof value === "string" && value.trim() ? value.trim() : fallback;
const number = (value: unknown) => typeof value === "number" ? value : Number(value ?? 0);

export async function getAdminOperationsSnapshot(): Promise<AdminOperationsSnapshot> {
  const admin = createAdminClient();
  const results = await Promise.all([
    admin.from("orders").select("id, public_reference, customer_id, service_id, status, priority, total_amount, deadline_at, created_at").is("deleted_at", null).order("created_at", { ascending: false }).limit(100),
    admin.from("profiles").select("id, display_name, role, status, created_at, last_seen_at").is("deleted_at", null).order("created_at", { ascending: false }).limit(300),
    admin.from("services").select("id, name"),
    admin.from("order_assignments").select("order_id, coach_id, status").in("status", ["assigned", "accepted"]),
    admin.from("coach_profiles").select("profile_id, current_rank, tier, verification_status, is_available, is_public, average_rating, completed_sessions").is("deleted_at", null),
    admin.from("coach_applications").select("id, display_name, email, current_rank, country, status, created_at").is("deleted_at", null).order("created_at", { ascending: false }).limit(100),
    admin.from("payments").select("id, order_id, customer_id, status, gross_amount, refunded_amount, currency, created_at").order("created_at", { ascending: false }).limit(150),
    admin.from("disputes").select("id, order_id, opened_by, reason, description, status, refund_amount, decision, created_at").is("deleted_at", null).order("created_at", { ascending: false }).limit(100),
    admin.from("reviews").select("id, order_id, customer_id, coach_id, rating, feedback, is_public, is_verified, created_at").is("deleted_at", null).order("created_at", { ascending: false }).limit(100),
    admin.from("refund_requests").select("id, order_id, status, requested_amount, approved_amount, reason, created_at").order("created_at", { ascending: false }).limit(100),
    admin.from("audit_logs").select("id, actor_id, action, entity_type, reason, created_at").order("created_at", { ascending: false }).limit(100)
  ]);
  const failed = results.find((result) => result.error);
  if (failed?.error) throw new Error(`Admin operations query failed: ${failed.error.message}`);
  const [orderResult, profileResult, serviceResult, assignmentResult, coachResult, applicationResult, paymentResult, disputeResult, reviewResult, refundResult, auditResult] = results;
  const rawOrders = (orderResult.data ?? []) as Row[];
  const rawProfiles = (profileResult.data ?? []) as Row[];
  const rawServices = (serviceResult.data ?? []) as Row[];
  const rawAssignments = (assignmentResult.data ?? []) as Row[];
  const rawCoaches = (coachResult.data ?? []) as Row[];
  const rawApplications = (applicationResult.data ?? []) as Row[];
  const rawPayments = (paymentResult.data ?? []) as Row[];
  const rawDisputes = (disputeResult.data ?? []) as Row[];
  const rawReviews = (reviewResult.data ?? []) as Row[];
  const rawRefunds = (refundResult.data ?? []) as Row[];
  const rawAudit = (auditResult.data ?? []) as Row[];
  const profiles = new Map(rawProfiles.map((row) => [String(row.id), text(row.display_name, "Unknown user")]));
  const services = new Map(rawServices.map((row) => [String(row.id), text(row.name, "Dota 2 service")]));
  const orderReferences = new Map(rawOrders.map((row) => [String(row.id), text(row.public_reference, "Order")]));
  const assignments = new Map(rawAssignments.map((row) => [String(row.order_id), row]));
  const paidStatuses = new Set(["succeeded", "partially_refunded", "refunded"]);
  const activeStatuses = new Set(["paid", "matching", "coach_assigned", "awaiting_customer", "in_progress", "delivery_submitted", "customer_review", "disputed"]);
  const grossRevenue = rawPayments.filter((row) => paidStatuses.has(String(row.status))).reduce((sum, row) => sum + number(row.gross_amount), 0);
  const refunded = rawPayments.reduce((sum, row) => sum + number(row.refunded_amount), 0);
  const ratings = rawReviews.map((row) => number(row.rating)).filter((rating) => rating > 0);

  return {
    generatedAt: new Date().toISOString(),
    metrics: {
      grossRevenue,
      netRevenue: Math.max(0, grossRevenue - refunded),
      activeOrders: rawOrders.filter((row) => activeStatuses.has(String(row.status))).length,
      unassignedOrders: rawOrders.filter((row) => ["paid", "matching"].includes(String(row.status)) && !assignments.has(String(row.id))).length,
      pendingApplications: rawApplications.filter((row) => !["approved", "rejected", "suspended"].includes(String(row.status))).length,
      openDisputes: rawDisputes.filter((row) => !["resolved_customer", "resolved_coach", "closed"].includes(String(row.status))).length,
      pendingRefunds: rawRefunds.filter((row) => ["requested", "under_review", "approved", "partially_approved"].includes(String(row.status))).length,
      satisfaction: ratings.length ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 0,
      customers: rawProfiles.filter((row) => row.role === "customer" && row.status === "active").length,
      availableBoosters: rawCoaches.filter((row) => row.is_available && row.verification_status === "verified").length,
      refundRate: grossRevenue ? (refunded / grossRevenue) * 100 : 0
    },
    orders: rawOrders.map((row) => { const assignment = assignments.get(String(row.id)); return { id: String(row.id), reference: text(row.public_reference), service: services.get(String(row.service_id)) ?? "Dota 2 service", customer: profiles.get(String(row.customer_id)) ?? "Unknown customer", customerId: String(row.customer_id), status: text(row.status), priority: text(row.priority), total: number(row.total_amount), deadlineAt: typeof row.deadline_at === "string" ? row.deadline_at : null, createdAt: String(row.created_at), coach: assignment ? profiles.get(String(assignment.coach_id)) ?? "Assigned booster" : null }; }),
    customers: rawProfiles.filter((row) => row.role === "customer").map((row) => ({ id: String(row.id), name: text(row.display_name), role: text(row.role), status: text(row.status), createdAt: String(row.created_at), lastSeenAt: typeof row.last_seen_at === "string" ? row.last_seen_at : null })),
    boosters: rawCoaches.map((row) => ({ id: String(row.profile_id), name: profiles.get(String(row.profile_id)) ?? "Booster", rank: text(row.current_rank), tier: text(row.tier), verification: text(row.verification_status), available: Boolean(row.is_available), public: Boolean(row.is_public), rating: number(row.average_rating), completed: number(row.completed_sessions) })),
    applications: rawApplications.map((row) => ({ id: String(row.id), name: text(row.display_name), email: text(row.email), rank: text(row.current_rank), region: text(row.country), status: text(row.status), createdAt: String(row.created_at) })),
    payments: rawPayments.map((row) => ({ id: String(row.id), reference: orderReferences.get(String(row.order_id)) ?? "Order", customer: profiles.get(String(row.customer_id)) ?? "Customer", status: text(row.status), amount: number(row.gross_amount), refunded: number(row.refunded_amount), currency: text(row.currency, "cad"), createdAt: String(row.created_at) })),
    disputes: rawDisputes.map((row) => ({ id: String(row.id), reference: orderReferences.get(String(row.order_id)) ?? "Order", openedBy: profiles.get(String(row.opened_by)) ?? "User", reason: text(row.reason), status: text(row.status), description: text(row.description), amount: number(row.refund_amount), decision: typeof row.decision === "string" ? row.decision : null, createdAt: String(row.created_at) })),
    reviews: rawReviews.map((row) => ({ id: String(row.id), reference: orderReferences.get(String(row.order_id)) ?? "Order", customer: profiles.get(String(row.customer_id)) ?? "Customer", coach: profiles.get(String(row.coach_id)) ?? "Booster", rating: number(row.rating), feedback: text(row.feedback), public: Boolean(row.is_public), verified: Boolean(row.is_verified), createdAt: String(row.created_at) })),
    refunds: rawRefunds.map((row) => ({ id: String(row.id), reference: orderReferences.get(String(row.order_id)) ?? "Order", status: text(row.status), requested: number(row.requested_amount), approved: row.approved_amount === null ? null : number(row.approved_amount), reason: text(row.reason), createdAt: String(row.created_at) })),
    audit: rawAudit.map((row) => ({ id: String(row.id), actor: profiles.get(String(row.actor_id)) ?? "System", action: text(row.action), entityType: text(row.entity_type), reason: typeof row.reason === "string" ? row.reason : null, createdAt: String(row.created_at) }))
  };
}
