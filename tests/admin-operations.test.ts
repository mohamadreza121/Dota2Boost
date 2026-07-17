import { describe, expect, it } from "vitest";
import { adminOperationSchema } from "@/lib/validation/admin-operations";

const id = "b41ce5d8-95ec-4d90-9805-ff5d95c74b87";

describe("admin operation validation", () => {
  it("requires an auditable reason", () => {
    expect(adminOperationSchema.safeParse({ action: "order.status", entityId: id, reason: "too short", payload: { status: "in_progress" } }).success).toBe(false);
  });

  it("accepts a controlled order transition request", () => {
    expect(adminOperationSchema.safeParse({ action: "order.status", entityId: id, reason: "Customer and booster confirmed the queue started.", payload: { status: "in_progress" } }).success).toBe(true);
  });

  it("requires a written decision when resolving a dispute", () => {
    expect(adminOperationSchema.safeParse({ action: "dispute.status", entityId: id, reason: "Reviewed delivery evidence and customer messages.", payload: { status: "closed", decision: "Done" } }).success).toBe(false);
    expect(adminOperationSchema.safeParse({ action: "dispute.status", entityId: id, reason: "Reviewed delivery evidence and customer messages.", payload: { status: "closed", decision: "Delivery evidence supports closing the case without adjustment." } }).success).toBe(true);
  });

  it("bounds booster compensation in server cents", () => {
    expect(adminOperationSchema.safeParse({ action: "order.assign", entityId: id, reason: "Matched region, rank, role, language, and availability.", payload: { coachId: id, compensationAmount: 25000 } }).success).toBe(true);
    expect(adminOperationSchema.safeParse({ action: "order.assign", entityId: id, reason: "Matched region, rank, role, language, and availability.", payload: { coachId: id, compensationAmount: -1 } }).success).toBe(false);
  });
});
