import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";

const statement = {
  ...defaultStatements,
  workspace: ["read", "update"],
  task: ["create", "read", "update", "delete"],
  label: ["create", "read", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const roles = {
  owner: ac.newRole({
    ...adminAc.statements,
    workspace: ["read", "update"],
    task: ["create", "read", "update", "delete"],
    label: ["create", "read", "update", "delete"],
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
    task: ["create", "read", "update", "delete"],
    label: ["create", "read", "update", "delete"],
  }),
  member: ac.newRole({
    workspace: ["read"],
    task: ["create", "read", "update"],
    label: ["read"],
  }),
  viewer: ac.newRole({
    workspace: ["read"],
    task: ["read"],
    label: ["read"],
  }),
};

export type Role = keyof typeof roles;

export const roleOrder: Role[] = ["owner", "admin", "member", "viewer"];
