import AppSidebar from "@/components/app/AppSidebar";
import PrivateHeader from "@/components/private/Header";
import { SidebarInset, SidebarProvider } from "@/components/shadcnui/sidebar";
import { requireUser } from "@/lib/auth/session";
import prisma from "@/lib/dbClient/prisma";
import { redirect } from "next/navigation";

const AppLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await requireUser();

  const [user, workspace] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id } }),
    prisma.workspace.findFirst(),
  ]);

  if (!workspace) {
    redirect("/sign-in");
  }

  const currentUser = {
    name: user?.name ?? session.user.name,
    email: user?.email ?? session.user.email,
    username: user?.username ?? null,
    image: user?.image ?? null,
    role: user?.role ?? "member",
  };

  return (
    <SidebarProvider>
      <AppSidebar user={currentUser} />
      <SidebarInset className="min-h-dvh">
        <PrivateHeader
          user={currentUser}
          workspaceName={workspace.name}
        />
        <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AppLayout;
