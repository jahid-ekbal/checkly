"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import WorkspaceSettingsForm from "@/components/settings/WorkspaceSettingsForm";
import { apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth/auth-client";

const SettingsPage = () => {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [workspace, setWorkspace] = useState<{
    name: string;
    description: string;
  } | null>(null);

  useEffect(() => {
    if (session && session.user.role !== "admin") {
      router.replace("/dashboard");
      return;
    }
    void apiFetch<{ workspace: { name: string; description: string } }>(
      "/api/workspace",
    )
      .then((data) => setWorkspace(data.workspace))
      .catch(() => {
        // leave workspace null
      });
  }, [session, router]);

  if (!session || session.user.role !== "admin") {
    return (
      <div className="text-muted-foreground rounded-lg border p-12 text-center">
        <p className="text-foreground font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Workspace settings</h1>
        <p className="text-muted-foreground text-sm">
          Manage workspace name and description.
        </p>
      </div>
      {workspace && <WorkspaceSettingsForm workspace={workspace} />}
    </section>
  );
};

export default SettingsPage;
