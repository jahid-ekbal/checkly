"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import { LoaderCircleIcon } from "lucide-react";
import { createTaskSchema, type CreateTaskInput } from "@/lib/zodSchema";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/shadcnui/button";
import { Input } from "@/components/shadcnui/input";
import { Textarea } from "@/components/shadcnui/textarea";
import { Checkbox } from "@/components/shadcnui/checkbox";
import { Field, FieldError, FieldLabel } from "@/components/shadcnui/field";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcnui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcnui/select";
import ImageUploadField from "@/components/uploads/ImageUploadField";
import { toast } from "@/components/shadcnui/toast";
import { priorityOptions } from "./priority";

type Member = { id: string; name: string };
type Label = { id: string; name: string; color: string };

type TaskFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: {
    id: string;
    title: string;
    description: string | null;
    priority: CreateTaskInput["priority"];
    dueDate: string | null;
    effortHours: number | null;
    assigneeId: string | null;
    labelIds: string[];
    image: string | null;
  } | null;
  members: Member[];
  labels: Label[];
  onSaved?: () => void;
};

const toDateTimeLocal = (iso: string | null) => {
  if (!iso) return "";
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const TaskFormDialog = ({
  open,
  onOpenChange,
  task,
  members,
  labels,
  onSaved,
}: TaskFormDialogProps) => {
  const [error, setError] = useState<string | null>(null);

  const taskFormResolver = zodResolver(
    createTaskSchema,
  ) as unknown as Resolver<CreateTaskInput>;

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<CreateTaskInput>({
    resolver: taskFormResolver,
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
      priority: task?.priority ?? "MEDIUM",
      dueDate: toDateTimeLocal(task?.dueDate ?? null) || null,
      effortHours: task?.effortHours ?? null,
      assigneeId: task?.assigneeId ?? null,
      labelIds: task?.labelIds ?? [],
      image: task?.image ?? null,
    },
    mode: "all",
  });

  const onSubmit = async (values: CreateTaskInput) => {
    setError(null);
    try {
      if (task) {
        await apiFetch(`/api/tasks/${task.id}`, {
          method: "PATCH",
          body: JSON.stringify(values),
        });
      } else {
        await apiFetch("/api/tasks", {
          method: "POST",
          body: JSON.stringify(values),
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      return;
    }
    toast.add({
      title: task ? "Task updated" : "Task created",
      description: task ? "Your changes were saved." : "The task was added.",
    });
    reset();
    onOpenChange(false);
    onSaved?.();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task ? "Edit task" : "Create task"}</DialogTitle>
          <DialogDescription>
            {task ?
              "Update the task details."
            : "Add a new task to your workspace."}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4">
          <Controller
            name="title"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="Ship the landing page"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                <Textarea
                  {...field}
                  id={field.name}
                  rows={4}
                  placeholder="Optional details..."
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Priority</FieldLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      if (value) field.onChange(value);
                    }}>
                    <SelectTrigger
                      id={field.name}
                      className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />
            <Controller
              name="assigneeId"
              control={control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Assignee</FieldLabel>
                  <Select
                    value={field.value ?? ""}
                    onValueChange={(value) => {
                      if (value) field.onChange(value || null);
                    }}>
                    <SelectTrigger
                      id={field.name}
                      className="w-full">
                      <SelectValue placeholder="Unassigned" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Unassigned</SelectItem>
                      {members.map((member) => (
                        <SelectItem
                          key={member.id}
                          value={member.id}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Controller
              name="dueDate"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Due date</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="datetime-local"
                    value={field.value ?? ""}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="effortHours"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Effort (hours)</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="number"
                    min={0}
                    step={0.5}
                    value={field.value ?? ""}
                    placeholder="Optional"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <Controller
            name="labelIds"
            control={control}
            render={({ field }) => (
              <Field>
                <FieldLabel>Labels</FieldLabel>
                {labels.length === 0 ?
                  <p className="text-muted-foreground text-sm">
                    No labels yet. Ask an admin to create some.
                  </p>
                : <div className="flex flex-wrap gap-2">
                    {labels.map((label) => {
                      const checked = field.value.includes(label.id);
                      return (
                        <label
                          key={label.id}
                          className="flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1 text-sm"
                          style={{
                            borderColor: checked ? label.color : undefined,
                            backgroundColor:
                              checked ? `${label.color}1a` : undefined,
                          }}>
                          <Checkbox
                            checked={checked}
                            onCheckedChange={() => {
                              field.onChange(
                                checked ?
                                  field.value.filter((id) => id !== label.id)
                                : [...field.value, label.id],
                              );
                            }}
                          />
                          <span
                            className="size-2 rounded-full"
                            style={{ backgroundColor: label.color }}
                          />
                          {label.name}
                        </label>
                      );
                    })}
                  </div>
                }
              </Field>
            )}
          />
          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <Field>
                <FieldLabel>Image</FieldLabel>
                <ImageUploadField
                  kind="task"
                  value={field.value ?? null}
                  onChange={field.onChange}
                />
              </Field>
            )}
          />
          {error && <p className="text-destructive text-sm">{error}</p>}
          <DialogFooter>
            <Button
              type="submit"
              disabled={isSubmitting}>
              {isSubmitting && <LoaderCircleIcon className="animate-spin" />}
              {isSubmitting ?
                "Saving..."
              : task ?
                "Save changes"
              : "Create task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskFormDialog;
