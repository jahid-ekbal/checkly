import { requireUser } from "@/lib/auth/session";
import prisma from "@/lib/dbClient/prisma";
import TasksClient from "@/components/tasks/TasksClient";
import type { TaskItem } from "@/components/tasks/types";

export default async function TasksPage() {
  const session = await requireUser();
  const role = (session.user.role ?? "member") as string;

  const [tasks, labels, members] = await Promise.all([
    prisma.task.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        assignee: {
          select: { id: true, name: true, username: true, image: true },
        },
        labels: { include: { label: true } },
        activity: {
          include: { actor: { select: { id: true, name: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    }),
    prisma.label.findMany({ orderBy: { name: "asc" } }),
    prisma.user.findMany({
      select: { id: true, name: true, username: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const serialized: TaskItem[] = tasks.map((task) => ({
    id: task.id,
    title: task.title,
    description: task.description,
    done: task.done,
    priority: task.priority,
    dueDate: task.dueDate?.toISOString() ?? null,
    effortHours: task.effortHours,
    image: task.image,
    assignee:
      task.assignee ?
        {
          id: task.assignee.id,
          name: task.assignee.name,
          username: task.assignee.username,
          image: task.assignee.image,
        }
      : null,
    labels: task.labels.map(({ label }) => ({
      id: label.id,
      name: label.name,
      color: label.color,
    })),
    createdAt: task.createdAt.toISOString(),
    activity: task.activity.map((entry) => ({
      id: entry.id,
      type: entry.type,
      createdAt: entry.createdAt.toISOString(),
      actor: { id: entry.actor.id, name: entry.actor.name },
    })),
  }));

  const canEdit = role === "owner" || role === "admin" || role === "member";
  const canManageLabels = role === "owner" || role === "admin";

  return (
    <TasksClient
      tasks={serialized}
      labels={labels}
      members={members}
      canEdit={canEdit}
      canManageLabels={canManageLabels}
      currentUserId={session.user.id}
    />
  );
}
