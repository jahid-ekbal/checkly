"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/session";
import { labelSchema, type LabelInput } from "@/lib/zodSchema";
import prisma from "@/lib/dbClient/prisma";

type ActionResult = { error?: string; success?: boolean };

const MESSAGE = "Something went wrong";

const requireLabelManage = async () => {
  const session = await requireUser();
  const role = (session.user.role ?? "member") as string;
  if (role !== "owner" && role !== "admin") {
    throw new Error("Forbidden");
  }
  return session;
};

export const createLabelAction = async (
  input: LabelInput,
): Promise<ActionResult> => {
  try {
    await requireLabelManage();
  } catch {
    return { error: "You do not have permission to manage labels" };
  }

  const parsed = labelSchema.safeParse(input);
  if (!parsed.success) return { error: MESSAGE };

  try {
    await prisma.label.create({ data: parsed.data });
    revalidatePath("/tasks");
    return { success: true };
  } catch {
    return { error: MESSAGE };
  }
};

export const deleteLabelAction = async (
  labelId: string,
): Promise<ActionResult> => {
  try {
    await requireLabelManage();
  } catch {
    return { error: "You do not have permission to manage labels" };
  }

  try {
    await prisma.label.delete({ where: { id: labelId } });
    revalidatePath("/tasks");
    return { success: true };
  } catch {
    return { error: MESSAGE };
  }
};
