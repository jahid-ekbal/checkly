import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";

const statement = {
  ...defaultStatements,
  workspace: ["read", "update"],
} as const;

export const ac = createAccessControl(statement);

export const roles = {
  owner: ac.newRole({
    ...adminAc.statements,
    workspace: ["read", "update"],
  }),
  admin: ac.newRole({
    user: [
      "create",
      "list",
      "get",
      "update",
      "set-role",
      "set-password",
      "delete",
    ],
    session: ["list", "revoke"],
    workspace: ["read", "update"],
  }),
  member: ac.newRole({
    workspace: ["read"],
  }),
  viewer: ac.newRole({
    workspace: ["read"],
  }),
};

export type Role = keyof typeof roles;

export const roleOrder: Role[] = ["owner", "admin", "member", "viewer"];
