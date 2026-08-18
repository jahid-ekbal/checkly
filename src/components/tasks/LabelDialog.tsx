"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import { LoaderCircleIcon, Trash2Icon } from "lucide-react";
import { labelSchema, type LabelInput } from "@/lib/zodSchema";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/shadcnui/button";
import { Input } from "@/components/shadcnui/input";
import { Field, FieldError, FieldLabel } from "@/components/shadcnui/field";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcnui/dialog";
import type { Label } from "./types";

type LabelDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  labels: Label[];
  onChanged: () => void;
};

const LabelDialog = ({
  open,
  onOpenChange,
  labels,
  onChanged,
}: LabelDialogProps) => {
  const [error, setError] = useState<string | null>(null);

  const labelFormResolver = zodResolver(
    labelSchema,
  ) as unknown as Resolver<LabelInput>;

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<LabelInput>({
    resolver: labelFormResolver,
    defaultValues: { name: "", color: "#6366f1" },
    mode: "all",
  });

  const onSubmit = async (values: LabelInput) => {
    setError(null);
    try {
      await apiFetch("/api/labels", {
        method: "POST",
        body: JSON.stringify(values),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      return;
    }
    reset();
    onChanged();
  };

  const handleDelete = async (labelId: string) => {
    setError(null);
    try {
      await apiFetch(`/api/labels/${labelId}`, { method: "DELETE" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      return;
    }
    onChanged();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Labels</DialogTitle>
          <DialogDescription>Create and manage task labels.</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4">
          <div className="flex items-end gap-3">
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className="flex-1">
                  <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="Backend"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="color"
              control={control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Color</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="color"
                    className="h-10 w-14 cursor-pointer p-1"
                  />
                </Field>
              )}
            />
            <Button
              type="submit"
              disabled={isSubmitting}>
              {isSubmitting && <LoaderCircleIcon className="animate-spin" />}
              Add
            </Button>
          </div>
        </form>

        {error && <p className="text-destructive text-sm">{error}</p>}

        {labels.length === 0 ?
          <p className="text-muted-foreground text-sm">No labels yet.</p>
        : <ul className="space-y-2">
            {labels.map((label) => (
              <li
                key={label.id}
                className="flex items-center justify-between rounded-lg border px-3 py-2">
                <span className="inline-flex items-center gap-2 text-sm">
                  <span
                    className="size-3 rounded-full"
                    style={{ backgroundColor: label.color }}
                  />
                  {label.name}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Delete label ${label.name}`}
                  onClick={() => void handleDelete(label.id)}>
                  <Trash2Icon className="size-4" />
                </Button>
              </li>
            ))}
          </ul>
        }
      </DialogContent>
    </Dialog>
  );
};

export default LabelDialog;
