import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/dbClient/prisma";
import { updateWorkspaceSchema } from "@/lib/zodSchema";

export const GET = async () => {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const workspace = await prisma.workspace.findFirst();
  return NextResponse.json({
    workspace: {
      name: workspace?.name ?? "Checkly",
      description: workspace?.description ?? "",
    },
  });
};

export const PATCH = async (req: Request) => {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = updateWorkspaceSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const workspace = await prisma.workspace.findFirst();
  if (!workspace) {
    return NextResponse.json({ error: "No workspace" }, { status: 404 });
  }

  const updated = await prisma.workspace.update({
    where: { id: workspace.id },
    data: parsed.data,
  });

  return NextResponse.json({
    workspace: { name: updated.name, description: updated.description },
  });
};
