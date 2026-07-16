import type { AppRole } from "@/types/domain";

export const permissions = {
  customer: ["orders:own", "messages:own", "sessions:own", "billing:own", "reviews:create", "disputes:own"],
  coach: ["assignments:own", "messages:assigned", "sessions:assigned", "deliverables:write", "earnings:own"],
  support: ["orders:support", "messages:support", "disputes:assigned", "customers:limited"],
  admin: ["orders:manage", "coaches:manage", "customers:manage", "payments:manage", "pricing:manage", "audit:read"],
  owner: ["platform:manage", "roles:manage", "finance:manage", "audit:read"]
} as const satisfies Record<AppRole, readonly string[]>;

export function roleCan(role: AppRole, permission: string) {
  if (role === "owner") return true;
  return (permissions[role] as readonly string[]).includes(permission);
}
