import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./index";
import type { Role } from "./permissions";

export const getSession = async () => {
  return auth.api.getSession({ headers: await headers() });
};

export const requireUser = async () => {
  const session = await getSession();
  if (!session) redirect("/sign-in");
  return session;
};

export const requireRole = async (allowed: Role[]) => {
  const session = await requireUser();
  const role = session.user.role as Role | undefined;
  if (!role || !allowed.includes(role)) redirect("/");
  return session;
};
