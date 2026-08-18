import prisma from "@/lib/dbClient/prisma";
import { serverEnv } from "@/lib/env/serverEnv";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { ac, roles } from "./permissions";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "sqlite" }),
  secret: serverEnv.BETTER_AUTH_SECRET,
  baseURL: serverEnv.BETTER_AUTH_URL,
  trustedOrigins: serverEnv.BETTER_AUTH_ALLOWED_ORIGINS?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  user: {},
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  plugins: [
    admin({
      ac,
      roles,
      defaultRole: "user",
    }),
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
