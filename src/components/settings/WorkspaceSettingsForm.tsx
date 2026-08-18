"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateWorkspaceSchema,
  type UpdateWorkspaceInput,
} from "@/lib/zodSchema";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/shadcnui/button";
import { Input } from "@/components/shadcnui/input";
import { Textarea } from "@/components/shadcnui/textarea";
import { Field, FieldError, FieldLabel } from "@/components/shadcnui/field";

type WorkspaceSettingsFormProps = {
  workspace: { name: string; description: string };
};

const WorkspaceSettingsForm = ({ workspace }: WorkspaceSettingsFormProps) => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<UpdateWorkspaceInput>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      name: workspace.name,
      description: workspace.description,
    },
    mode: "all",
  });

  const onSubmit = async (values: UpdateWorkspaceInput) => {
    setError(null);
    setSuccess(false);
    try {
      await apiFetch("/api/workspace", {
        method: "PATCH",
        body: JSON.stringify(values),
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="max-w-md space-y-4">
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Workspace name</FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      {error && <p className="text-destructive text-sm">{error}</p>}
      {success && <p className="text-sm text-emerald-500">Saved.</p>}
      <Button
        type="submit"
        disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save"}
      </Button>
    </form>
  );
};

export default WorkspaceSettingsForm;
