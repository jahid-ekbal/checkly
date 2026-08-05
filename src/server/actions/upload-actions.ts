"use server";

import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { z } from "zod";
import { requireUser } from "@/lib/auth/session";

const MAX_BYTES = 5 * 1024 * 1024;

const uploadImageSchema = z.object({
  data: z.string().min(100, "Invalid image data"),
  kind: z.enum(["avatar", "banner", "task"]),
});

const RESIZE: Record<
  string,
  { width: number; height: number; cover: boolean }
> = {
  avatar: { width: 256, height: 256, cover: true },
  banner: { width: 512, height: 300, cover: true },
  task: { width: 512, height: 512, cover: false },
};

type ActionResult = { error?: string; url?: string };

export const uploadImageAction = async (input: {
  data: string;
  kind: "avatar" | "banner" | "task";
}): Promise<ActionResult> => {
  await requireUser();

  const parsed = uploadImageSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid image data" };
  }

  const { data, kind } = parsed.data;

  const match = data.match(/^data:image\/(jpeg|png|webp);base64,(.+)$/);
  if (!match) {
    return { error: "Only JPG, PNG, or WebP images are allowed" };
  }

  const buffer = Buffer.from(match[2], "base64");
  if (buffer.byteLength > MAX_BYTES) {
    return { error: "Image must be 5MB or smaller" };
  }

  try {
    const image = sharp(buffer, { failOn: "error" });
    const metadata = await image.metadata();
    if (
      !metadata.format ||
      !["jpeg", "png", "webp"].includes(metadata.format)
    ) {
      return { error: "Only JPG, PNG, or WebP images are allowed" };
    }

    const { width, height, cover } = RESIZE[kind];
    const resized =
      cover ?
        await image
          .resize(width, height, { fit: "cover" })
          .webp({ quality: 85 })
          .toBuffer()
      : await image
          .resize(width, height, { fit: "inside", withoutEnlargement: true })
          .webp({ quality: 85 })
          .toBuffer();

    const filename = `${randomUUID()}.webp`;
    const dir = path.join(process.cwd(), "public", "uploads", kind);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, filename), resized);

    return { url: `/uploads/${kind}/${filename}` };
  } catch {
    return { error: "Could not process image" };
  }
};
