import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/dbClient/prisma";

export const GET = async () => {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(now.getDate() - ((now.getDay() + 6) % 7));

  const [user, memberCount, workspace, openTasks, completedThisWeek, overdue] =
    await Promise.all([
      prisma.user.findUnique({ where: { id: session.user.id } }),
      prisma.user.count(),
      prisma.workspace.findFirst(),
      prisma.task.count({ where: { done: false } }),
      prisma.task.count({
        where: { done: true, completedAt: { gte: startOfWeek } },
      }),
      prisma.task.count({
        where: { done: false, dueDate: { lt: now } },
      }),
    ]);

  return NextResponse.json({
    stats: {
      workspaceName: workspace?.name ?? "—",
      memberCount,
      memberSince: (user?.createdAt ?? session.user.createdAt).toISOString(),
    },
    taskStats: {
      open: openTasks,
      completedWeek: completedThisWeek,
      overdue,
    },
  });
};
