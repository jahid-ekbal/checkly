import { hashPassword } from "better-auth/crypto";
import prisma from "../src/lib/dbClient/prisma";

const WORKSPACE_ID = "default";

const main = async () => {
  await prisma.workspace.upsert({
    where: { id: WORKSPACE_ID },
    update: {},
    create: {
      id: WORKSPACE_ID,
      name: "Checkly",
      description: "",
    },
  });

  const email = process.env.OWNER_EMAIL;
  const password = process.env.OWNER_PASSWORD;
  const name = process.env.OWNER_NAME;

  if (!email || !password || !name) {
    console.warn(
      "OWNER_EMAIL / OWNER_PASSWORD / OWNER_NAME missing. Owner skipped.",
    );
    return;
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("Owner already exists. Skipping.");
    return;
  }

  const userId = crypto.randomUUID();
  const hashedPassword = await hashPassword(password);

  await prisma.user.create({
    data: {
      id: userId,
      name,
      email,
      emailVerified: true,
      role: "owner",
      workspaceId: WORKSPACE_ID,
    },
  });

  await prisma.account.create({
    data: {
      id: crypto.randomUUID(),
      userId,
      accountId: userId,
      providerId: "credential",
      password: hashedPassword,
    },
  });

  console.log(`Owner created: ${email}`);
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
