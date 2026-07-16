import "server-only";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { AppRole } from "@/types/domain";

export interface ApiPrincipal {
  user: User;
  role: AppRole;
  displayName: string;
}

export async function getApiPrincipal(): Promise<ApiPrincipal | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("role, display_name, status").eq("id", user.id).single();
  if (!profile || profile.status !== "active") return null;
  return { user, role: profile.role as AppRole, displayName: profile.display_name as string };
}
