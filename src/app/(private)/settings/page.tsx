import { requireRole } from "@/lib/auth/session";
import prisma from "@/lib/dbClient/prisma";
import WorkspaceSettingsForm from "@/components/settings/WorkspaceSettingsForm";

const SettingsPage = async () => {
  await requireRole(["owner", "admin"]);

  const workspace = await prisma.workspace.findFirst();

  if (!workspace) return null;

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Workspace settings</h1>
        <p className="text-muted-foreground text-sm">
          Manage workspace name and description.
        </p>
      </div>
      <WorkspaceSettingsForm
        workspace={{ name: workspace.name, description: workspace.description }}
      />
    </section>
  );
};

export default SettingsPage;
