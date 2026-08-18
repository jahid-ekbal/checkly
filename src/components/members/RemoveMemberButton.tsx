"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/shadcnui/button";

type RemoveMemberButtonProps = {
  userId: string;
  disabled: boolean;
  onChanged: () => void;
};

const RemoveMemberButton = ({
  userId,
  disabled,
  onChanged,
}: RemoveMemberButtonProps) => {
  const [pending, setPending] = useState(false);

  const onRemove = async () => {
    if (!window.confirm("Remove this member?")) return;
    setPending(true);
    try {
      await apiFetch(`/api/members/${userId}`, { method: "DELETE" });
      onChanged();
    } catch {
      // keep member list
    }
    setPending(false);
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={onRemove}
      disabled={disabled || pending}>
      {pending ? "Removing..." : "Remove"}
    </Button>
  );
};

export default RemoveMemberButton;
