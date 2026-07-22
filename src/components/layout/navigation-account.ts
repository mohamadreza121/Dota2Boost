"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { roles, type AppRole } from "@/types/domain";
import { getWorkspaceMeta, type NavigationAccount } from "@/components/layout/navigation-data";

export function useNavigationAccount() {
  const [account, setAccount] = useState<NavigationAccount>({ status: "guest" });

  useEffect(() => {
    let active = true;
    let supabase: ReturnType<typeof createClient>;

    try {
      supabase = createClient();
    } catch {
      return;
    }

    async function syncAccount() {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!active) return;
      if (!user) {
        setAccount({ status: "guest" });
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, role")
        .eq("id", user.id)
        .maybeSingle();

      if (!active) return;

      const profileRole = profile?.role as AppRole | undefined;
      const role = profileRole && roles.includes(profileRole) ? profileRole : "customer";
      const workspace = getWorkspaceMeta(role);
      const metadataName = typeof user.user_metadata?.display_name === "string" ? user.user_metadata.display_name : "";
      const emailName = user.email?.split("@")[0] ?? "Player";
      const displayName = profile?.display_name?.trim() || metadataName.trim() || emailName;

      setAccount({
        status: "authenticated",
        displayName,
        email: user.email ?? "",
        role,
        workspaceHref: workspace.href,
        workspaceLabel: workspace.label
      });
    }

    void syncAccount();
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(() => {
      void syncAccount();
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  return account;
}
