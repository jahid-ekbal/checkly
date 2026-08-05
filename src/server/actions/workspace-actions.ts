"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/session";
import {
  updateWorkspaceSchema,
  type UpdateWorkspaceInput,
} from "@/lib/zodSchema";
import prisma from "@/lib/dbClient/prisma";

const WORKSPACE_ID = "default";

export type UpdateWorkspaceResult = { error?: string; success?: boolean };

export const updateWorkspaceAction = async (
  input: UpdateWorkspaceInput,
): Promise<UpdateWorkspaceResult> => {
  await requireRole(["owner", "admin"]);

  const parsed = updateWorkspaceSchema.safeParse(input);
  if (!parsed.success) return { error: "Invalid input" };

  const { name, description } = parsed.data;

  await prisma.workspace.update({
    where: { id: WORKSPACE_ID },
    data: { name, description },
  });

  revalidatePath("/settings");
  return { success: true };
};
