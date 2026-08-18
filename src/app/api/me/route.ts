import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/dbClient/prisma";

export const GET = async () => {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [user, workspace, myTasks] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id } }),
    prisma.workspace.findFirst(),
    prisma.task.findMany({
      where: { assigneeId: session.user.id, done: false },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, title: true, priority: true, dueDate: true },
    }),
  ]);

  return NextResponse.json({
    user: {
      id: user?.id ?? session.user.id,
      name: user?.name ?? session.user.name,
      email: user?.email ?? session.user.email,
      image: user?.image ?? null,
      banner: user?.banner ?? null,
      bio: user?.bio ?? null,
      createdAt: (user?.createdAt ?? session.user.createdAt).toISOString(),
    },
    workspace: { name: workspace?.name ?? "Checkly" },
    myTasks: myTasks.map((task) => ({
      id: task.id,
      title: task.title,
      priority: task.priority,
      dueDate: task.dueDate?.toISOString() ?? null,
    })),
  });
};
