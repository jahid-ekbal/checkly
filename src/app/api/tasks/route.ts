import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/dbClient/prisma";
import { createTaskSchema } from "@/lib/zodSchema";
import type { TaskItem } from "@/components/tasks/types";

const writeActivity = (
  taskId: string,
  actorId: string,
  type: string,
  metadata?: string,
) =>
  prisma.taskActivity.create({
    data: { taskId, actorId, type, metadata },
  });

export const GET = async () => {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [tasks, labels, members] = await Promise.all([
    prisma.task.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        assignee: {
          select: { id: true, name: true, image: true },
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
      select: { id: true, name: true },
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

  return NextResponse.json({
    tasks: serialized,
    labels: labels.map((label) => ({
      id: label.id,
      name: label.name,
      color: label.color,
    })),
    members: members.map((member) => ({
      id: member.id,
      name: member.name,
    })),
  });
};

export const POST = async (req: Request) => {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = createTaskSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const data = parsed.data;
  const task = await prisma.task.create({
    data: {
      title: data.title,
      description: data.description ?? null,
      priority: data.priority,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      effortHours: data.effortHours ?? null,
      assigneeId: data.assigneeId ?? null,
      image: data.image ?? null,
      createdById: session.user.id,
      labels:
        data.labelIds.length > 0 ?
          { create: data.labelIds.map((labelId) => ({ labelId })) }
        : undefined,
    },
  });

  await writeActivity(task.id, session.user.id, "created");

  return NextResponse.json({ task: { id: task.id } }, { status: 201 });
};
