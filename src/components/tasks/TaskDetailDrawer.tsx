"use client";

import { CalendarIcon, ClockIcon, Trash2Icon, UserIcon } from "lucide-react";
import { Button } from "@/components/shadcnui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcnui/dialog";
import { priorityMeta } from "./priority";
import type { TaskItem } from "./types";

type TaskDetailDrawerProps = {
  task: TaskItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
  canEdit: boolean;
  canDelete: boolean;
};

const TaskDetailDrawer = ({
  task,
  open,
  onOpenChange,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
}: TaskDetailDrawerProps) => {
  if (!task) return null;

  const priority = priorityMeta[task.priority];

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className={task.done ? "line-through" : undefined}>
              {task.title}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${priority.className}`}>
              {priority.label}
            </span>
          </DialogTitle>
          <DialogDescription>
            {task.done ? "Completed" : "Open"} task
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {task.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={task.image}
              alt=""
              className="w-full rounded-lg object-cover"
            />
          )}

          {task.labels.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {task.labels.map((label) => (
                <span
                  key={label.id}
                  className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs"
                  style={{
                    borderColor: label.color,
                    backgroundColor: `${label.color}1a`,
                  }}>
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: label.color }}
                  />
                  {label.name}
                </span>
              ))}
            </div>
          )}

          <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
            {task.assignee && (
              <span className="inline-flex items-center gap-1.5">
                <UserIcon className="size-4" />
                {task.assignee.username ?
                  `@${task.assignee.username}`
                : task.assignee.name}
              </span>
            )}
            {task.dueDate && (
              <span className="inline-flex items-center gap-1.5">
                <CalendarIcon className="size-4" />
                {new Date(task.dueDate).toLocaleString()}
              </span>
            )}
            {task.effortHours != null && (
              <span className="inline-flex items-center gap-1.5">
                <ClockIcon className="size-4" />
                {task.effortHours}h
              </span>
            )}
          </div>

          {task.description && (
            <p className="text-sm whitespace-pre-wrap">{task.description}</p>
          )}

          {task.activity.length > 0 && (
            <div className="space-y-2 border-t pt-4">
              <h4 className="text-sm font-medium">Activity</h4>
              {task.activity.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    <span className="text-foreground font-medium">
                      {entry.actor.name}
                    </span>{" "}
                    {activityLabel(entry.type)} this task
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {new Date(entry.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          {canDelete && (
            <Button
              variant="destructive"
              onClick={onDelete}>
              <Trash2Icon />
              Delete
            </Button>
          )}
          {canEdit && <Button onClick={onEdit}>Edit task</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const activityLabel = (type: string) => {
  switch (type) {
    case "created":
      return "created";
    case "updated":
      return "updated";
    case "completed":
      return "completed";
    case "reopened":
      return "reopened";
    default:
      return type;
  }
};

export default TaskDetailDrawer;
