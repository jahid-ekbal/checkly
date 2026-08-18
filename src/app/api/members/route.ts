import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/dbClient/prisma";
import { createUserSchema } from "@/lib/zodSchema";

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
      role: member.role ?? "user",
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

  const parsed = createUserSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { name, email, password, role } = parsed.data;

  try {
    await auth.api.createUser({
      body: { name, email, password, role },
      headers: await headers(),
    });
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      (error as { code?: string }).code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: "Could not create user" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
};
