import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { getSession } from "@/lib/auth/session";

const timeoutMinutes = [15, 60, 360, 1440, 10080] as const;
const timeoutMinutesSchema = z.union(
  timeoutMinutes.map((minutes) => z.literal(minutes)) as [
    z.ZodLiteral<15>,
    z.ZodLiteral<60>,
    z.ZodLiteral<360>,
    z.ZodLiteral<1440>,
    z.ZodLiteral<10080>,
  ],
);

const punishSchema = z
  .object({
    action: z.enum(["timeout", "ban"]),
    minutes: timeoutMinutesSchema.optional(),
    reason: z.string().trim().max(200, "Reason too long").optional(),
  })
  .refine(
    (data) => (data.action === "timeout" ? data.minutes !== undefined : true),
    { message: "Timeout requires a duration", path: ["minutes"] },
  );

export const PATCH = async (
  req: Request,
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
  if (id === session.user.id) {
    return NextResponse.json(
      { error: "You cannot punish yourself" },
      { status: 400 },
    );
  }

  const parsed = punishSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { action, minutes, reason } = parsed.data;

  await auth.api.banUser({
    body: {
      userId: id,
      banReason: reason || undefined,
      banExpiresIn: action === "timeout" ? minutes! * 60 : undefined,
    },
  });

  return NextResponse.json({ ok: true });
};

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
  if (id === session.user.id) {
    return NextResponse.json(
      { error: "You cannot punish yourself" },
      { status: 400 },
    );
  }

  await auth.api.unbanUser({ body: { userId: id } });

  return NextResponse.json({ ok: true });
};
