"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { requireRole } from "@/lib/auth/session";
import type { Role } from "@/lib/auth/permissions";
import { createUserSchema, type CreateUserInput } from "@/lib/zodSchema";
import prisma from "@/lib/dbClient/prisma";

type ActionResult = { error?: string; success?: boolean };

const MESSAGE = "Something went wrong";

const getCurrentActor = async () => {
  const session = await requireRole(["owner", "admin"]);
  return session.user;
};

export const createUserAction = async (
  input: CreateUserInput,
): Promise<ActionResult> => {
  await getCurrentActor();

  const parsed = createUserSchema.safeParse(input);
  if (!parsed.success) {
    return { error: MESSAGE };
  }

  const { name, email, password, role } = parsed.data;

  try {
    await auth.api.createUser({
      body: { name, email, password, role },
      headers: await headers(),
    });
    revalidatePath("/members");
    return { success: true };
  } catch {
    return { error: MESSAGE };
  }
};

export const setRoleAction = async (
  userId: string,
  role: Role,
): Promise<ActionResult> => {
  const actor = await getCurrentActor();

  const target = await prisma.user.findUnique({ where: { id: userId } });
  if (!target) return { error: MESSAGE };

  if (target.role === "owner" && actor.role !== "owner") {
    return { error: MESSAGE };
  }

  try {
    await auth.api.setRole({
      body: { userId, role },
      headers: await headers(),
    });
    revalidatePath("/members");
    return { success: true };
  } catch {
    return { error: MESSAGE };
  }
};

export const removeUserAction = async (
  userId: string,
): Promise<ActionResult> => {
  const actor = await getCurrentActor();

  if (actor.id === userId) return { error: MESSAGE };

  const target = await prisma.user.findUnique({ where: { id: userId } });
  if (!target) return { error: MESSAGE };

  if (target.role === "owner" && actor.role !== "owner") {
    return { error: MESSAGE };
  }

  try {
    await auth.api.removeUser({
      body: { userId },
      headers: await headers(),
    });
    revalidatePath("/members");
    return { success: true };
  } catch {
    return { error: MESSAGE };
  }
};
