"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/session";
import { updateProfileSchema, type UpdateProfileInput } from "@/lib/zodSchema";
import prisma from "@/lib/dbClient/prisma";

type ActionResult = { error?: string; success?: boolean };

export const updateProfileAction = async (
  input: UpdateProfileInput,
): Promise<ActionResult> => {
  const session = await requireUser();

  const parsed = updateProfileSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid profile data" };
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: parsed.data,
    });
    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return { error: "Username or email already taken" };
    }
    return { error: "Something went wrong" };
  }
};

export const updateProfileImageAction = async (
  field: "image" | "banner",
  url: string | null,
): Promise<ActionResult> => {
  const session = await requireUser();

  if (
    url !== null &&
    !/^\/uploads\/(avatar|banner)\/[a-z0-9-]+\.(jpe?g|png|webp)$/i.test(url)
  ) {
    return { error: "Invalid image URL" };
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { [field]: url },
    });
    revalidatePath("/profile");
    return { success: true };
  } catch {
    return { error: "Something went wrong" };
  }
};

const updateField = async (
  data: UpdateProfileInput,
): Promise<string | null> => {
  const session = await requireUser();

  const parsed = updateProfileSchema.safeParse(data);
  if (!parsed.success) {
    return "Invalid value";
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: parsed.data,
    });
    revalidatePath("/profile");
    return null;
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return "Username or email already taken";
    }
    return "Something went wrong";
  }
};
export const updateNameAction = async (value: string) =>
  updateField({ name: value });

export const updateUsernameAction = async (value: string) =>
  updateField({ username: value });

export const updateEmailAction = async (value: string) =>
  updateField({ email: value });

export const updateBioAction = async (value: string) =>
  updateField({ bio: value });
