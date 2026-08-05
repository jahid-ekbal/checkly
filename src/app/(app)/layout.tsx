import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import prisma from "@/lib/dbClient/prisma";
import Header from "@/components/app/Header";

const AppLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await requireUser();

  const workspace = await prisma.workspace.findFirst();

  if (!workspace) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-dvh">
      <Header
        user={{
          name: session.user.name,
          email: session.user.email,
          role: session.user.role ?? "member",
        }}
        workspaceName={workspace.name}
      />
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
};

export default AppLayout;
