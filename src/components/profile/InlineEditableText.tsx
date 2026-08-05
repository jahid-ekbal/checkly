"use client";

import { useState } from "react";
import { LoaderCircleIcon, PencilIcon } from "lucide-react";
import { Input } from "@/components/shadcnui/input";
import { Textarea } from "@/components/shadcnui/textarea";
import { cn } from "@/lib/utils";

type InlineEditableTextProps = {
  value: string;
  onSave: (value: string) => Promise<string | null>;
  label: string;
  multiline?: boolean;
  placeholder?: string;
  validate?: "name" | "username" | "email" | "bio";
  className?: string;
  displayClassName?: string;
};

const validators: Record<
  NonNullable<InlineEditableTextProps["validate"]>,
  (value: string) => string | null
> = {
  name: (value) =>
    value.length >= 2 ? null : "Name must be at least 2 characters",
  username: (value) =>
    /^[a-z0-9_]{3,20}$/.test(value) ? null : (
      "3-20 characters: lowercase letters, digits, underscores"
    ),
  email: (value) =>
    /^\S+@\S+\.\S+$/.test(value) ? null : "Enter a valid email",
  bio: (value) =>
    value.length <= 200 ? null : "Bio must be 200 characters or fewer",
};

const InlineEditableText = ({
  value,
  onSave,
  label,
  multiline = false,
  placeholder,
  validate,
  className,
  displayClassName,
}: InlineEditableTextProps) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startEdit = () => {
    setDraft(value);
    setError(null);
    setEditing(true);
  };

  const cancel = () => {
    setEditing(false);
    setError(null);
  };

  const save = async () => {
    const next = draft.trim();
    if (next === value.trim()) {
      cancel();
      return;
    }
    if (validate) {
      const validationError = validators[validate](next);
      if (validationError) {
        setError(validationError);
        return;
      }
    }
    setSaving(true);
    const result = await onSave(next);
    setSaving(false);
    if (result) {
      setError(result);
      return;
    }
    setEditing(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      cancel();
    } else if (event.key === "Enter" && !multiline) {
      event.preventDefault();
      void save();
    } else if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      void save();
    }
  };

  if (editing) {
    return (
      <div className={cn("space-y-1", className)}>
        {multiline ?
          <Textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={() => void save()}
            onKeyDown={handleKeyDown}
            rows={3}
            autoFocus
            aria-label={label}
            disabled={saving}
          />
        : <Input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={() => void save()}
            onKeyDown={handleKeyDown}
            autoFocus
            aria-label={label}
            disabled={saving}
          />
        }
        {saving && (
          <LoaderCircleIcon className="text-muted-foreground size-3.5 animate-spin" />
        )}
        {error && <p className="text-destructive text-xs">{error}</p>}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group relative inline-flex items-center gap-1.5",
        className,
      )}
      onDoubleClick={startEdit}>
      <span
        className={cn(
          "cursor-text",
          !value && "text-muted-foreground italic",
          displayClassName,
        )}>
        {value || placeholder || "Click to edit"}
      </span>
      <button
        type="button"
        aria-label={`Edit ${label}`}
        onClick={startEdit}
        className="text-muted-foreground hover:text-foreground opacity-0 transition-opacity group-hover:opacity-100">
        <PencilIcon className="size-3.5" />
      </button>
    </div>
  );
};

export default InlineEditableText;
