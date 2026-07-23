import "server-only";

import { z } from "zod";
import { hasSupabaseEnv } from "@/lib/env";
import {
  calculateQuote,
  defaultPricingCatalog,
  defaultPricingRules,
  type PricingCatalog,
  type PricingRule
} from "@/lib/pricing";
import { createAdminClient } from "@/lib/supabase/admin";
import type { PricingInput } from "@/lib/validation/pricing";

const pricingCatalogSchema = z.object({
  version: z.string().min(1).max(40),
  currency: z.literal("cad"),
  minimumTotal: z.number().int().min(0).max(1000000),
  mmrBrackets: z.array(z.object({
    from: z.number().int().min(0).max(6500),
    to: z.number().int().min(0).max(6500),
    ratePer100: z.number().int().positive().max(100000)
  })).min(1).max(30),
  unitPrices: z.object({
    calibrationMatch: z.number().int().positive(),
    lowPriorityWin: z.number().int().positive(),
    behaviorScore500: z.number().int().positive(),
    assistedWin: z.number().int().positive(),
    coachingSession: z.number().int().positive()
  }),
  volumeDiscounts: z.record(z.string(), z.array(z.object({
    minimumUnits: z.number().positive(),
    rate: z.number().min(0).max(0.5)
  })))
});

export async function calculateServerQuote(input: PricingInput) {
  if (!hasSupabaseEnv()) return calculateQuote(input, defaultPricingCatalog, defaultPricingRules);

  const admin = createAdminClient();
  const { data: version, error: versionError } = await admin
    .from("pricing_catalog_versions")
    .select("version, currency, configuration")
    .eq("is_active", true)
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (versionError || !version) throw new Error("Active pricing catalog is unavailable.");
  const configuration = pricingCatalogSchema.parse({
    ...(version.configuration as Record<string, unknown>),
    version: version.version,
    currency: version.currency
  }) as PricingCatalog;

  const { data: service, error: serviceError } = await admin
    .from("services")
    .select("id")
    .eq("slug", input.service)
    .eq("is_active", true)
    .is("deleted_at", null)
    .maybeSingle();
  if (serviceError || !service) throw new Error("The selected service is unavailable.");

  const now = Date.now();
  const { data: rows, error: rulesError } = await admin
    .from("pricing_rules")
    .select("rule_key, conditions, adjustment_type, adjustment_value, priority, valid_from, valid_until")
    .eq("service_id", service.id)
    .eq("is_active", true)
    .order("priority");
  if (rulesError) throw new Error("Pricing rules are unavailable.");

  const rules: PricingRule[] = (rows ?? [])
    .filter((row) => (!row.valid_from || new Date(row.valid_from).getTime() <= now) && (!row.valid_until || new Date(row.valid_until).getTime() > now))
    .map((row) => ({
      key: row.rule_key,
      conditions: row.conditions as Record<string, unknown>,
      adjustmentType: row.adjustment_type as PricingRule["adjustmentType"],
      adjustmentValue: Number(row.adjustment_value),
      priority: row.priority
    }));

  return calculateQuote(input, configuration, rules);
}
