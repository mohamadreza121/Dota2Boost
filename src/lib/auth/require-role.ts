import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { AppRole, PortalUser } from "@/types/domain";

export async function requireRole(allowed: readonly AppRole[]): Promise<PortalUser> {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) redirect("/auth/sign-in");

  const { data: profile } = await supabase.from("profiles").select("display_name, role").eq("id", user.id).single();
  if (!profile || !allowed.includes(profile.role as AppRole)) redirect("/auth/unauthorized");
  return { id: user.id, email: user.email ?? "", displayName: profile.display_name ?? "Player", role: profile.role as AppRole };
}
