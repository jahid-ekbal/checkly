import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/dbClient/prisma";
import { labelSchema } from "@/lib/zodSchema";

export const GET = async () => {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const labels = await prisma.label.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json({
    labels: labels.map((label) => ({
      id: label.id,
      name: label.name,
      color: label.color,
    })),
  });
};

export const POST = async (req: Request) => {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = labelSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const label = await prisma.label.create({ data: parsed.data });
  return NextResponse.json({ label }, { status: 201 });
};
