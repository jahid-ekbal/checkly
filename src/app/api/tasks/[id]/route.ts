import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/dbClient/prisma";
import { updateTaskSchema } from "@/lib/zodSchema";

const writeActivity = (
  taskId: string,
  actorId: string,
  type: string,
  metadata?: string,
) =>
  prisma.taskActivity.create({
    data: { taskId, actorId, type, metadata },
  });

export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.task.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  const parsed = updateTaskSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const data = parsed.data;

  if (data.done !== undefined) {
    const task = await prisma.task.update({
      where: { id },
      data: { done: data.done, completedAt: data.done ? new Date() : null },
    });
    await writeActivity(
      id,
      session.user.id,
      data.done ? "completed" : "reopened",
    );
    return NextResponse.json({ task });
  }

  const changed: string[] = [];
  const updateData: {
    title?: string;
    description?: string | null;
    priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    dueDate?: Date | null;
    effortHours?: number | null;
    assigneeId?: string | null;
    image?: string | null;
  } = {};

  if (data.title !== undefined) {
    updateData.title = data.title;
    changed.push("title");
  }
  if (data.description !== undefined) {
    updateData.description = data.description ?? null;
    changed.push("description");
  }
  if (data.priority !== undefined) {
    updateData.priority = data.priority;
    changed.push("priority");
  }
  if (data.dueDate !== undefined) {
    updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
    changed.push("dueDate");
  }
  if (data.effortHours !== undefined) {
    updateData.effortHours = data.effortHours ?? null;
    changed.push("effortHours");
  }
  if (data.assigneeId !== undefined) {
    updateData.assigneeId = data.assigneeId ?? null;
    changed.push("assignee");
  }
  if (data.image !== undefined) {
    updateData.image = data.image ?? null;
    changed.push("image");
  }
  if (data.labelIds !== undefined) {
    changed.push("labels");
  }

  const task = await prisma.task.update({
    where: { id },
    data: {
      ...updateData,
      labels:
        data.labelIds !== undefined ?
          {
            deleteMany: {},
            create: data.labelIds.map((labelId) => ({ labelId })),
          }
        : undefined,
    },
  });

  await writeActivity(
    id,
    session.user.id,
    "updated",
    JSON.stringify({ fields: changed }),
  );

  return NextResponse.json({ task });
};

export const DELETE = async (
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  if (session.user.role !== "admin" && task.createdById !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.task.delete({ where: { id } });
  return NextResponse.json({ ok: true });
};
