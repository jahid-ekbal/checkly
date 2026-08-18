"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
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
  onChanged: () => void;
};

const RoleSelect = ({ userId, role, disabled, onChanged }: RoleSelectProps) => {
  const [pending, setPending] = useState(false);

  const onChange = async (value: string) => {
    setPending(true);
    try {
      await apiFetch(`/api/members/${userId}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role: value as Role }),
      });
      onChanged();
    } catch {
      // keep current role
    }
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
        <SelectItem value="user">User</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default RoleSelect;
