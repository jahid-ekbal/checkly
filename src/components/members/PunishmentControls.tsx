"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { toast } from "@/components/shadcnui/toast";
import { Button } from "@/components/shadcnui/button";
import { Input } from "@/components/shadcnui/input";
import { Field, FieldLabel } from "@/components/shadcnui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcnui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcnui/dialog";

type PunishmentMember = {
  id: string;
  name: string;
  banned: boolean;
  banReason: string | null;
  banExpires: string | null;
};

type PunishmentControlsProps = {
  member: PunishmentMember;
  disabled: boolean;
  onChanged: () => void;
};

const timeoutOptions = [
  { value: 15, label: "15 minutes" },
  { value: 60, label: "1 hour" },
  { value: 360, label: "6 hours" },
  { value: 1440, label: "24 hours" },
  { value: 10080, label: "7 days" },
] as const;

const PunishmentControls = ({
  member,
  disabled,
  onChanged,
}: PunishmentControlsProps) => {
  const [timeoutOpen, setTimeoutOpen] = useState(false);
  const [banOpen, setBanOpen] = useState(false);
  const [unbanOpen, setUnbanOpen] = useState(false);
  const [minutes, setMinutes] = useState<number>(60);
  const [reason, setReason] = useState("");
  const [pending, setPending] = useState(false);

  const punish = async (action: "timeout" | "ban") => {
    setPending(true);
    try {
      await apiFetch(`/api/members/${member.id}/punishment`, {
        method: "PATCH",
        body: JSON.stringify({
          action,
          ...(action === "timeout" ? { minutes } : {}),
          ...(reason.trim() ? { reason: reason.trim() } : {}),
        }),
      });
      const durationLabel =
        timeoutOptions.find((option) => option.value === minutes)?.label ?? "";
      toast.add({
        title: action === "timeout" ? "Member timed out" : "Member banned",
        description:
          action === "timeout" ?
            `${member.name} cannot sign in for ${durationLabel}.`
          : `${member.name} can no longer sign in.`,
      });
      setTimeoutOpen(false);
      setBanOpen(false);
      setReason("");
      onChanged();
    } catch (err) {
      toast.add({
        title: "Action failed",
        description:
          err instanceof Error ? err.message : "Something went wrong",
      });
    }
    setPending(false);
  };

  const unban = async () => {
    setPending(true);
    try {
      await apiFetch(`/api/members/${member.id}/punishment`, {
        method: "DELETE",
      });
      toast.add({
        title: "Punishment removed",
        description: `${member.name} can sign in again.`,
      });
      setUnbanOpen(false);
      onChanged();
    } catch (err) {
      toast.add({
        title: "Action failed",
        description:
          err instanceof Error ? err.message : "Something went wrong",
      });
    }
    setPending(false);
  };

  if (disabled) return null;

  if (member.banned) {
    return (
      <>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setUnbanOpen(true)}
          disabled={pending}>
          Remove punishment
        </Button>
        <Dialog
          open={unbanOpen}
          onOpenChange={setUnbanOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Remove punishment</DialogTitle>
              <DialogDescription>
                {member.name} will be able to sign in again immediately.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setUnbanOpen(false)}
                disabled={pending}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => void unban()}
                disabled={pending}>
                {pending ? "Removing..." : "Remove punishment"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setTimeoutOpen(true)}
        disabled={pending}>
        Timeout
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setBanOpen(true)}
        disabled={pending}>
        Ban
      </Button>

      <Dialog
        open={timeoutOpen}
        onOpenChange={setTimeoutOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Timeout member</DialogTitle>
            <DialogDescription>
              Block {member.name} from signing in for a set duration.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Field>
              <FieldLabel htmlFor="timeout-duration">Duration</FieldLabel>
              <Select
                value={String(minutes)}
                onValueChange={(value) => {
                  if (value) setMinutes(Number(value));
                }}>
                <SelectTrigger
                  id="timeout-duration"
                  className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeoutOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={String(option.value)}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="timeout-reason">
                Reason (optional)
              </FieldLabel>
              <Input
                id="timeout-reason"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder="Why is this member being timed out?"
              />
            </Field>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setTimeoutOpen(false)}
              disabled={pending}>
              Cancel
            </Button>
            <Button
              onClick={() => void punish("timeout")}
              disabled={pending}>
              {pending ? "Applying..." : "Apply timeout"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={banOpen}
        onOpenChange={setBanOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ban member</DialogTitle>
            <DialogDescription>
              {member.name} will be permanently blocked from signing in. This
              can be undone later.
            </DialogDescription>
          </DialogHeader>
          <Field>
            <FieldLabel htmlFor="ban-reason">Reason (optional)</FieldLabel>
            <Input
              id="ban-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Why is this member being banned?"
            />
          </Field>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setBanOpen(false)}
              disabled={pending}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => void punish("ban")}
              disabled={pending}>
              {pending ? "Banning..." : "Ban member"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PunishmentControls;
