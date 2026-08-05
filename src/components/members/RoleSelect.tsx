"use client";

import { useState } from "react";
import { setRoleAction } from "@/server/actions/admin-actions";
import type { Role } from "@/lib/auth/permissions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcnui/select";

type RoleSelectProps = {
  userId: string;
  role: string;
  disabled: boolean;
};

const RoleSelect = ({ userId, role, disabled }: RoleSelectProps) => {
  const [pending, setPending] = useState(false);

  const onChange = async (value: string) => {
    setPending(true);
    await setRoleAction(userId, value as Role);
    setPending(false);
  };

  return (
    <Select
      value={role}
      onValueChange={(value) => {
        if (value) void onChange(value);
      }}
      disabled={disabled || pending}>
      <SelectTrigger
        size="sm"
        className="capitalize">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="admin">Admin</SelectItem>
        <SelectItem value="member">Member</SelectItem>
        <SelectItem value="viewer">Viewer</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default RoleSelect;
