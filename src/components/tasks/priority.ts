import type { Priority } from "@/lib/zodSchema";

export const priorityMeta: Record<
  Priority,
  { label: string; className: string }
> = {
  LOW: {
    label: "Low",
    className: "bg-muted text-muted-foreground",
  },
  MEDIUM: {
    label: "Medium",
    className: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  HIGH: {
    label: "High",
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  URGENT: {
    label: "Urgent",
    className: "bg-red-500/10 text-red-600 dark:text-red-400",
  },
};

export const priorityOptions = Object.entries(priorityMeta).map(
  ([value, meta]) => ({ value, label: meta.label }),
);
