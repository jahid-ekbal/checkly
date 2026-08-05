"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/session";
import {
  createTaskSchema,
  updateTaskSchema,
  type CreateTaskInput,
  type UpdateTaskInput,
} from "@/lib/zodSchema";
import prisma from "@/lib/dbClient/prisma";

type ActionResult = { error?: string; success?: boolean };

const MESSAGE = "Something went wrong";

const requireCanEdit = async () => {
  const session = await requireUser();
  const role = (session.user.role ?? "member") as string;
  if (role !== "owner" && role !== "admin" && role !== "member") {
    throw new Error("Forbidden");
  }
  return session;
};

const writeActivity = async (
  taskId: string,
  actorId: string,
  type: string,
  metadata?: unknown,
) => {
  await prisma.taskActivity.create({
    data: {
      taskId,
      actorId,
      type,
      metadata: metadata ? JSON.stringify(metadata) : null,
    },
  });
};

const toDate = (value?: string | null) => {
  if (!value) return null;
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
};

export const createTaskAction = async (
  input: CreateTaskInput,
): Promise<ActionResult> => {
  let session;
  try {
    session = await requireCanEdit();
  } catch {
    return { error: "You do not have permission to create tasks" };
  }

  const parsed = createTaskSchema.safeParse(input);
  if (!parsed.success) {
    return { error: MESSAGE };
  }

  const {
    title,
    description,
    priority,
    dueDate,
    effortHours,
    assigneeId,
    labelIds,
    image,
  } = parsed.data;

  try {
    const task = await prisma.task.create({
      data: {
        title,
        description: description || null,
        priority,
        dueDate: toDate(dueDate),
        effortHours: effortHours ?? null,
        assigneeId: assigneeId || null,
        image: image || null,
        createdById: session.user.id,
        labels: {
          create: labelIds.map((labelId) => ({ labelId })),
        },
      },
    });
    await writeActivity(task.id, session.user.id, "created", { title });
    revalidatePath("/tasks");
    revalidatePath("/profile");
    return { success: true };
  } catch {
    return { error: MESSAGE };
  }
};

export const updateTaskAction = async (
  taskId: string,
  input: UpdateTaskInput,
): Promise<ActionResult> => {
  let session;
  try {
    session = await requireCanEdit();
  } catch {
    return { error: "You do not have permission to edit tasks" };
  }

  const parsed = updateTaskSchema.safeParse(input);
  if (!parsed.success) {
    return { error: MESSAGE };
  }

  const existing = await prisma.task.findUnique({ where: { id: taskId } });
  if (!existing) return { error: MESSAGE };

  const changes: string[] = [];
  const data: Record<string, unknown> = {};

  if (parsed.data.title !== undefined && parsed.data.title !== existing.title) {
    data.title = parsed.data.title;
    changes.push("title");
  }
  if (
    parsed.data.description !== undefined &&
    (parsed.data.description ?? null) !== existing.description
  ) {
    data.description = parsed.data.description || null;
    changes.push("description");
  }
  if (
    parsed.data.priority !== undefined &&
    parsed.data.priority !== existing.priority
  ) {
    data.priority = parsed.data.priority;
    changes.push("priority");
  }
  if (parsed.data.dueDate !== undefined) {
    data.dueDate = toDate(parsed.data.dueDate);
    changes.push("due date");
  }
  if (parsed.data.effortHours !== undefined) {
    data.effortHours = parsed.data.effortHours ?? null;
    changes.push("effort");
  }
  if (parsed.data.assigneeId !== undefined) {
    data.assigneeId = parsed.data.assigneeId || null;
    changes.push("assignee");
  }
  if (parsed.data.image !== undefined) {
    data.image = parsed.data.image || null;
    changes.push("image");
  }

  try {
    await prisma.task.update({
      where: { id: taskId },
      data,
    });

    if (parsed.data.labelIds !== undefined) {
      await prisma.taskLabel.deleteMany({ where: { taskId } });
      await prisma.taskLabel.createMany({
        data: parsed.data.labelIds.map((labelId) => ({ taskId, labelId })),
      });
      changes.push("labels");
    }

    if (changes.length > 0) {
      await writeActivity(existing.id, session.user.id, "updated", {
        fields: changes,
      });
    }
    revalidatePath("/tasks");
    revalidatePath("/profile");
    return { success: true };
  } catch {
    return { error: MESSAGE };
  }
};

export const toggleTaskDoneAction = async (
  taskId: string,
  done: boolean,
): Promise<ActionResult> => {
  let session;
  try {
    session = await requireCanEdit();
  } catch {
    return { error: "You do not have permission to update tasks" };
  }

  const existing = await prisma.task.findUnique({ where: { id: taskId } });
  if (!existing) return { error: MESSAGE };

  try {
    await prisma.task.update({
      where: { id: taskId },
      data: { done, completedAt: done ? new Date() : null },
    });
    await writeActivity(
      existing.id,
      session.user.id,
      done ? "completed" : "reopened",
    );
    revalidatePath("/tasks");
    revalidatePath("/profile");
    return { success: true };
  } catch {
    return { error: MESSAGE };
  }
};

export const deleteTaskAction = async (
  taskId: string,
): Promise<ActionResult> => {
  const session = await requireUser();
  const role = (session.user.role ?? "member") as string;

  const existing = await prisma.task.findUnique({ where: { id: taskId } });
  if (!existing) return { error: MESSAGE };

  const canDelete =
    role === "owner" ||
    role === "admin" ||
    existing.createdById === session.user.id;
  if (!canDelete) {
    return { error: "You do not have permission to delete this task" };
  }

  try {
    await prisma.task.delete({ where: { id: taskId } });
    revalidatePath("/tasks");
    revalidatePath("/profile");
    return { success: true };
  } catch {
    return { error: MESSAGE };
  }
};
