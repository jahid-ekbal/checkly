"use client";

import { useState } from "react";
import { removeUserAction } from "@/server/actions/admin-actions";
import { Button } from "@/components/shadcnui/button";

type RemoveMemberButtonProps = {
  userId: string;
  disabled: boolean;
};

const RemoveMemberButton = ({ userId, disabled }: RemoveMemberButtonProps) => {
  const [pending, setPending] = useState(false);

  const onRemove = async () => {
    if (!window.confirm("Remove this member?")) return;
    setPending(true);
    await removeUserAction(userId);
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
