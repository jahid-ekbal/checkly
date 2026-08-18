import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import sharp from "sharp";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";

const MAX_BYTES = 5 * 1024 * 1024;

const uploadSchema = z.object({
  data: z.string().min(1),
  kind: z.enum(["avatar", "banner", "task"]),
});

const sizes = {
  avatar: { width: 256, height: 256, fit: "cover" },
  banner: { width: 512, height: 300, fit: "cover" },
  task: { width: 512, height: 512, fit: "inside" },
} as const;

export const POST = async (req: Request) => {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = uploadSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid upload" }, { status: 400 });
  }

  const { data, kind } = parsed.data;
  const base64 = data.split(",")[1] ?? data;
  const buffer = Buffer.from(base64, "base64");

  if (buffer.length > MAX_BYTES) {
    return NextResponse.json(
      { error: "Image must be 5MB or smaller" },
      { status: 400 },
    );
  }

  try {
    const { width, height, fit } = sizes[kind];
    const processed = await sharp(buffer)
      .resize(width, height, { fit, withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer();

    const filename = `${randomUUID()}.webp`;
    const dir = path.join(process.cwd(), "public", "uploads", kind);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, filename), processed);

    return NextResponse.json({ url: `/uploads/${kind}/${filename}` });
  } catch {
    return NextResponse.json(
      { error: "Could not process image" },
      { status: 400 },
    );
  }
};
