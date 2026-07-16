import { z } from "zod";

const auditReason = z.string().trim().min(10).max(500);
const commonCatalogFields = { reason: auditReason } as const;

export const catalogMutationSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("service.create"), name: z.string().trim().min(2).max(80), slug: z.string().trim().min(2).max(80).regex(/^[a-z0-9-]+$/), description: z.string().trim().min(20).max(1000), serviceType: z.string().trim().min(2).max(50).regex(/^[a-z0-9_]+$/), sortOrder: z.number().int().min(0).max(10000), isActive: z.boolean(), ...commonCatalogFields }),
  z.object({ action: z.literal("service.update"), id: z.string().uuid(), name: z.string().trim().min(2).max(80), description: z.string().trim().min(20).max(1000), serviceType: z.string().trim().min(2).max(50).regex(/^[a-z0-9_]+$/), sortOrder: z.number().int().min(0).max(10000), isActive: z.boolean(), ...commonCatalogFields }),
  z.object({ action: z.literal("package.create"), serviceId: z.string().uuid(), name: z.string().trim().min(2).max(80), description: z.string().trim().min(10).max(1000), basePrice: z.number().int().min(2500).max(1000000), currency: z.literal("cad"), includedWins: z.number().int().min(1).max(50), sortOrder: z.number().int().min(0).max(10000), isActive: z.boolean(), ...commonCatalogFields }),
  z.object({ action: z.literal("package.update"), id: z.string().uuid(), name: z.string().trim().min(2).max(80), description: z.string().trim().min(10).max(1000), basePrice: z.number().int().min(2500).max(1000000), includedWins: z.number().int().min(1).max(50), sortOrder: z.number().int().min(0).max(10000), isActive: z.boolean(), ...commonCatalogFields }),
  z.object({ action: z.literal("rule.upsert"), id: z.string().uuid().optional(), serviceId: z.string().uuid(), ruleKey: z.string().trim().min(2).max(80).regex(/^[a-z0-9_-]+$/), conditions: z.record(z.string(), z.unknown()), adjustmentType: z.enum(["fixed", "percentage", "multiplier"]), adjustmentValue: z.number().finite().min(-1000000).max(1000000), priority: z.number().int().min(0).max(10000), isActive: z.boolean(), ...commonCatalogFields })
]);

export const discountMutationSchema = z.object({
  id: z.string().uuid().optional(),
  code: z.string().trim().min(3).max(32).regex(/^[A-Za-z0-9_-]+$/).transform((value) => value.toUpperCase()),
  discountType: z.enum(["fixed", "percentage"]),
  discountValue: z.number().int().positive().max(1000000),
  maxRedemptions: z.number().int().positive().max(1000000).nullable(),
  minimumAmount: z.number().int().min(0).max(1000000),
  maximumDiscount: z.number().int().positive().max(1000000).nullable(),
  perCustomerLimit: z.number().int().min(1).max(100),
  activeFrom: z.string().datetime().nullable(),
  activeUntil: z.string().datetime().nullable(),
  isActive: z.boolean(),
  reason: auditReason
}).superRefine((input, context) => {
  if (input.discountType === "percentage" && input.discountValue > 100) context.addIssue({ code: "custom", path: ["discountValue"], message: "Percentage cannot exceed 100." });
  if (input.activeFrom && input.activeUntil && new Date(input.activeUntil) <= new Date(input.activeFrom)) context.addIssue({ code: "custom", path: ["activeUntil"], message: "End must be after start." });
});

export const refundMutationSchema = z.object({
  orderId: z.string().uuid(),
  amount: z.number().int().positive().max(1000000),
  reason: auditReason
});

export const customerRefundRequestSchema = z.object({
  amount: z.number().int().min(100).max(1000000),
  reason: z.string().trim().min(20).max(500)
});
