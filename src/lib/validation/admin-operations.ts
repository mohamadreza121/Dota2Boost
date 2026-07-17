import { z } from "zod";

const base = {
  entityId: z.uuid(),
  reason: z.string().trim().min(10).max(500)
};

export const adminOperationSchema = z.discriminatedUnion("action", [
  z.object({ ...base, action: z.literal("order.status"), payload: z.object({ status: z.enum(["paid", "matching", "coach_assigned", "awaiting_customer", "in_progress", "delivery_submitted", "customer_review", "completed", "disputed", "cancelled", "refunded"]) }) }),
  z.object({ ...base, action: z.literal("order.deadline"), payload: z.object({ deadlineAt: z.iso.datetime().nullable() }) }),
  z.object({ ...base, action: z.literal("order.assign"), payload: z.object({ coachId: z.uuid(), compensationAmount: z.number().int().min(0).max(1_000_000) }) }),
  z.object({ ...base, action: z.literal("application.status"), payload: z.object({ status: z.enum(["submitted", "under_review", "verification_required", "skill_assessment", "interview", "trial_assignment", "approved", "rejected", "suspended"]) }) }),
  z.object({ ...base, action: z.literal("profile.status"), payload: z.object({ status: z.enum(["active", "invited", "suspended", "closed"]) }) }),
  z.object({ ...base, action: z.literal("review.moderate"), payload: z.object({ isPublic: z.boolean(), isVerified: z.boolean(), moderatedContent: z.string().trim().max(4000).nullable().optional() }) }),
  z.object({ ...base, action: z.literal("dispute.status"), payload: z.object({ status: z.enum(["opened", "awaiting_customer", "awaiting_coach", "under_review", "resolved_customer", "resolved_coach", "partial_refund", "closed"]), decision: z.string().trim().max(4000).nullable().optional() }) })
]).superRefine((input, context) => {
  if (input.action === "dispute.status" && ["resolved_customer", "resolved_coach", "partial_refund", "closed"].includes(input.payload.status) && (!input.payload.decision || input.payload.decision.length < 10)) {
    context.addIssue({ code: "custom", path: ["payload", "decision"], message: "A decision of at least 10 characters is required to resolve a dispute." });
  }
});

export type AdminOperationInput = z.infer<typeof adminOperationSchema>;
