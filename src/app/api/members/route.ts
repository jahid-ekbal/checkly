import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/dbClient/prisma";

export const GET = async () => {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const members = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({
    members: members.map((member) => ({
      id: member.id,
      name: member.name,
      email: member.email,
      banned: member.banned ?? false,
      banReason: member.banReason,
      banExpires: member.banExpires?.toISOString() ?? null,
    })),
  });
};
