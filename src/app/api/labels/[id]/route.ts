import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/dbClient/prisma";

export const DELETE = async (
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const label = await prisma.label.findUnique({ where: { id } });
  if (!label) {
    return NextResponse.json({ error: "Label not found" }, { status: 404 });
  }

  await prisma.label.delete({ where: { id } });
  return NextResponse.json({ ok: true });
};
