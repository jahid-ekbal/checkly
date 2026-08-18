import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/dbClient/prisma";
import { updateProfileSchema } from "@/lib/zodSchema";

export const PATCH = async (req: Request) => {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = updateProfileSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const data = parsed.data;
  const { image, banner } = data;

  const uploadRegex = /^\/uploads\/(avatar|banner)\/[a-z0-9-]+\.webp$/i;
  if (image !== undefined && image !== null && !uploadRegex.test(image)) {
    return NextResponse.json({ error: "Invalid image URL" }, { status: 400 });
  }
  if (banner !== undefined && banner !== null && !uploadRegex.test(banner)) {
    return NextResponse.json({ error: "Invalid banner URL" }, { status: 400 });
  }

  try {
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: data.name,
        email: data.email,
        bio: data.bio,
        image,
        banner,
      },
    });

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        banner: user.banner,
        bio: user.bio,
        role: user.role,
      },
    });
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      (error as { code?: string }).code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Email already taken" },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: "Could not update profile" },
      { status: 500 },
    );
  }
};
