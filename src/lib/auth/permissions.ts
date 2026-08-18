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
  admin: ac.newRole({
    ...adminAc.statements,
    workspace: ["read", "update"],
    task: ["create", "read", "update", "delete"],
    label: ["create", "read", "update", "delete"],
  }),
  user: ac.newRole({
    workspace: ["read"],
    task: ["create", "read", "update"],
    label: ["read"],
  }),
};

export type Role = keyof typeof roles;
